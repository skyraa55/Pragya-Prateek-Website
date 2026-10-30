import { useEffect, useState } from "react";
import { Share2, Wallet, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../api.js";
import { refreshSite } from "../useSite.js";

const blank = {
  instagramHandle: "", instagramUrl: "", linkedinUrl: "", professionalGuidanceDocUrl: "",
  workshopPhotos: "", workshopThemes: "", workshopSampleDesign: "",
  careerFee: "", careerLink: "", workshopFee: "", workshopLink: "", growthFee: "", growthLink: "",
};

const INPUT =
  "w-full rounded-xl border border-[#eadfd6] bg-white px-4 py-3 text-[.95rem] text-[#14274e] outline-none transition placeholder:text-[#4a5a7a]/60 focus:border-[#ff4d6d] focus:shadow-[0_0_0_4px_rgba(255,77,109,0.12)]";
const LABEL = "mb-1.5 mt-5 block text-[.85rem] font-bold text-[#14274e]";
const HINT = "mt-1.5 text-[.8rem] leading-[1.6] text-[#4a5a7a]";

/* Section wrapper: icon + heading + short description */
function Section({ Icon, tint, color, title, desc, children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-[18px] border border-[#eadfd6] bg-[linear-gradient(180deg,#fff_0%,#fffaf5_100%)] p-4 sm:p-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 flex-none place-items-center rounded-xl sm:h-11 sm:w-11"
          style={{ backgroundColor: tint, color }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <h2 className="text-[1.1rem] font-bold leading-[1.3] sm:text-[1.2rem]">{title}</h2>
          {desc && <p className="mt-1 text-[.86rem] leading-[1.6] text-[#4a5a7a]">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function SettingsManager({ onAuthError }) {
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [gateway, setGateway] = useState(null); // is Razorpay switched on at the server?

  useEffect(() => {
    api.getSettings()
      .then((s) => { setGateway(!!s.paymentsEnabled); return s; })
      .then((s) => setForm({ ...blank, ...s, workshopPhotos: (s.workshopPhotos || []).join("\n") }))
      .catch((e) => { setForm(blank); setMsg({ type: "error", text: e.message }); });
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const s = await api.updateSettings(form);
      setForm({ ...blank, ...s, workshopPhotos: (s.workshopPhotos || []).join("\n") });
      setGateway(!!s.paymentsEnabled);
      refreshSite();
      setMsg({ type: "ok", text: "Saved. Your website is updated." });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (!onAuthError(err)) setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  if (!form) return <p className="text-[.92rem] text-[#4a5a7a]">Loading…</p>;

  // Plain function (not a component) so inputs keep focus while typing.
  const field = (id, label, ph, extra = {}) => (
    <div className="min-w-0">
      <label className={LABEL} htmlFor={id}>{label}</label>
      <input id={id} className={INPUT} placeholder={ph} value={form[id]} onChange={set(id)} {...extra} />
    </div>
  );

  return (
    <form onSubmit={save} className="min-w-0">
      <h2 className="text-[1.25rem] font-bold leading-[1.3] sm:text-[1.4rem]">Site settings</h2>
      <p className="mt-1 text-[.9rem] leading-[1.6] text-[#4a5a7a]">
        Links, session fees and the content of the workshops page.
      </p>

      {msg && (
        <p
          role={msg.type === "error" ? "alert" : "status"}
          className={`mt-4 rounded-xl border px-3.5 py-2.5 text-[.88rem] font-semibold ${
            msg.type === "error"
              ? "border-[#ffd3da] bg-[#fff1f3] text-[#c0324a]"
              : "border-[#c8ecdb] bg-[#ecf9f3] text-[#1f9462]"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 items-start gap-5 sm:gap-6 lg:grid-cols-2">
        {/* ---------- Social links ---------- */}
        <Section
          Icon={Share2}
          tint="#fff1f3"
          color="#e0344f"
          title="Social links"
          desc="Leave a link empty and its button is hidden on the website."
        >
          {field("instagramHandle", "Instagram username", "@yourhandle", { maxLength: 60 })}
          {field("instagramUrl", "Instagram link (optional, built from the username if empty)", "https://instagram.com/…", { type: "url" })}
          {field("linkedinUrl", "LinkedIn link", "https://linkedin.com/in/…", { type: "url" })}
          {field("professionalGuidanceDocUrl", "Professional Guidance document link (optional)", "https://docs.google.com/…", { type: "url" })}
          <p className={HINT}>
            If filled, “Explore Professional Guidance” opens this document instead of the built-in page.
          </p>
        </Section>

        {/* ---------- Fees & payment ---------- */}
        <Section
          Icon={Wallet}
          tint="#f1edff"
          color="#6a4fc7"
          title="Session fees & online payment"
          desc="Type each fee in rupees (e.g. 999). Leave a fee empty and that service is free, with no payment step. The amount is always taken from here, so visitors can't change it."
        >
          <div
            className={`mt-4 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-[.86rem] font-semibold leading-[1.55] ${
              gateway
                ? "border-[#c8ecdb] bg-[#ecf9f3] text-[#1f9462]"
                : "border-[#ffe0b8] bg-[#fff6e6] text-[#a8680c]"
            }`}
          >
            {gateway ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" strokeWidth={2.1} aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 flex-none" strokeWidth={2.1} aria-hidden="true" />
            )}
            <span>
              {gateway
                ? "Online payment is ON (Razorpay). Visitors pay on the website when they book."
                : "Online payment is OFF. The Razorpay keys are not set on the server yet, so the payment links below are used instead."}
            </span>
          </div>

          {[
            ["career", "1:1 Career Guidance Session"],
            ["workshop", "Workshop / Program"],
            ["growth", "Professional Growth Guidance"],
          ].map(([k, label]) => (
            <div key={k} className="mt-5 rounded-2xl border border-[#eadfd6] bg-white p-3.5 sm:p-4">
              <b className="block text-[.92rem] leading-[1.4]">{label}</b>
              <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[120px_1fr]">
                {field(`${k}Fee`, "Fee (₹)", "999", { maxLength: 12, inputMode: "decimal" })}
                {field(`${k}Link`, "Backup payment link (optional)", "https://…", { type: "url" })}
              </div>
            </div>
          ))}
        </Section>

        {/* ---------- Workshops page ---------- */}
        <Section
          Icon={Users}
          tint="#ecf9f3"
          color="#1f9462"
          title="Workshops page"
          desc="Photos and text shown on the workshops page."
          className="lg:col-span-2"
        >
          <label className={LABEL} htmlFor="workshopPhotos">Workshop photo links (one per line)</label>
          <textarea
            id="workshopPhotos"
            className={`${INPUT} min-h-[96px] resize-y leading-[1.7]`}
            placeholder="https://…/photo1.jpg"
            value={form.workshopPhotos}
            onChange={set("workshopPhotos")}
          />

          <div className="grid grid-cols-1 gap-x-5 lg:grid-cols-2">
            <div className="min-w-0">
              <label className={LABEL} htmlFor="workshopThemes">Workshop themes (a paragraph)</label>
              <textarea
                id="workshopThemes"
                className={`${INPUT} min-h-[140px] resize-y leading-[1.7]`}
                maxLength={4000}
                value={form.workshopThemes}
                onChange={set("workshopThemes")}
              />
            </div>
            <div className="min-w-0">
              <label className={LABEL} htmlFor="workshopSampleDesign">Sample workshop design</label>
              <textarea
                id="workshopSampleDesign"
                className={`${INPUT} min-h-[140px] resize-y leading-[1.7]`}
                maxLength={4000}
                value={form.workshopSampleDesign}
                onChange={set("workshopSampleDesign")}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* ---------- Save ---------- */}
      <div className="mt-6 flex">
        <button
          disabled={busy}
          className="w-full cursor-pointer rounded-full border-0 bg-[#14274e] px-7 py-3 text-[.92rem] font-bold text-white shadow-[0_8px_20px_rgba(20,39,78,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff4d6d] hover:shadow-[0_12px_26px_rgba(255,77,109,0.35)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#14274e] motion-reduce:transition-none sm:w-auto"
        >
          {busy ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}