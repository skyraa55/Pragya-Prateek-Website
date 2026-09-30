import { useState } from "react";
import { api } from "../api.js";

const TOPICS = [
  "Career Guidance",
  "Counselling & Support",
  "Parenting & Relationships",
  "Personal Growth",
  "A course enquiry",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: TOPICS[0],
    msg: "",
    website: "", // honeypot
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.sendContact(form);
      setStatus("success");
      setForm({ name: "", email: "", topic: TOPICS[0], msg: "", website: "" });
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <section className="py-16" id="contact">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[60ch] mx-auto mb-7">
          <span className="eyebrow">Contact</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Get in touch</h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Have a question or want to book? Send a note — I read every message.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* FORM */}
          <div className="contact-card">
            <form onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="name">
                Your name
              </label>
              <input
                className="field-input"
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Aditi Sharma"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                className="field-input"
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />

              <label className="field-label" htmlFor="topic">
                What's it about?
              </label>
              <select
                className="field-input"
                id="topic"
                name="topic"
                value={form.topic}
                onChange={handleChange}
              >
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <label className="field-label" htmlFor="msg">
                Message
              </label>
              <textarea
                className="field-input min-h-[110px] resize-y"
                id="msg"
                name="msg"
                placeholder="Tell me a little about what you need..."
                value={form.msg}
                onChange={handleChange}
              />

              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />

              {status === "error" && (
                <p className="text-coral-deep font-semibold mt-3" role="alert">
                  {error}
                </p>
              )}
              {status === "success" && (
                <p className="text-[#3f8f68] font-semibold mt-3" role="status">
                  ✓ Message sent — thank you! I'll reply soon.
                </p>
              )}

              <button
                className="btn btn-primary w-full justify-center mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>

          {/* DETAILS */}
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-[.9rem] items-center">
                <span className="contact-ic bg-coral">✉️</span>
                <div>
                  <b className="font-quicksand">Email</b>
                  <br />
                  <span className="text-ink-soft text-[.92rem]">
                    hello@yourdomain.com {/* ← add your email */}
                  </span>
                </div>
              </div>
              <div className="flex gap-[.9rem] items-center">
                <span className="contact-ic bg-sage">💬</span>
                <div>
                  <b className="font-quicksand">WhatsApp</b>
                  <br />
                  <span className="text-ink-soft text-[.92rem]">
                    +91 ————— {/* ← add number */}
                  </span>
                </div>
              </div>
              <div className="flex gap-[.9rem] items-center">
                <span className="contact-ic bg-lav">📍</span>
                <div>
                  <b className="font-quicksand">Based in</b>
                  <br />
                  <span className="text-ink-soft text-[.92rem]">
                    Online sessions, India & worldwide
                  </span>
                </div>
              </div>
            </div>

            <h5 className="font-quicksand font-bold mt-6 mb-1">Follow along</h5>
            <div className="flex gap-[.6rem] mt-1 flex-wrap">
              <a
                className="soc"
                href="https://youtube.com/@pragya_prateek_psychologist"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                ▶
              </a>
              <a className="soc" href="#" aria-label="Instagram">
                ◎
              </a>
              <a className="soc" href="#" aria-label="LinkedIn">
                in
              </a>
            </div>

            <div className="contact-card mt-5 bg-gradient-to-br from-[#eef4ff] to-[#fbf0ff] border-0">
              <b className="font-quicksand">🎥 8,000+ minds already learning</b>
              <p className="text-ink-soft text-[.92rem] mt-1.5">
                Join the community on <em>The Art of Mindful Thinking</em> for weekly psychology
                & life insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
