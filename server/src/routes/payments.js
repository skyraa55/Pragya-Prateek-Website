import { Router } from "express";
import rateLimit from "express-rate-limit";
import { readAll, update } from "../utils/store.js";
import { verifyPaymentSignature, verifyWebhookSignature } from "../utils/payments.js";
import { emailOwnerPaid, emailCustomerConfirmation } from "../utils/bookingMail.js";

const router = Router();

const verifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again later." },
});

// Marks a booking paid exactly once (the browser callback and the webhook may both arrive).
async function markPaid(orderId, paymentId, paidAmount) {
  const result = await update("bookings", (items) => {
    const b = items.find((x) => x.razorpayOrderId === orderId);
    if (!b) return { b: null };
    if (b.status === "paid") return { b, already: true };
    if (paidAmount != null && Number(paidAmount) !== b.amount) return { b, mismatch: true };
    b.status = "paid";
    b.razorpayPaymentId = paymentId;
    b.paidAt = new Date().toISOString();
    return { b, already: false };
  });

  if (result.b && result.already === false) {
    // Emails must never make a successful payment look failed.
    emailOwnerPaid(result.b).catch((e) => console.error("Owner payment email failed:", e.message));
    emailCustomerConfirmation(result.b).catch((e) => console.error("Customer payment email failed:", e.message));
  }
  return result;
}

// Called by the website right after Razorpay Checkout succeeds.
router.post("/verify", verifyLimiter, async (req, res, next) => {
  try {
    const { bookingId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: sig } = req.body || {};
    const booking = (await readAll("bookings")).find((x) => x.id === String(bookingId || ""));
    if (!booking || booking.razorpayOrderId !== orderId)
      return res.status(400).json({ error: "We couldn't match this payment to a booking." });

    if (!verifyPaymentSignature(orderId, paymentId, sig))
      return res.status(400).json({ error: "Payment could not be verified. If money was deducted, it will be matched automatically or refunded — please contact us with your booking reference." });

    await markPaid(orderId, String(paymentId));
    res.json({ ok: true, bookingId: booking.id, amount: booking.amount });
  } catch (e) {
    next(e);
  }
});

// Safety net: Razorpay calls this even if the customer closes the tab right after paying.
// (mounted in index.js with a RAW body parser, because the signature covers the exact bytes)
export async function webhookHandler(req, res) {
  try {
    const raw = req.body; // Buffer
    if (!verifyWebhookSignature(raw, req.headers["x-razorpay-signature"])) return res.status(400).json({ error: "Bad signature." });

    const event = JSON.parse(raw.toString("utf8"));
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const p = event.payload?.payment?.entity;
      if (p?.order_id && p?.id) await markPaid(p.order_id, p.id, p.amount);
    }
    res.json({ ok: true });
  } catch (e) {
    console.error("Webhook error:", e.message);
    res.status(500).json({ error: "Webhook failed." });
  }
}

export default router;
