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
  { num: 2, title: "Pick a slot & share details", desc: "Choose a date and time that suits you, and add your queries or objective.", color: C.orange, tint: C.tintYellow },
  { num: 3, title: "Pay & connect", desc: "Pay the session fee securely online, then we meet and you take your next step with clarity.", color: C.purple, tint: C.tintPurple },
];

// `label` must match server/src/utils/services.js. `fee` links a service to its fee in Admin → Site settings.
const TOPICS = [
  { label: "1:1 Psychology Career Guidance Session", fee: "career" },
  { label: "Workshop / Program Enquiry", fee: "workshop" },
  { label: "Professional Growth Guidance", fee: "growth" },
  { label: "Collaboration / Project Call", fee: null },
];

/* ---------- Scheduling (Calendly-style) ---------- */
// Sessions run 10:00 AM – 6:00 PM IST. Each slot is one hour, so the last one starts at 5:00 PM.
const FIRST_HOUR = 10;
const LAST_HOUR = 18; // exclusive end of the working day
const MEETING_MODE = "Video call"; // fixed; the meeting link is shared after booking

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const hourLabel = (h) => `${h % 12 === 0 ? 12 : h % 12}:00 ${h >= 12 ? "PM" : "AM"}`;
const SLOTS = Array.from({ length: LAST_HOUR - FIRST_HOUR }, (_, i) => {
  const h = FIRST_HOUR + i;
  return { hour: h, label: hourLabel(h), value: `${hourLabel(h)} – ${hourLabel(h + 1)}` };
});

