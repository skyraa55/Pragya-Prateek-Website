import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";
import { useSite } from "../useSite.js";

/* ---------- Theme (same brand palette as About / Services) ---------- */
const C = {
  pink: "#ff4d6d",
  orange: "#ff9f43",
  purple: "#8b6fe0",
  navy: "#14274e",
  soft: "#4a5a7a",
  bg: "#fffaf5",
  line: "#eadfd6",
  tintPink: "#fff1f3",
  tintYellow: "#fff6e3",
  tintPurple: "#f1edfc",
  tintGreen: "#ecf9f3",
};

const steps = [
  { num: 1, title: "Choose a focus", desc: "Career guidance, a workshop, professional growth guidance or a collaboration.", color: C.pink, tint: C.tintPink },
  { num: 2, title: "Share your details", desc: "Add your queries or objective, and your preferred slot below.", color: C.orange, tint: C.tintYellow },
  { num: 3, title: "Pay & connect", desc: "Pay the session fee securely online, then we meet and you take your next step with clarity.", color: C.purple, tint: C.tintPurple },
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

/* ---------- Small UI helpers ---------- */
function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`bk-rv ${show ? "bk-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

const Grad = ({ children }) => <span className="bk-word">{children}</span>;
const Req = () => <span className="bk-req" aria-hidden="true"> *</span>;

const Icon = ({ children, size = 34 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const CheckIcon = (p) => <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>;
const CardIcon = (p) => (
  <Icon {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="M2.5 10h19M6.5 15h4" />
  </Icon>
);
const LockIcon = (p) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);

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
      theme: { color: "#ff4d6d" },
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
    <section id="book" className="book-root" style={{ color: C.navy }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap');
        .book-root{
          font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;
          background:
            radial-gradient(50% 40% at 8% 0%, ${C.tintPink} 0%, transparent 70%),
            radial-gradient(45% 40% at 95% 100%, ${C.tintPurple} 0%, transparent 70%),
            ${C.bg};
          padding:clamp(4rem,8vw,6.5rem) 0;
        }
        .book-root *,.book-root *::before,.book-root *::after{box-sizing:border-box}
        .book-root h2,.book-root h3,.book-root h4,.book-root p,.book-root ol,.book-root ul{margin:0;padding:0}
        .book-root ol,.book-root ul{list-style:none}
        .bk-wrap{width:92%;max-width:1120px;margin:0 auto}

        /* header */
        .bk-head{display:flex;flex-direction:column;align-items:center;gap:1.1rem;text-align:center}
        .bk-label{font-size:.95rem;font-weight:600;color:#e23a5c}
        .bk-h2{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;line-height:1.18;letter-spacing:-.02em}
        .bk-intro{max-width:60ch;font-size:1.06rem;line-height:1.85;color:${C.soft}}
        .bk-word{
          display:inline-block;
          background:linear-gradient(100deg,${C.pink},${C.orange},${C.purple},${C.pink});background-size:300% 100%;
          -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
          animation:bkFlow 7s ease-in-out infinite;
        }
        @keyframes bkFlow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

        /* scroll reveal (fade only) */
        .bk-rv{opacity:0;transition:opacity .9s cubic-bezier(.22,1,.36,1)}
        .bk-in{opacity:1}

        /* layout */
        .bk-grid{display:grid;grid-template-columns:1fr;gap:clamp(2rem,4vw,3rem);margin-top:clamp(2.75rem,5vw,4rem);align-items:start}
        @media (min-width:1024px){.bk-grid{grid-template-columns:5fr 7fr;gap:clamp(2.5rem,4.5vw,4rem)}}

        /* steps */
        .bk-steps{background:${C.tintPink};border-radius:clamp(28px,4vw,38px);padding:clamp(1.75rem,4vw,2.75rem)}
        .bk-steps-t{font-size:1.05rem;font-weight:700;color:${C.soft};margin-bottom:1.75rem}
        .bk-step{position:relative;display:flex;gap:1.15rem;padding-bottom:2rem}
        .bk-step:last-child{padding-bottom:0}
        .bk-step-n{
          position:relative;z-index:1;display:grid;place-items:center;flex-shrink:0;width:46px;height:46px;border-radius:50%;
          background:var(--c);color:#fff;font-size:1.05rem;font-weight:800;box-shadow:0 0 0 6px ${C.tintPink};
        }
        .bk-step:not(:last-child)::after{
          content:"";position:absolute;left:22px;top:46px;bottom:0;width:2px;border-radius:2px;
          background:linear-gradient(to bottom,var(--c),var(--next));
          transform:scaleY(0);transform-origin:top;transition:transform .9s cubic-bezier(.22,1,.36,1);transition-delay:var(--d,0ms);
        }
        .bk-in .bk-step:not(:last-child)::after{transform:scaleY(1)}
        .bk-in .bk-step-n{animation:bkPop .7s cubic-bezier(.3,1.5,.5,1) backwards;animation-delay:var(--d,0ms)}
        @keyframes bkPop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:none}}
        .bk-step-t{font-size:1.08rem;font-weight:700;line-height:1.35;padding-top:.7rem}
        .bk-step-d{margin-top:.4rem;font-size:.97rem;line-height:1.75;color:${C.soft}}

        /* form card */
        .bk-card{background:#fff;border-radius:clamp(28px,4vw,38px);padding:clamp(1.75rem,4vw,3rem);box-shadow:0 34px 70px -46px rgba(20,39,78,.5);border:1px solid ${C.line}}
        .bk-card-t{font-size:clamp(1.4rem,2.4vw,1.75rem);font-weight:700;letter-spacing:-.015em}
        .bk-card-p{margin-top:.6rem;font-size:1rem;line-height:1.75;color:${C.soft}}
        .bk-form{margin-top:2rem;display:flex;flex-direction:column;gap:1.25rem;position:relative}
        .bk-fields{display:grid;grid-template-columns:1fr;gap:1.25rem 1.25rem}
        @media (min-width:640px){.bk-fields{grid-template-columns:1fr 1fr}.bk-span{grid-column:span 2}}
        .bk-label-f{display:block;font-size:.9rem;font-weight:700;margin-bottom:.5rem}
        .bk-req{color:${C.pink}}
        .bk-input{
          width:100%;font-family:inherit;font-size:.98rem;color:${C.navy};background:#fffdfb;
          border:1.5px solid ${C.line};border-radius:14px;padding:.85rem 1rem;outline:none;
          transition:border-color .25s ease,box-shadow .25s ease,background .25s ease;
        }
        .bk-input::placeholder{color:#9aa5bb}
        .bk-input:hover{border-color:#d9cdc3}
        .bk-input:focus{border-color:${C.pink};background:#fff;box-shadow:0 0 0 4px rgba(255,77,109,.14)}
        select.bk-input{
          appearance:none;-webkit-appearance:none;cursor:pointer;padding-right:2.6rem;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a5a7a' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat:no-repeat;background-position:right .9rem center;background-size:18px;
        }
        textarea.bk-input{min-height:130px;resize:vertical;line-height:1.7}

        .bk-fee{border-radius:18px;background:${C.tintYellow};padding:1rem 1.25rem;font-size:.95rem;line-height:1.7;color:${C.soft}}
        .bk-fee b{color:${C.navy};font-weight:700}
        .bk-err{font-size:.95rem;font-weight:600;color:#e23a5c}
        .bk-secure{display:flex;align-items:center;justify-content:center;gap:.5rem;font-size:.82rem;color:${C.soft}}

        /* buttons */
        .bk-btn{
          display:inline-flex;align-items:center;justify-content:center;gap:.4rem;padding:.9rem 1.6rem;border-radius:999px;
          font-family:inherit;font-size:.96rem;font-weight:700;line-height:1.2;border:1.5px solid transparent;cursor:pointer;text-decoration:none;
          transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease,color .3s ease;
        }
        .bk-btn:hover:not(:disabled){transform:translateY(-2px)}
        .bk-btn:focus-visible{outline:3px solid rgba(255,77,109,.35);outline-offset:3px}
        .bk-btn:disabled{opacity:.6;cursor:not-allowed}
        .bk-btn-primary{color:#fff;background:linear-gradient(120deg,${C.pink},${C.orange});box-shadow:0 16px 28px -16px rgba(255,77,109,.8)}
        .bk-btn-primary:hover:not(:disabled){box-shadow:0 20px 32px -16px rgba(255,77,109,.9)}
        .bk-btn-line{color:${C.navy};background:#fff;border-color:rgba(20,39,78,.18)}
        .bk-btn-line:hover{border-color:${C.pink};color:#e23a5c}
        .bk-block{width:100%}

        /* status screens */
        .bk-state{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.5rem 0 .5rem}
        .bk-state-ic{display:grid;place-items:center;width:76px;height:76px;border-radius:50%;margin-bottom:1.4rem;animation:bkPop .8s cubic-bezier(.3,1.5,.5,1) backwards}
        .bk-state-t{font-size:1.35rem;font-weight:700;line-height:1.3;letter-spacing:-.01em;max-width:28ch}
        .bk-state-p{margin-top:.75rem;max-width:44ch;font-size:1rem;line-height:1.75;color:${C.soft}}
        .bk-state-ref{margin-top:1.1rem;font-size:.88rem;color:${C.soft}}
        .bk-state-ref b{color:${C.navy}}
        .bk-state-btns{display:flex;flex-wrap:wrap;gap:.8rem;justify-content:center;margin-top:1.75rem}
        .bk-spin{width:46px;height:46px;border-radius:50%;border:4px solid ${C.tintPink};border-top-color:${C.pink};animation:bkSpin 1s linear infinite}
        @keyframes bkSpin{to{transform:rotate(360deg)}}

        @media (prefers-reduced-motion:reduce){
          .book-root *:not(.bk-spin),.book-root *:not(.bk-spin)::before,.book-root *:not(.bk-spin)::after{animation:none!important;transition:none!important}
          .bk-rv{opacity:1!important}
        }
      `}</style>

      <div className="bk-wrap">
        {/* Header */}
        <div className="bk-head">
          <Reveal><span className="bk-label">Book a Session</span></Reveal>
          <Reveal delay={80}>
            <h2 className="bk-h2">
              Book a Session or Discuss <Grad>Your Idea</Grad>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="bk-intro">
              Whether it is career guidance, a workshop, professional growth or a collaboration, tell me a little about what you have in mind before we connect.
            </p>
          </Reveal>
        </div>

        <div className="bk-grid">
          {/* How it works */}
          <Reveal>
            <div className="bk-steps">
              <p className="bk-steps-t">How it works</p>
              <ol>
                {steps.map((s, i) => (
                  <li
                    key={s.num}
                    className="bk-step"
                    style={{ "--c": s.color, "--next": steps[i + 1]?.color || s.color, "--d": `${250 + i * 350}ms` }}
                  >
                    <span className="bk-step-n">{s.num}</span>
                    <div>
                      <h4 className="bk-step-t">{s.title}</h4>
                      <p className="bk-step-d">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          {/* Form / status */}
          <Reveal delay={120}>
            <div className="bk-card">
              {status === "idle" || status === "sending" || status === "paying" || status === "error" ? (
                <>
                  <h3 className="bk-card-t">Ready to begin?</h3>
                  <p className="bk-card-p">
                    Share your queries, objective or a short message and I'll get back to you personally.
                  </p>
                </>
              ) : null}

              {status === "success" && (
                <div className="bk-state" role="status">
                  <span className="bk-state-ic" style={{ background: C.tintGreen, color: "#2fb585" }}><CheckIcon /></span>
                  <h4 className="bk-state-t">Request sent — thank you!</h4>
                  <p className="bk-state-p">I'll reach out to you soon to confirm. A copy has been emailed to you.</p>
                  <div className="bk-state-btns">
                    {link && (
                      <a className="bk-btn bk-btn-primary" href={link.link} target="_blank" rel="noopener noreferrer">
                        Pay the session fee{link.fee ? ` (${inr(link.fee)})` : ""} →
                      </a>
                    )}
                    <button className="bk-btn bk-btn-line" onClick={reset}>Make another booking</button>
                  </div>
                </div>
              )}

              {status === "paid" && receipt && (
                <div className="bk-state" role="status">
                  <span className="bk-state-ic" style={{ background: C.tintPink, color: C.pink }}><CheckIcon /></span>
                  <h4 className="bk-state-t">Payment received — your booking is confirmed!</h4>
                  <p className="bk-state-p">
                    {inr(receipt.amount / 100)} paid securely. I'll reach out to you soon to confirm the time.
                    A confirmation has been emailed to you.
                  </p>
                  <p className="bk-state-ref">
                    Booking reference: <b>{receipt.bookingId}</b>
                  </p>
                  <div className="bk-state-btns">
                    <button className="bk-btn bk-btn-line" onClick={reset}>Make another booking</button>
                  </div>
                </div>
              )}

              {status === "verifying" && (
                <div className="bk-state" role="status" style={{ padding: "2.5rem 0 1.5rem" }}>
                  <div className="bk-spin" style={{ marginBottom: "1.5rem" }} aria-hidden="true" />
                  <h4 className="bk-state-t">Confirming your payment…</h4>
                  <p className="bk-state-p">Please don't close this page.</p>
                </div>
              )}

              {status === "unpaid" && pay && (
                <div className="bk-state" role="status">
                  <span className="bk-state-ic" style={{ background: C.tintYellow, color: C.orange }}><CardIcon /></span>
                  <h4 className="bk-state-t">Your request is saved — payment isn't complete yet</h4>
                  <p className="bk-state-p">
                    Your booking is held, but it is confirmed only once the fee ({inr(pay.amount / 100)}) is paid.
                  </p>
                  {error && <p className="bk-err" style={{ marginTop: ".9rem" }} role="alert">{error}</p>}
                  <div className="bk-state-btns">
                    <button className="bk-btn bk-btn-primary" onClick={() => openCheckout(pay)}>Pay {inr(pay.amount / 100)} now →</button>
                    <button className="bk-btn bk-btn-line" onClick={reset}>Not now</button>
                  </div>
                </div>
              )}

              {(status === "idle" || status === "sending" || status === "paying" || status === "error") && (
                <form className="bk-form" onSubmit={handleSubmit}>
                  <div className="bk-fields">
                    <div>
                      <label className="bk-label-f" htmlFor="b-name">Your name<Req /></label>
                      <input className="bk-input" id="b-name" name="name" required maxLength={100}
                        placeholder="e.g. Aditi Sharma" value={form.name} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="bk-label-f" htmlFor="b-email">Email<Req /></label>
                      <input className="bk-input" id="b-email" name="email" type="email" required
                        placeholder="you@email.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="bk-label-f" htmlFor="b-phone">Phone / WhatsApp<Req /></label>
                      <input className="bk-input" id="b-phone" name="phone" type="tel" required maxLength={30}
                        placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="bk-label-f" htmlFor="b-topic">Booking for<Req /></label>
                      <select className="bk-input" id="b-topic" name="topic" required value={form.topic} onChange={handleChange}>
                        {TOPICS.map((t) => <option key={t.label}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="bk-label-f" htmlFor="b-mode">How would you like to meet?<Req /></label>
                      <select className="bk-input" id="b-mode" name="mode" required value={form.mode} onChange={handleChange}>
                        {MODES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="bk-label-f" htmlFor="b-date">Preferred date<Req /></label>
                      <input className="bk-input" id="b-date" name="date" type="date" required min={today()}
                        value={form.date} onChange={handleChange} />
                    </div>
                    <div className="bk-span">
                      <label className="bk-label-f" htmlFor="b-time">Preferred time<Req /></label>
                      <select className="bk-input" id="b-time" name="time" required value={form.time} onChange={handleChange}>
                        {TIMES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="bk-label-f" htmlFor="b-message">Your queries, objective or message<Req /></label>
                    <textarea className="bk-input" id="b-message" name="message" required
                      maxLength={2000} placeholder="Type your queries or objective here..."
                      value={form.message} onChange={handleChange} />
                  </div>

                  {fee && (
                    <p className="bk-fee" id="fee-note">
                      <b>Session fee: {inr(fee)}</b>
                      {payOnline ? " — you'll pay securely online (UPI, cards, netbanking) right after you submit." : " — payment details are shared after you submit."}
                    </p>
                  )}

                  {/* Honeypot: invisible to people */}
                  <input type="text" name="website" value={form.website} onChange={handleChange}
                    tabIndex={-1} autoComplete="off" aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

                  {status === "error" && (
                    <p className="bk-err" role="alert">{error}</p>
                  )}

                  <button className="bk-btn bk-btn-primary bk-block" type="submit" disabled={busy}>
                    {status === "sending" ? "Sending…" : status === "paying" ? "Opening secure payment…" : payOnline ? `Pay ${inr(fee)} & Book →` : "Send Booking Request →"}
                  </button>
                  {payOnline && (
                    <p className="bk-secure">
                      <LockIcon size={15} /> Payments are processed securely by Razorpay.
                    </p>
                  )}
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}