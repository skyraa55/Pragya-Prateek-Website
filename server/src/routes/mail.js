import { Router } from "express";
import rateLimit from "express-rate-limit";
import { notifyOwner, confirmToCustomer } from "../utils/mailer.js";
import { clean, isEmail } from "../utils/validate.js";

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

// ---------- Book a session ----------
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
    if (!data.topic) return res.status(400).json({ error: "Please choose what the session is about." });
    if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date))
      return res.status(400).json({ error: "Invalid date." });

    const rows = [
      ["Name", data.name],
      ["Email", data.email],
      ["Phone / WhatsApp", data.phone || "—"],
      ["Session topic", data.topic],
      ["Preferred mode", data.mode || "—"],
      ["Preferred date", data.date || "—"],
      ["Preferred time", data.time || "—"],
      ["Message", data.message || "—"],
    ];

    await notifyOwner({
      subject: `New session booking — ${data.name} (${data.topic})`,
      title: "📅 New session booking request",
      rows,
      replyTo: data.email,
    });

    if (wantsConfirmation()) {
      // A failed confirmation must not make the booking look failed — the owner already got it.
      confirmToCustomer({
        to: data.email,
        name: data.name,
        subject: "We received your session request",
        intro: "Thank you for reaching out! Pragya will personally get back to you soon to confirm the time. Here is what you sent:",
        rows,
      }).catch((e) => console.error("Confirmation email failed:", e.message));
    }

    res.json({ ok: true, message: "Request sent! I'll get back to you personally." });
  } catch (err) {
    next(err);
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
        ["Topic", data.topic || "—"],
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
