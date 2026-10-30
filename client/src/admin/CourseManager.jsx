import { useEffect, useState } from "react";
import { GraduationCap, Pencil, Trash2 } from "lucide-react";
import { api } from "../api.js";
import { accentStyle } from "../components/BlogCard.jsx";

/* icon and color are no longer shown on the website, but the backend still expects them,
   so they keep a default value and are sent with every save */
const blank = { title: "", tag: "", icon: "🎓", color: "coral", desc: "", price: "", link: "" };

const INPUT =
  "w-full rounded-xl border border-[#eadfd6] bg-white px-4 py-3 text-[.95rem] text-[#14274e] outline-none transition placeholder:text-[#4a5a7a]/60 focus:border-[#ff4d6d] focus:shadow-[0_0_0_4px_rgba(255,77,109,0.12)]";
const LABEL = "mb-1.5 mt-5 block text-[.85rem] font-bold text-[#14274e]";

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
      setMsg({ type: "ok", text: editingId ? "Course updated." : "Course added." });
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
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
      {/* ---------- Form ---------- */}
      <form onSubmit={save} className="min-w-0">
        <h2 className="text-[1.25rem] font-bold leading-[1.3] sm:text-[1.4rem]">
          {editingId ? "Edit course" : "Add a new course"}
        </h2>
        <p className="mt-1 text-[.9rem] leading-[1.6] text-[#4a5a7a]">
          {editingId ? "Update the details below and save your changes." : "Fill in the details below to add a course to the website."}
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

        <label className={LABEL} htmlFor="c-title">Course title *</label>
        <input id="c-title" className={INPUT} required maxLength={120} value={form.title} onChange={set("title")} />

        <label className={LABEL} htmlFor="c-tag">Label (e.g. Beginner)</label>
        <input id="c-tag" className={INPUT} maxLength={30} placeholder="Beginner" value={form.tag} onChange={set("tag")} />

        <label className={LABEL} htmlFor="c-desc">Description *</label>
        <textarea
          id="c-desc"
          className={`${INPUT} min-h-[120px] resize-y leading-[1.7]`}
          required
          maxLength={500}
          value={form.desc}
          onChange={set("desc")}
        />

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="c-price">Price</label>
            <input id="c-price" className={INPUT} maxLength={30} placeholder="₹1,499 or Free" value={form.price} onChange={set("price")} />
          </div>
          <div>
            <label className={LABEL} htmlFor="c-link">Enroll link (optional)</label>
            <input id="c-link" className={INPUT} type="url" placeholder="https://…" value={form.link} onChange={set("link")} />
          </div>
        </div>
        <p className="mt-1.5 text-[.8rem] leading-[1.6] text-[#4a5a7a]">
          No link? The Enroll button will take visitors to the booking form instead.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={busy}
            className="cursor-pointer rounded-full border-0 bg-[#14274e] px-6 py-3 text-[.92rem] font-bold text-white shadow-[0_8px_20px_rgba(20,39,78,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff4d6d] hover:shadow-[0_12px_26px_rgba(255,77,109,0.35)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#14274e] motion-reduce:transition-none"
          >
            {busy ? "Saving…" : editingId ? "Save changes" : "Add course"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-full border border-[#eadfd6] bg-white px-6 py-3 text-[.92rem] font-bold text-[#14274e] transition duration-300 hover:border-[#14274e] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ---------- Courses list ---------- */}
      <div className="min-w-0 rounded-[18px] border border-[#eadfd6] bg-[linear-gradient(180deg,#fff_0%,#fffaf5_100%)] p-4 sm:p-5">
        <h2 className="mb-4 text-[1.1rem] font-bold sm:text-[1.2rem]">
          Your courses{" "}
          {courses && <span className="font-semibold text-[#4a5a7a]">({courses.length})</span>}
        </h2>

        {!courses && <p className="text-[.92rem] text-[#4a5a7a]">Loading…</p>}
        {courses?.length === 0 && (
          <p className="rounded-xl border border-dashed border-[#eadfd6] bg-white px-4 py-6 text-center text-[.9rem] text-[#4a5a7a]">
            No courses yet.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {courses?.map((c, i) => (
            <div
              key={c.id}
              style={accentStyle(i)}
              className={`flex items-start gap-3 rounded-2xl border bg-white p-3.5 transition duration-300 motion-reduce:transition-none ${
                editingId === c.id
                  ? "border-[rgba(var(--glow),0.55)] shadow-[0_8px_22px_rgba(var(--glow),0.16)]"
                  : "border-[#eadfd6] hover:border-[rgba(var(--glow),0.4)]"
              }`}
            >
              <span
                aria-hidden="true"
                className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[color:var(--tint)] text-[color:var(--at)]"
              >
                <GraduationCap className="h-5 w-5" strokeWidth={1.9} />
              </span>

              <div className="min-w-0 flex-1">
                <b className="block break-words text-[.95rem] leading-[1.35]">{c.title}</b>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[.78rem] text-[#4a5a7a]">
                  {c.tag && (
                    <>
                      <span>{c.tag}</span>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <span>{c.price || "No price set"}</span>
                </span>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[.82rem] font-bold">
                  <button
                    type="button"
                    onClick={() => edit(c)}
                    className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[#14274e] transition-colors hover:text-[#ff4d6d]"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c)}
                    className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[#4a5a7a] transition-colors hover:text-[#c0324a]"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}