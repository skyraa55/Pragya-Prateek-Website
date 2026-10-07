import { notifyOwner, confirmToCustomer } from "./mailer.js";

export const inr = (paise) =>
  `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const PAYMENT_LABEL = {
  pending: "⏳ Awaiting payment",
  paid: "✅ Paid",
  link: "Payment link shared with customer",
  free: "No fee",
};

export function rowsFor(b) {
  const rows = [
    ["Name", b.name],
    ["Email", b.email],
    ["Phone / WhatsApp", b.phone || "—"],
    ["Booking for", b.topic],
    ["Preferred mode", b.mode || "—"],
    ["Preferred date", b.date || "—"],
    ["Preferred time", b.time || "—"],
    ["Queries / objective / message", b.message || "—"],
  ];
  if (b.amount) rows.push(["Fee", inr(b.amount)]);
  rows.push(["Payment", PAYMENT_LABEL[b.status] + (b.status === "paid" && b.razorpayPaymentId ? ` (${b.razorpayPaymentId})` : "")]);
  rows.push(["Booking ref", b.id]);
  return rows;
}

// Sent as soon as the request is made (so the owner never loses a lead, even if payment is abandoned).
export const emailOwnerNewBooking = (b) =>
  notifyOwner({
    subject: `New booking request — ${b.name} (${b.topic})${b.status === "pending" ? " · payment pending" : ""}`,
    title: "📅 New booking request",
    rows: rowsFor(b),
    replyTo: b.email,
  });

export const emailOwnerPaid = (b) =>
  notifyOwner({
    subject: `✅ Payment received ${inr(b.amount)} — ${b.name} (${b.topic})`,
    title: "✅ Payment received",
    rows: rowsFor(b),
    replyTo: b.email,
  });

export const emailCustomerConfirmation = (b, { link } = {}) =>
  confirmToCustomer({
    to: b.email,
    name: b.name,
    subject: b.status === "paid" ? "Payment received — your booking is confirmed" : "We received your booking request",
    intro:
      b.status === "paid"
        ? `Thank you! Your payment of ${inr(b.amount)} was received. Pragya will personally get back to you soon to confirm the time. Keep your booking reference (${b.id}) for any queries.`
        : `Thank you for reaching out! Pragya will personally get back to you soon to confirm the time. Here is what you sent.${link ? ` To pay the fee, use this link: ${link}` : ""}`,
    rows: rowsFor(b),
  });
