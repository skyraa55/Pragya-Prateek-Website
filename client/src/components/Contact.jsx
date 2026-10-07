import { useState } from "react";
import { api } from "../api.js";
import { useSite } from "../useSite.js";

const TOPICS = [
  "A career doubt",
  "A collaboration idea",
  "A workshop enquiry",
  "A professional enquiry",
  "A general question",
];

export default function Contact() {
  const SITE = useSite();
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
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Let's Connect</h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Have a question, collaboration idea, career doubt or professional enquiry? You can get in touch using the contact form below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* FORM */}
          <div className="contact-card">
            <form onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="name">
                Name
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
                What would you like to discuss?
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
            <div className="contact-card bg-gradient-to-br from-[#eef4ff] to-[#fbf0ff] border-0">
              <b className="font-quicksand text-[1.1rem]">Wherever you are in your journey</b>
              <p className="text-ink-soft text-[.95rem] mt-2">
                Psychology student, professional or simply curious — send me a message and tell me
                what you'd like to discuss.
              </p>
            </div>

            <h5 className="font-quicksand font-bold mt-6 mb-1">Find me online</h5>
            <div className="flex gap-[.6rem] mt-1 flex-wrap">
              <a className="soc" href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶</a>
              {SITE.instagramUrl && (
                <a className="soc" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
              )}
              {SITE.linkedinUrl && (
                <a className="soc" href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
