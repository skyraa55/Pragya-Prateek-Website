import { useEffect, useState } from "react";
import { api } from "../api.js";
import { BG } from "../constants.js";
import { ColorPicker, Notice } from "./Fields.jsx";

const blank = { title: "", tag: "", icon: "🎓", color: "coral", desc: "", price: "", link: "" };

export default function CourseManager({ onAuthError }) {
  const [courses, setCourses] = useState(null);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () =>
    api.getCourses().then(setCourses).catch((e) => setMsg({ type: "error", text: e.message }));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const reset = () => { setForm(blank); setEditingId(null); };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (editingId) await api.updateCourse(editingId, form);
      else await api.createCourse(form);
      setMsg({ type: "ok", text: editingId ? "Course updated ✓" : "Course added ✓" });
      reset();
      await load();
    } catch (err) {
      if (!onAuthError(err)) setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const edit = (c) => {
    setEditingId(c.id);
    setForm({ title: c.title, tag: c.tag, icon: c.icon, color: c.color, desc: c.desc, price: c.price, link: c.link });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete the course "${c.title}"?`)) return;
    try {
      await api.deleteCourse(c.id);
      if (editingId === c.id) reset();
      setMsg({ type: "ok", text: "Course deleted." });
      await load();
    } catch (err) {
      if (!onAuthError(err)) setMsg({ type: "error", text: err.message });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
      <form onSubmit={save} className="contact-card">
        <h2 className="text-[1.3rem] font-bold mb-1">{editingId ? "Edit course" : "Add a new course"}</h2>
        <Notice msg={msg} />

        <label className="field-label" htmlFor="c-title">Course title *</label>
        <input id="c-title" className="field-input" required maxLength={120} value={form.title} onChange={set("title")} />

        <div className="grid grid-cols-[1fr_90px] gap-3">
          <div>
            <label className="field-label" htmlFor="c-tag">Label (e.g. Beginner)</label>
            <input id="c-tag" className="field-input" maxLength={30} placeholder="Beginner" value={form.tag} onChange={set("tag")} />
          </div>
          <div>
            <label className="field-label" htmlFor="c-icon">Emoji</label>
            <input id="c-icon" className="field-input text-center" maxLength={8} value={form.icon} onChange={set("icon")} />
          </div>
        </div>

        <span className="field-label">Card colour</span>
        <ColorPicker value={form.color} onChange={(c) => setForm((f) => ({ ...f, color: c }))} />

        <label className="field-label" htmlFor="c-desc">Description *</label>
        <textarea id="c-desc" className="field-input min-h-[100px] resize-y" required maxLength={500} value={form.desc} onChange={set("desc")} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="c-price">Price</label>
            <input id="c-price" className="field-input" maxLength={30} placeholder="₹1,499 or Free" value={form.price} onChange={set("price")} />
          </div>
          <div>
            <label className="field-label" htmlFor="c-link">Enroll link (optional)</label>
            <input id="c-link" className="field-input" type="url" placeholder="https://…" value={form.link} onChange={set("link")} />
          </div>
        </div>
        <p className="text-[.8rem] text-ink-soft mt-1">
          No link? The Enroll button will take visitors to the booking form instead.
        </p>

        <div className="flex gap-3 mt-5">
          <button className="btn btn-primary disabled:opacity-60" disabled={busy}>
            {busy ? "Saving…" : editingId ? "Save changes" : "Add course"}
          </button>
          {editingId && <button type="button" className="btn btn-line" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <div>
        <h2 className="text-[1.3rem] font-bold mb-3">Your courses {courses && `(${courses.length})`}</h2>
        {!courses && <p className="text-ink-soft">Loading…</p>}
        {courses?.length === 0 && <p className="text-ink-soft">No courses yet.</p>}
        <div className="flex flex-col gap-3">
          {courses?.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-4 shadow-soft-sm flex gap-3 items-start">
              <span className={`${BG[c.color] || "bg-coral"} w-11 h-11 rounded-xl grid place-items-center text-xl flex-none`}>{c.icon}</span>
              <div className="flex-1 min-w-0">
                <b className="font-quicksand block leading-snug">{c.title}</b>
                <span className="text-[.78rem] text-ink-soft">{c.tag} · {c.price || "No price set"}</span>
                <div className="flex gap-3 mt-2 text-[.85rem] font-bold font-quicksand">
                  <button className="text-coral-deep cursor-pointer bg-transparent border-0 p-0" onClick={() => edit(c)}>Edit</button>
                  <button className="text-ink-soft cursor-pointer bg-transparent border-0 p-0" onClick={() => remove(c)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
