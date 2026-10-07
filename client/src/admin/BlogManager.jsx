import { useEffect, useState } from "react";
import { api, formatDate } from "../api.js";
import { BG } from "../constants.js";
import { ColorPicker, Notice } from "./Fields.jsx";
import { BLOG_CATEGORIES } from "../siteConfig.js";

const blank = { title: "", category: "", icon: "📝", color: "coral", excerpt: "", content: "", published: true };

export default function BlogManager({ onAuthError }) {
  const [posts, setPosts] = useState(null);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () =>
    api.adminBlogs().then(setPosts).catch((e) => !onAuthError(e) && setMsg({ type: "error", text: e.message }));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const reset = () => { setForm(blank); setEditingId(null); };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (editingId) await api.updateBlog(editingId, form);
      else await api.createBlog(form);
      setMsg({ type: "ok", text: editingId ? "Blog updated ✓" : "Blog published ✓" });
      reset();
      await load();
    } catch (err) {
      if (!onAuthError(err)) setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const edit = (p) => {
    setEditingId(p.id);
    setForm({ title: p.title, category: p.category, icon: p.icon, color: p.color, excerpt: p.excerpt, content: p.content, published: p.published });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await api.deleteBlog(p.id);
      if (editingId === p.id) reset();
      setMsg({ type: "ok", text: "Blog deleted." });
      await load();
    } catch (err) {
      if (!onAuthError(err)) setMsg({ type: "error", text: err.message });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
      <form onSubmit={save} className="contact-card">
        <h2 className="text-[1.3rem] font-bold mb-1">{editingId ? "Edit blog" : "Write a new blog"}</h2>
        <Notice msg={msg} />

        <label className="field-label" htmlFor="bl-title">Title *</label>
        <input id="bl-title" className="field-input" required maxLength={150} value={form.title} onChange={set("title")} />

        <div className="grid grid-cols-[1fr_90px] gap-3">
          <div>
            <label className="field-label" htmlFor="bl-cat">Category</label>
            <input id="bl-cat" className="field-input" maxLength={40} placeholder="Pick or type a category" list="blog-cats" value={form.category} onChange={set("category")} />
            <datalist id="blog-cats">{BLOG_CATEGORIES.map((c) => <option key={c.name} value={c.name} />)}</datalist>
          </div>
          <div>
            <label className="field-label" htmlFor="bl-icon">Emoji</label>
            <input id="bl-icon" className="field-input text-center" maxLength={8} value={form.icon} onChange={set("icon")} />
          </div>
        </div>

        <span className="field-label">Card colour</span>
        <ColorPicker value={form.color} onChange={(c) => setForm((f) => ({ ...f, color: c }))} />

        <label className="field-label" htmlFor="bl-ex">Short summary (shown on the card)</label>
        <textarea id="bl-ex" className="field-input min-h-[70px] resize-y" maxLength={300}
          placeholder="Leave empty to auto-create from the blog text" value={form.excerpt} onChange={set("excerpt")} />

        <label className="field-label" htmlFor="bl-content">Blog text *</label>
        <textarea id="bl-content" className="field-input min-h-[260px] resize-y" required value={form.content} onChange={set("content")} />
        <p className="text-[.8rem] text-ink-soft mt-1">
          Leave a blank line between paragraphs. Start a line with <b>## </b> to make a heading.
        </p>

        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
          <span className="font-quicksand font-semibold text-[.9rem]">Publish on the website (untick to save as draft)</span>
        </label>

        <div className="flex gap-3 mt-5">
          <button className="btn btn-primary disabled:opacity-60" disabled={busy}>
            {busy ? "Saving…" : editingId ? "Save changes" : "Publish blog"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-line" onClick={reset}>Cancel</button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-[1.3rem] font-bold mb-3">Your posts {posts && `(${posts.length})`}</h2>
        {!posts && <p className="text-ink-soft">Loading…</p>}
        {posts?.length === 0 && <p className="text-ink-soft">No posts yet — write your first one!</p>}
        <div className="flex flex-col gap-3">
          {posts?.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-soft-sm flex gap-3 items-start">
              <span className={`${BG[p.color] || "bg-coral"} w-11 h-11 rounded-xl grid place-items-center text-xl flex-none`}>{p.icon}</span>
              <div className="flex-1 min-w-0">
                <b className="font-quicksand block leading-snug">{p.title}</b>
                <span className="text-[.78rem] text-ink-soft">
                  {formatDate(p.createdAt)} · {p.category}
                  {!p.published && <span className="ml-2 chip !py-0.5 !text-[.7rem]">Draft</span>}
                </span>
                <div className="flex gap-3 mt-2 text-[.85rem] font-bold font-quicksand">
                  <button className="text-coral-deep cursor-pointer bg-transparent border-0 p-0" onClick={() => edit(p)}>Edit</button>
                  <button className="text-ink-soft cursor-pointer bg-transparent border-0 p-0" onClick={() => remove(p)}>Delete</button>
                  {p.published && <a className="text-ink-soft" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">View ↗</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
