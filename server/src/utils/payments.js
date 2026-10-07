// Razorpay helpers — no SDK needed, just their REST API + HMAC signatures.
import crypto from "node:crypto";

const KEY_ID = () => process.env.RAZORPAY_KEY_ID || "";
const KEY_SECRET = () => process.env.RAZORPAY_KEY_SECRET || "";
const API_BASE = () => process.env.RAZORPAY_API_BASE || "https://api.razorpay.com/v1"; // overridable for tests

export const razorpayConfigured = () => Boolean(KEY_ID() && KEY_SECRET());
export const publicKeyId = () => KEY_ID();

// Admin types fees in rupees ("999", "₹1,499", "499.50"). Razorpay needs whole paise.
export function feeToPaise(fee) {
  const n = parseFloat(String(fee ?? "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n) || n < 1 || n > 500000) return 0; // ₹1 … ₹5,00,000
  return Math.round(n * 100);
}

export async function createOrder({ amount, receipt, notes }) {
  const auth = Buffer.from(`${KEY_ID()}:${KEY_SECRET()}`).toString("base64");
  const res = await fetch(`${API_BASE()}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount, currency: "INR", receipt, notes }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.description || `Razorpay responded with ${res.status}`);
  return data; // { id: "order_…", amount, currency, … }
}

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a || ""), "utf8");
  const y = Buffer.from(String(b || ""), "utf8");
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

// Checkout success proof: HMAC_SHA256(order_id|payment_id, key_secret) must equal the signature.
export function verifyPaymentSignature(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature) return false;
  const expected = crypto.createHmac("sha256", KEY_SECRET()).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqual(expected, signature);
}

// Webhook proof: HMAC_SHA256(raw request body, webhook_secret).
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}