const pad = (n) => String(n).padStart(2, "0");
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`; // m is 0-based
const startOfToday = () => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
};
// Slots still bookable on a given date (today: only hours that haven't started yet)
const slotsFor = (iso) => {
  if (!iso) return [];
  const now = new Date();
  if (iso === toISO(now.getFullYear(), now.getMonth(), now.getDate())) {
    return SLOTS.filter((s) => s.hour > now.getHours());
  }
  return SLOTS;
};
const prettyDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

const empty = {
  name: "",
  email: "",
  phone: "",
  topic: TOPICS[0].label,
  mode: MEETING_MODE,
  date: "",
  time: "",
  message: "",
  website: "", // honeypot — hidden from people, bots fill it in
};

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
const ChevronIcon = ({ dir = "right", size = 18 }) => (
  <Icon size={size}>
    <path d={dir === "right" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} />
  </Icon>
);

/* ---------- Calendly-style date + time picker ---------- */
function Scheduler({ date, time, onPick, error }) {
  const now = startOfToday();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });

  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const atCurrentMonth = view.y === now.getFullYear() && view.m === now.getMonth();

  const go = (delta) => setView((v) => {
    const d = new Date(v.y, v.m + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const isAvailable = (d) => {
    const iso = toISO(view.y, view.m, d);
    if (new Date(view.y, view.m, d) < now) return false;
    return slotsFor(iso).length > 0;
  };

  const slots = slotsFor(date);

  return (
    <div className="bk-sched" aria-labelledby="sched-title">
      <div className="bk-sched-head">
        <p className="bk-label-f" id="sched-title" style={{ margin: 0 }}>Pick a date &amp; time<Req /></p>
        <p className="bk-sched-note">Sessions run {hourLabel(FIRST_HOUR)} – {hourLabel(LAST_HOUR)} · Times in IST</p>
      </div>

      <div className="bk-sched-body">
        {/* Calendar */}
        <div className="bk-cal">
          <div className="bk-cal-nav">
            <button type="button" className="bk-nav" onClick={() => go(-1)} disabled={atCurrentMonth} aria-label="Previous month">
              <ChevronIcon dir="left" />
            </button>
            <span className="bk-cal-month" aria-live="polite">{monthLabel}</span>
            <button type="button" className="bk-nav" onClick={() => go(1)} aria-label="Next month">
              <ChevronIcon />
            </button>
          </div>
          <div className="bk-cal-grid" role="grid">
            {WEEKDAYS.map((w) => <span key={w} className="bk-cal-wd" aria-hidden="true">{w}</span>)}
            {cells.map((d, i) => {
              if (d === null) return <span key={`e${i}`} />;
              const iso = toISO(view.y, view.m, d);
              const ok = isAvailable(d);
              const sel = iso === date;
              const isToday = iso === toISO(now.getFullYear(), now.getMonth(), now.getDate());
              return (
                <button
                  key={iso}
                  type="button"
                  className={`bk-day ${sel ? "bk-day-sel" : ""} ${isToday ? "bk-day-today" : ""}`}
                  disabled={!ok}
                  aria-pressed={sel}
                  aria-label={prettyDate(iso)}
                  onClick={() => onPick(iso, iso === date ? time : "")}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="bk-slots-wrap">
          {date ? (
            <>
              <p className="bk-slots-date">{prettyDate(date)}</p>
              <div className="bk-slots" role="group" aria-label="Available time slots">
                {slots.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={`bk-slot ${time === s.value ? "bk-slot-sel" : ""}`}
                    aria-pressed={time === s.value}
                    onClick={() => onPick(date, s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="bk-slots-empty">Select a date to see the available time slots.</p>
          )}
        </div>
      </div>

      {date && time && (
        <p className="bk-picked" role="status">
          <CheckIcon size={16} /> {prettyDate(date)} · {time} IST
        </p>
      )}
      {error && <p className="bk-err" role="alert">{error}</p>}
    </div>
  );
}

export default function Book() {
  const site = useSite();
  const [form, setForm] = useState(empty);
  // idle | sending | success (free / link) | paying | verifying | paid | unpaid | error
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [pickError, setPickError] = useState("");
  const [link, setLink] = useState(null); // { fee, link } — fallback when the gateway is not switched on
  const [pay, setPay] = useState(null); // details needed to (re)open checkout
  const [receipt, setReceipt] = useState(null);
  const finished = useRef(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePick = (date, time) => {
    setPickError("");
    setForm((f) => ({ ...f, date, time }));
  };

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
    if (!form.date || !form.time) {
      setPickError("Please choose a date and a time slot to continue.");
      return;
    }
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
    setPickError("");
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
          padding:clamp(3.5rem,8vw,6.5rem) 0;
        }
        .book-root *,.book-root *::before,.book-root *::after{box-sizing:border-box}
        :where(.book-root h2,.book-root h3,.book-root h4,.book-root p,.book-root ol,.book-root ul){margin:0;padding:0}
        .book-root ol,.book-root ul{list-style:none}
        .bk-wrap{width:92%;max-width:1120px;margin:0 auto}

        /* header */
        .bk-head{display:flex;flex-direction:column;align-items:center;gap:1.1rem;text-align:center}
        .bk-h2{font-size:clamp(1.65rem,5vw,2.8rem);font-weight:700;line-height:1.2;letter-spacing:-.02em}
        .bk-intro{max-width:60ch;font-size:clamp(.98rem,1.6vw,1.06rem);line-height:1.85;color:${C.soft}}
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
        .bk-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(2rem,4vw,3rem);margin-top:clamp(2.5rem,5vw,4rem);align-items:start}
        @media (min-width:1024px){.bk-grid{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(2.5rem,4.5vw,4rem)}}

        /* steps */
        .bk-steps{background:${C.tintPink};border-radius:clamp(26px,4vw,38px);padding:clamp(1.5rem,4vw,2.75rem)}
        @media (min-width:1024px){.bk-steps{position:sticky;top:1.5rem}}
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
        .bk-card{min-width:0;container:bkcard / inline-size;background:#fff;border-radius:clamp(26px,4vw,38px);padding:clamp(1.4rem,4vw,3rem);box-shadow:0 34px 70px -46px rgba(20,39,78,.5);border:1px solid ${C.line}}
        .bk-card-t{font-size:clamp(1.35rem,2.4vw,1.75rem);font-weight:700;letter-spacing:-.015em}
        .bk-card-p{margin-top:.6rem;font-size:1rem;line-height:1.75;color:${C.soft}}
        .bk-form{margin-top:2rem;display:flex;flex-direction:column;gap:1.25rem;position:relative}
        .bk-fields{display:grid;grid-template-columns:minmax(0,1fr);gap:1.25rem}
        @container bkcard (min-width:30rem){.bk-fields{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.bk-span{grid-column:span 2}}
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

        /* scheduler */
        .bk-sched{container:bksched / inline-size;border:1.5px solid ${C.line};border-radius:20px;padding:clamp(1rem,3vw,1.5rem);background:#fffdfb}
        .bk-sched-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.35rem 1rem;margin-bottom:1.1rem}
        .bk-sched-note{font-size:.84rem;color:${C.soft}}
        .bk-sched-body{display:grid;grid-template-columns:minmax(0,1fr);gap:1.5rem}
        @container bksched (min-width:32rem){.bk-sched-body{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:2rem}}

        .bk-cal-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:.8rem}
        .bk-cal-month{font-size:1rem;font-weight:700}
        .bk-nav{
          display:grid;place-items:center;width:38px;height:38px;border-radius:50%;border:1.5px solid ${C.line};background:#fff;color:${C.navy};cursor:pointer;
          transition:border-color .25s ease,color .25s ease;
        }
        .bk-nav:hover:not(:disabled){border-color:${C.pink};color:#e23a5c}
        .bk-nav:disabled{opacity:.35;cursor:not-allowed}
        .bk-cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
        .bk-cal-wd{text-align:center;font-size:.74rem;font-weight:700;color:${C.soft};padding:.35rem 0}
        .bk-day{
          aspect-ratio:1;display:grid;place-items:center;border-radius:50%;border:1.5px solid transparent;background:transparent;
          font-family:inherit;font-size:.92rem;font-weight:600;color:${C.navy};cursor:pointer;padding:0;
          transition:background .2s ease,color .2s ease,border-color .2s ease;
        }
        .bk-day:hover:not(:disabled):not(.bk-day-sel){background:${C.tintPink};color:#e23a5c}
        .bk-day:disabled{color:#b9c0cf;cursor:not-allowed;font-weight:500}
        .bk-day-today:not(.bk-day-sel){border-color:${C.line}}
        .bk-day-sel{background:linear-gradient(120deg,${C.pink},${C.orange});color:#fff}
        .bk-day:focus-visible,.bk-slot:focus-visible,.bk-nav:focus-visible{outline:3px solid rgba(255,77,109,.35);outline-offset:2px}

        .bk-slots-date{font-size:.95rem;font-weight:700;margin-bottom:.8rem}
        .bk-slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:.6rem}
        .bk-slot{
          padding:.7rem .5rem;border-radius:12px;border:1.5px solid ${C.line};background:#fff;color:${C.navy};
          font-family:inherit;font-size:.92rem;font-weight:700;cursor:pointer;
          transition:border-color .2s ease,background .2s ease,color .2s ease;
        }
        .bk-slot:hover:not(.bk-slot-sel){border-color:${C.pink};color:#e23a5c}
        .bk-slot-sel{background:${C.pink};border-color:${C.pink};color:#fff}
        .bk-slots-empty{font-size:.95rem;line-height:1.7;color:${C.soft};background:${C.tintYellow};border-radius:14px;padding:1rem 1.1rem}
        .bk-picked{display:flex;align-items:flex-start;gap:.5rem;margin-top:clamp(1.25rem,3vw,1.75rem);padding:.8rem 1rem;border-radius:12px;background:${C.tintGreen};color:#1f8a63;font-size:.9rem;font-weight:700;line-height:1.4}
        .bk-sched .bk-err{margin-top:.9rem}

        .bk-fee{border-radius:18px;background:${C.tintYellow};padding:1rem 1.25rem;font-size:.95rem;line-height:1.7;color:${C.soft}}
        .bk-fee b{color:${C.navy};font-weight:700}
        .bk-err{font-size:.95rem;font-weight:600;color:#e23a5c}
        .bk-secure{display:flex;align-items:center;justify-content:center;gap:.5rem;font-size:.82rem;color:${C.soft}}

        /* buttons */
        .bk-btn{
          display:inline-flex;align-items:center;justify-content:center;gap:.4rem;padding:.9rem 1.6rem;border-radius:999px;text-align:center;
          font-family:inherit;font-size:.96rem;font-weight:700;line-height:1.25;border:1.5px solid transparent;cursor:pointer;text-decoration:none;
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

        @media (max-width:560px){
          .bk-wrap{width:94%}
          .bk-input{font-size:16px}
          .bk-form{margin-top:1.5rem}
          .bk-step{gap:.9rem;padding-bottom:1.6rem}
          .bk-step-n{width:40px;height:40px;font-size:.95rem;box-shadow:0 0 0 5px ${C.tintPink}}
          .bk-step:not(:last-child)::after{left:19px;top:40px}
          .bk-step-t{padding-top:.5rem}
          .bk-state-ic{width:64px;height:64px}
          .bk-state-t{font-size:1.2rem}
          .bk-state-btns{flex-direction:column;width:100%}
          .bk-state-btns .bk-btn{width:100%}
        }

        /* very small phones: give the calendar the full card width so dates stay easy to tap */
        @media (max-width:480px){
          .bk-card{padding:1.25rem 1.1rem}
          .bk-sched{border-width:1px 0;border-radius:0;padding:1rem 0;background:transparent}
          .bk-cal-grid{gap:2px}
          .bk-day{font-size:.88rem}
          .bk-slots{grid-template-columns:repeat(2,minmax(0,1fr))}
          .bk-picked{font-size:.85rem}
          .bk-fee{padding:.9rem 1rem;font-size:.92rem}
        }

        /* large screens: a little more breathing room */
        @media (min-width:1440px){
          .bk-wrap{max-width:1200px}
        }

        @media (prefers-reduced-motion:reduce){
          .book-root *:not(.bk-spin),.book-root *:not(.bk-spin)::before,.book-root *:not(.bk-spin)::after{animation:none!important;transition:none!important}
          .bk-rv{opacity:1!important}
        }
      `}</style>

      <div className="bk-wrap">
        {/* Header */}
        <div className="bk-head">
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
                    Pick a time that works for you, share your queries or objective, and I'll confirm your session personally.
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
                  </div>

                  {/* Calendly-style scheduler (replaces "How would you like to meet?", date and time fields) */}
                  <Scheduler date={form.date} time={form.time} onPick={handlePick} error={pickError} />

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