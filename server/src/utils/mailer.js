import nodemailer from "nodemailer";

let transporter;

export function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 465,
      secure: String(SMTP_SECURE ?? "true") === "true",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  } else {
    // No SMTP configured: don't crash, just print emails to the console (handy while developing).
    console.warn("⚠️  SMTP not configured — emails will be printed to the console instead of sent.");
    transporter = {
      sendMail: async (msg) => {
        console.log("\n──────── EMAIL (dev mode, not sent) ────────");
        console.log(
          `To:       ${msg.to}\nReply-To: ${msg.replyTo || "-"}\nSubject:  ${msg.subject}\n\n${msg.text}`
        );
        console.log("─────────────────────────────────────────────\n");
        return { messageId: "dev-fallback" };
      },
    };
  }
  return transporter;
}

export const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const from = () =>
  `"${process.env.MAIL_FROM_NAME || "Website"}" <${process.env.SMTP_USER || "no-reply@localhost"}>`;

// Builds a clean HTML + plain-text table from [label, value] rows.
function render(title, rows, { intro, footer } = {}) {
  const text = `${title}\n\n${intro ? `${intro}\n\n` : ""}${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}${footer ? `\n\n${footer}` : ""}`;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#2f3a56">
    <h2 style="color:#f4694f;margin-bottom:12px">${escapeHtml(title)}</h2>
    ${intro ? `<p style="margin:0 0 14px">${escapeHtml(intro)}</p>` : ""}
    <table style="width:100%;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) => `<tr>
            <td style="padding:8px 10px;border-bottom:1px solid #eee;font-weight:bold;width:150px;vertical-align:top">${escapeHtml(k)}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td>
          </tr>`
        )
        .join("")}
    </table>
    ${footer ? `<p style="margin-top:18px;color:#6b7794">${escapeHtml(footer)}</p>` : ""}
  </div>`;
  return { text, html };
}

// Email to the owner (Pragya) containing the customer's details.
export async function notifyOwner({ subject, title, rows, replyTo }) {
  const { text, html } = render(title, rows, { footer: "Hit Reply to answer the customer directly." });
  return getTransporter().sendMail({
    from: from(),
    to: process.env.OWNER_EMAIL,
    replyTo,
    subject,
    text,
    html,
  });
}

// Optional friendly confirmation to the customer.
export async function confirmToCustomer({ to, name, subject, intro, rows }) {
  const { text, html } = render(`Hi ${name},`, rows, { intro });
  return getTransporter().sendMail({
    from: from(),
    to,
    replyTo: process.env.OWNER_EMAIL,
    subject,
    text,
    html,
  });
}
