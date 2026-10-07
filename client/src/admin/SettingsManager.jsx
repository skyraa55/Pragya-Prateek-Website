import { useEffect, useState } from "react";
import { api } from "../api.js";
import { refreshSite } from "../useSite.js";
import { Notice } from "./Fields.jsx";

const blank = {
  instagramHandle: "", instagramUrl: "", linkedinUrl: "", professionalGuidanceDocUrl: "",
  workshopPhotos: "", workshopThemes: "", workshopSampleDesign: "",
  careerFee: "", careerLink: "", workshopFee: "", workshopLink: "", growthFee: "", growthLink: "",
};

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
      setMsg({ type: "ok", text: "Saved ✓ — your website is updated." });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (!onAuthError(err)) setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  if (!form) return <p className="text-ink-soft">Loading…</p>;

  // Plain function (not a component) so inputs keep focus while typing.
  const field = (id, label, ph, extra = {}) => (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      <input id={id} className="field-input" placeholder={ph} value={form[id]} onChange={set(id)} {...extra} />
    </div>
  );

  return (
    <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="lg:col-span-2"><Notice msg={msg} /></div>

      <div className="contact-card">
        <h2 className="text-[1.3rem] font-bold mb-1">Social links</h2>
        <p className="text-[.85rem] text-ink-soft">Leave a link empty and its button is hidden on the website.</p>
        {field("instagramHandle", "Instagram username", "@yourhandle", { maxLength: 60 })}
        {field("instagramUrl", "Instagram link (optional — built from the username if empty)", "https://instagram.com/…", { type: "url" })}
        {field("linkedinUrl", "LinkedIn link", "https://linkedin.com/in/…", { type: "url" })}
        {field("professionalGuidanceDocUrl", "Professional Guidance document link (optional)", "https://docs.google.com/…", { type: "url" })}
        <p className="text-[.8rem] text-ink-soft mt-1">If filled, “Explore Professional Guidance” opens this document instead of the built-in page.</p>
      </div>

      <div className="contact-card">
        <h2 className="text-[1.3rem] font-bold mb-1">Session fees &amp; online payment</h2>
        <p className={`text-[.85rem] font-semibold mb-1 ${gateway ? "text-[#3f8f68]" : "text-coral-deep"}`}>
          {gateway
            ? "● Online payment is ON (Razorpay). Visitors pay on the website when they book."
            : "● Online payment is OFF — the Razorpay keys are not set on the server yet, so the payment links below are used instead."}
        </p>
        <p className="text-[.85rem] text-ink-soft">
          Type each fee in rupees (e.g. 999). Leave a fee empty and that service is free — no payment step.
          The amount is always taken from here, so visitors can't change it.
        </p>
        {[["career", "1:1 Career Guidance Session"], ["workshop", "Workshop / Program"], ["growth", "Professional Growth Guidance"]].map(([k, label]) => (
          <div key={k} className="grid grid-cols-[110px_1fr] gap-3">
            {field(`${k}Fee`, `${label} — fee (₹)`, "999", { maxLength: 12, inputMode: "decimal" })}
            {field(`${k}Link`, "Backup payment link (optional)", "https://…", { type: "url" })}
          </div>
        ))}
      </div>

      <div className="contact-card lg:col-span-2">
        <h2 className="text-[1.3rem] font-bold mb-1">Workshops page</h2>
        <label className="field-label" htmlFor="workshopPhotos">Workshop photo links (one per line)</label>
        <textarea id="workshopPhotos" className="field-input min-h-[80px] resize-y" placeholder="https://…/photo1.jpg" value={form.workshopPhotos} onChange={set("workshopPhotos")} />
        <label className="field-label" htmlFor="workshopThemes">Workshop themes (a paragraph)</label>
        <textarea id="workshopThemes" className="field-input min-h-[110px] resize-y" maxLength={4000} value={form.workshopThemes} onChange={set("workshopThemes")} />
        <label className="field-label" htmlFor="workshopSampleDesign">Sample workshop design</label>
        <textarea id="workshopSampleDesign" className="field-input min-h-[130px] resize-y" maxLength={4000} value={form.workshopSampleDesign} onChange={set("workshopSampleDesign")} />
      </div>

      <div>
        <button className="btn btn-primary disabled:opacity-60" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
