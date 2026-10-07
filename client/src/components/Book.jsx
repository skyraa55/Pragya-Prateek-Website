import { useRef, useState } from "react";
import { api } from "../api.js";
import { useSite } from "../useSite.js";

const steps = [
  { num: 1, title: "Choose a focus", desc: "Career guidance, a workshop, professional growth guidance or a collaboration." },
  { num: 2, title: "Share your details", desc: "Add your queries or objective, and your preferred slot below." },
  { num: 3, title: "Pay & connect", desc: "Pay the session fee securely online, then we meet and you take your next step with clarity." },
];

// `label` must match server/src/utils/services.js. `fee` links a service to its fee in Admin → Site settings.
const TOPICS = [
  { label: "1:1 Psychology Career Guidance Session", fee: "career" },
  { label: "Workshop / Program Enquiry", fee: "workshop" },
  { label: "Professional Growth Guidance", fee: "growth" },
  { label: "Collaboration / Project Call", fee: null },
];
const MODES = ["Video call", "Phone call", "WhatsApp chat"];
const TIMES = ["Morning (9am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 8pm)"];

const empty = {
  name: "",
  email: "",
  phone: "",
  topic: TOPICS[0].label,
  mode: MODES[0],
  date: "",
  time: TIMES[0],
  message: "",
  website: "", // honeypot — hidden from people, bots fill it in
};

const today = () => new Date().toISOString().slice(0, 10);
const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

// Razorpay Checkout is loaded only when someone actually needs to pay.
const loadRazorpay = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Couldn't load the secure payment window. Please check your connection and try again."));
    document.body.appendChild(s);
  });

