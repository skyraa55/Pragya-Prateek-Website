import { Router } from "express";
import rateLimit from "express-rate-limit";
import { notifyOwner } from "../utils/mailer.js";
import { clean, isEmail } from "../utils/validate.js";
import { getSettings } from "./settings.js";
import { serviceKeyFor } from "../utils/services.js";
import { readAll, update, newId } from "../utils/store.js";
import { requireAdmin } from "../middleware/auth.js";
import { feeToPaise, razorpayConfigured, createOrder, publicKeyId } from "../utils/payments.js";
import { emailOwnerNewBooking, emailCustomerConfirmation } from "../utils/bookingMail.js";

// Single-line text (used in email subjects): collapse any line breaks to prevent header injection.
const oneLine = (v, max) => clean(v, max).replace(/\s+/g, " ");

const router = Router();

// Max 8 form submissions / hour per IP — stops spam from flooding the inbox.
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const wantsConfirmation = () => String(process.env.SEND_CUSTOMER_CONFIRMATION ?? "true") === "true";

// ---------- Book a session (optionally with online payment) ----------
router.post("/bookings", formLimiter, async (req, res, next) => {
  try {
    const b = req.body || {};
    // Hidden "website" field: real people leave it empty, spam bots fill it. Pretend success.
    if (clean(b.website)) return res.json({ ok: true });

    const data = {
      name: oneLine(b.name, 100),
      email: clean(b.email, 254).toLowerCase(),
      phone: clean(b.phone, 30),
      topic: oneLine(b.topic, 100),
      mode: clean(b.mode, 40),
      date: clean(b.date, 20),
      time: clean(b.time, 40),
      message: clean(b.message, 2000),
    };

    if (!data.name) return res.status(400).json({ error: "Please enter your name." });
    if (!isEmail(data.email)) return res.status(400).json({ error: "Please enter a valid email." });
    if (!data.topic) return res.status(400).json({ error: "Please choose what you would like to book." });
    if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date))
      return res.status(400).json({ error: "Invalid date." });

    // The FEE IS DECIDED HERE on the server (from Admin → Site settings) — never trusted from the browser.
    const settings = await getSettings().catch(() => ({}));
    const key = serviceKeyFor(data.topic);
    const amount = key ? feeToPaise(settings[`${key}Fee`]) : 0;
    const link = key ? settings[`${key}Link`] || "" : "";

    const id = newId();
    let booking = { id, ...data, serviceKey: key, amount: 0, currency: "INR", status: "free", createdAt: new Date().toISOString() };
    let payment = null;

    if (amount > 0 && razorpayConfigured()) {
      // ---- Online payment via Razorpay Checkout ----
      let order;
      try {
        order = await createOrder({ amount, receipt: id, notes: { bookingId: id, service: data.topic, customer: data.email } });
      } catch (e) {
        console.error("Razorpay order failed:", e.message);
        return res.status(502).json({ error: "The payment service is not reachable right now. Please try again in a moment." });
      }
      booking = { ...booking, amount, status: "pending", razorpayOrderId: order.id };
      payment = { required: true, keyId: publicKeyId(), orderId: order.id, amount, currency: "INR", bookingId: id };
    } else if (amount > 0 && link) {
      // Gateway keys not set yet → fall back to the owner's own payment link.
      booking = { ...booking, amount, status: "link" };
      payment = { required: false, link, fee: String(amount / 100) };
    } else if (link) {
      booking = { ...booking, status: "link" };
      payment = { required: false, link, fee: "" };
    }

    await update("bookings", (items) => {
      items.push(booking);
    });

    await emailOwnerNewBooking(booking);

    // Pay-now bookings get their confirmation email after the payment succeeds.
    if (wantsConfirmation() && booking.status !== "pending") {
      emailCustomerConfirmation(booking, { link: booking.status === "link" ? link : "" }).catch((e) =>
        console.error("Confirmation email failed:", e.message)
      );
    }

    res.json({ ok: true, message: "Request sent! I'll get back to you personally.", payment });
  } catch (err) {
    next(err);
  }
});

// ---------- Owner: see every booking and whether it was paid ----------
router.get("/bookings", requireAdmin, async (_req, res, next) => {
  try {
    const all = await readAll("bookings");
    res.json(all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (e) {
    next(e);
  }
});

router.delete("/bookings/:id", requireAdmin, async (req, res, next) => {
  try {
    const removed = await update("bookings", (items) => {
      const i = items.findIndex((x) => x.id === req.params.id);
      if (i === -1) return false;
      items.splice(i, 1);
      return true;
    });
    if (!removed) return res.status(404).json({ error: "Booking not found." });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ---------- Contact form ----------
router.post("/contact", formLimiter, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (clean(b.website)) return res.json({ ok: true });

    const data = {
      name: oneLine(b.name, 100),
      email: clean(b.email, 254).toLowerCase(),
      topic: oneLine(b.topic, 100),
      msg: clean(b.msg, 3000),
    };
    if (!data.name) return res.status(400).json({ error: "Please enter your name." });
    if (!isEmail(data.email)) return res.status(400).json({ error: "Please enter a valid email." });

    await notifyOwner({
      subject: `Website enquiry — ${data.topic || "General"} (${data.name})`,
      title: "✉️ New message from the website",
      rows: [
        ["Name", data.name],
        ["Email", data.email],
        ["Discussing", data.topic || "—"],
        ["Message", data.msg || "—"],
      ],
      replyTo: data.email,
    });

    res.json({ ok: true, message: "Message sent! I read every one." });
  } catch (err) {
    next(err);
  }
});

export default router;
