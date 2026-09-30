import { useState } from "react";
import { api } from "../api.js";

const steps = [
  { num: 1, title: "Choose a focus", desc: "Career guidance, counselling, parenting or personal growth." },
  { num: 2, title: "Pick a time", desc: "Share your details and preferred slot below." },
  { num: 3, title: "Connect", desc: "Meet online and start your mindful journey." },
];

const TOPICS = [
  "Career Guidance",
  "Counselling & Support",
  "Parenting & Relationships",
  "Personal Growth",
  "A course enquiry",
];
const MODES = ["Video call", "Phone call", "WhatsApp chat"];
const TIMES = ["Morning (9am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 8pm)"];

const empty = {
  name: "",
  email: "",
  phone: "",
  topic: TOPICS[0],
  mode: MODES[0],
  date: "",
  time: TIMES[0],
  message: "",
  website: "", // honeypot — hidden from people, bots fill it in
};

const today = () => new Date().toISOString().slice(0, 10);

export default function Book() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.sendBooking(form);
      setStatus("success");
      setForm(empty);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#eef4ff] to-[#fbf0ff]" id="book">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[60ch] mx-auto mb-8">
          <span className="eyebrow">Book a Session</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">
            Let's talk — it's easier than you think
          </h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Three simple steps to a one-on-one conversation, online, from wherever you are.
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
            Request a session and I'll get back to you personally.
          </p>

          {status === "success" ? (
            <div className="text-center py-8" role="status">
              <div className="text-[3rem]">🌿</div>
              <h4 className="font-quicksand font-bold text-[1.2rem] mt-2">Request sent — thank you!</h4>
              <p className="text-ink-soft mt-1 mb-5">
                I'll reach out to you soon to confirm your session. A copy has been emailed to you.
              </p>
              <button className="btn btn-line" onClick={() => setStatus("idle")}>
                Book another session
              </button>
            </div>
          ) : (
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
                  <label className="field-label" htmlFor="b-topic">Session about *</label>
                  <select className="field-input" id="b-topic" name="topic" value={form.topic} onChange={handleChange}>
                    {TOPICS.map((t) => <option key={t}>{t}</option>)}
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

              <label className="field-label" htmlFor="b-message">Anything you'd like me to know?</label>
              <textarea className="field-input min-h-[100px] resize-y" id="b-message" name="message"
                maxLength={2000} placeholder="Tell me a little about what you need..."
                value={form.message} onChange={handleChange} />

              {/* Honeypot: invisible to people */}
              <input type="text" name="website" value={form.website} onChange={handleChange}
                tabIndex={-1} autoComplete="off" aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

              {status === "error" && (
                <p className="text-coral-deep font-semibold mt-3" role="alert">{error}</p>
              )}

              <button className="btn btn-primary w-full justify-center mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Request a Booking →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