export default function Book() {
  const site = useSite();
  const [form, setForm] = useState(empty);
  // idle | sending | success (free / link) | paying | verifying | paid | unpaid | error
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [link, setLink] = useState(null); // { fee, link } — fallback when the gateway is not switched on
  const [pay, setPay] = useState(null); // details needed to (re)open checkout
  const [receipt, setReceipt] = useState(null);
  const finished = useRef(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const selected = TOPICS.find((t) => t.label === form.topic);
  const fee = selected?.fee ? site.fees[selected.fee] : "";
  const payOnline = !!fee && site.paymentsEnabled;

  const openCheckout = async (p) => {
    setError("");
    try {
      await loadRazorpay();
    } catch (err) {
      setError(err.message);
      setStatus("unpaid");
      return;
    }
    finished.current = false;
    setStatus("paying");
    const rzp = new window.Razorpay({
      key: p.keyId,
      amount: p.amount,
      currency: p.currency,
      order_id: p.orderId,
      name: "Pragya Prateek",
      description: p.topic,
      prefill: { name: p.name, email: p.email, contact: p.phone },
      theme: { color: "#f4694f" },
      handler: async (r) => {
        finished.current = true;
        setStatus("verifying");
        try {
          await api.verifyPayment({
            bookingId: p.bookingId,
            razorpay_order_id: r.razorpay_order_id,
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
          });
          setReceipt({ bookingId: p.bookingId, amount: p.amount, paymentId: r.razorpay_payment_id });
          setStatus("paid");
        } catch (err) {
          setError(err.message);
          setStatus("error");
        }
      },
      modal: {
        ondismiss: () => {
          if (!finished.current) setStatus("unpaid");
        },
      },
    });
    rzp.on("payment.failed", (resp) => {
      setError(resp?.error?.description || "The payment didn't go through.");
    });
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await api.sendBooking(form);
      const p = res?.payment;
      if (p?.required) {
        const details = { ...p, topic: form.topic, name: form.name, email: form.email, phone: form.phone };
        setPay(details);
        setForm(empty);
        await openCheckout(details); // booking is saved; now collect the fee
      } else {
        setLink(p?.link ? p : null);
        setStatus("success");
        setForm(empty);
      }
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setLink(null);
    setPay(null);
    setReceipt(null);
    setError("");
  };

  const busy = status === "sending" || status === "paying" || status === "verifying";

  return (
    <section className="py-16 bg-gradient-to-br from-[#eef4ff] to-[#fbf0ff]" id="book">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[60ch] mx-auto mb-8">
          <span className="eyebrow">Book a Session</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Book a Session or Discuss Your Idea</h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Whether it is career guidance, a workshop, professional growth or a collaboration, tell me a little about what you have in mind before we connect.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
          {steps.map((s) => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              <h4 className="font-quicksand font-bold mb-1">{s.title}</h4>
              <p className="text-[.9rem] text-ink-soft">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl2 p-6 sm:p-8 shadow-soft max-w-[720px] mx-auto">
          <h3 className="text-[1.4rem] font-bold mb-1 text-center">Ready to begin?</h3>
          <p className="text-ink-soft text-center mb-2">
            Share your queries, objective or a short message and I'll get back to you personally.
          </p>

          {status === "success" && (
            <div className="text-center py-8" role="status">
              <div className="text-[3rem]">🌿</div>
              <h4 className="font-quicksand font-bold text-[1.2rem] mt-2">Request sent — thank you!</h4>
              <p className="text-ink-soft mt-1 mb-5">I'll reach out to you soon to confirm. A copy has been emailed to you.</p>
              {link && (
                <a className="btn btn-primary mb-3" href={link.link} target="_blank" rel="noopener noreferrer">
                  Pay the session fee{link.fee ? ` (${inr(link.fee)})` : ""} →
                </a>
              )}
              <div><button className="btn btn-line" onClick={reset}>Make another booking</button></div>
            </div>
          )}

          {status === "paid" && receipt && (
            <div className="text-center py-8" role="status">
              <div className="text-[3rem]">🎉</div>
              <h4 className="font-quicksand font-bold text-[1.2rem] mt-2">Payment received — your booking is confirmed!</h4>
              <p className="text-ink-soft mt-1">
                {inr(receipt.amount / 100)} paid securely. I'll reach out to you soon to confirm the time.
                A confirmation has been emailed to you.
              </p>
              <p className="text-[.85rem] text-ink-soft mt-3">
                Booking reference: <b className="font-quicksand">{receipt.bookingId}</b>
              </p>
              <div className="mt-5"><button className="btn btn-line" onClick={reset}>Make another booking</button></div>
            </div>
          )}

          {status === "verifying" && (
            <div className="text-center py-10" role="status">
              <div className="text-[2.4rem]">⏳</div>
              <h4 className="font-quicksand font-bold text-[1.1rem] mt-2">Confirming your payment…</h4>
              <p className="text-ink-soft mt-1">Please don't close this page.</p>
            </div>
          )}

          {status === "unpaid" && pay && (
            <div className="text-center py-8" role="status">
              <div className="text-[2.6rem]">💳</div>
              <h4 className="font-quicksand font-bold text-[1.2rem] mt-2">Your request is saved — payment isn't complete yet</h4>
              <p className="text-ink-soft mt-1 mb-2">
                Your booking is held, but it is confirmed only once the fee ({inr(pay.amount / 100)}) is paid.
              </p>
              {error && <p className="text-coral-deep font-semibold mb-2" role="alert">{error}</p>}
              <div className="flex gap-3 justify-center flex-wrap mt-4">
                <button className="btn btn-primary" onClick={() => openCheckout(pay)}>Pay {inr(pay.amount / 100)} now →</button>
                <button className="btn btn-line" onClick={reset}>Not now</button>
              </div>
            </div>
          )}

          {(status === "idle" || status === "sending" || status === "paying" || status === "error") && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <div>
                  <label className="field-label" htmlFor="b-name">Your name *</label>
                  <input className="field-input" id="b-name" name="name" required maxLength={100}
                    placeholder="e.g. Aditi Sharma" value={form.name} onChange={handleChange} />
                </div>
                <div>
                  <label className="field-label" htmlFor="b-email">Email *</label>
                  <input className="field-input" id="b-email" name="email" type="email" required
                    placeholder="you@email.com" value={form.email} onChange={handleChange} />
                </div>
                <div>
                  <label className="field-label" htmlFor="b-phone">Phone / WhatsApp</label>
                  <input className="field-input" id="b-phone" name="phone" type="tel" maxLength={30}
                    placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                </div>
                <div>
                  <label className="field-label" htmlFor="b-topic">Booking for *</label>
                  <select className="field-input" id="b-topic" name="topic" value={form.topic} onChange={handleChange}>
                    {TOPICS.map((t) => <option key={t.label}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="b-mode">How would you like to meet?</label>
                  <select className="field-input" id="b-mode" name="mode" value={form.mode} onChange={handleChange}>
                    {MODES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="b-date">Preferred date</label>
                  <input className="field-input" id="b-date" name="date" type="date" min={today()}
                    value={form.date} onChange={handleChange} />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="b-time">Preferred time</label>
                  <select className="field-input" id="b-time" name="time" value={form.time} onChange={handleChange}>
                    {TIMES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <label className="field-label" htmlFor="b-message">Your queries, objective or message</label>
              <textarea className="field-input min-h-[100px] resize-y" id="b-message" name="message"
                maxLength={2000} placeholder="Type your queries or objective here..."
                value={form.message} onChange={handleChange} />

              {fee && (
                <p className="mt-3 rounded-2xl bg-[#fff5ee] px-4 py-3 text-[.92rem] text-ink-soft" id="fee-note">
                  <b className="font-quicksand text-ink">Session fee: {inr(fee)}</b>
                  {payOnline ? " — you'll pay securely online (UPI, cards, netbanking) right after you submit." : " — payment details are shared after you submit."}
                </p>
              )}

              {/* Honeypot: invisible to people */}
              <input type="text" name="website" value={form.website} onChange={handleChange}
                tabIndex={-1} autoComplete="off" aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

              {status === "error" && (
                <p className="text-coral-deep font-semibold mt-3" role="alert">{error}</p>
              )}

              <button className="btn btn-primary w-full justify-center mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit" disabled={busy}>
                {status === "sending" ? "Sending…" : status === "paying" ? "Opening secure payment…" : payOnline ? `Pay ${inr(fee)} & Book →` : "Send Booking Request →"}
              </button>
              {payOnline && (
                <p className="text-center text-[.78rem] text-ink-soft mt-2">🔒 Payments are processed securely by Razorpay.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
