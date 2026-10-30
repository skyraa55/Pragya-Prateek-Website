import { useEffect, useState } from "react";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { api, formatDate } from "../api.js";
import { BLOG_CATEGORIES } from "../siteConfig.js";
import { accentStyle } from "../components/BlogCard.jsx";
import { categoryMeta } from "../components/blogUtils.js";

/* icon and color are no longer shown on the website, but the backend still expects them,
   so they keep a default value and are sent with every save */
const blank = { title: "", category: "", icon: "📝", color: "coral", excerpt: "", content: "", published: true };

const INPUT =
  "w-full rounded-xl border border-[#eadfd6] bg-white px-4 py-3 text-[.95rem] text-[#14274e] outline-none transition placeholder:text-[#4a5a7a]/60 focus:border-[#ff4d6d] focus:shadow-[0_0_0_4px_rgba(255,77,109,0.12)]";
const LABEL = "mb-1.5 mt-5 block text-[.85rem] font-bold text-[#14274e]";

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
      setMsg({ type: "ok", text: editingId ? "Blog updated." : "Blog published." });
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
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
      {/* ---------- Form ---------- */}
      <form onSubmit={save} className="min-w-0">
        <h2 className="text-[1.25rem] font-bold leading-[1.3] sm:text-[1.4rem]">
          {editingId ? "Edit blog" : "Write a new blog"}
        </h2>
        <p className="mt-1 text-[.9rem] leading-[1.6] text-[#4a5a7a]">
          {editingId ? "Update the details below and save your changes." : "Fill in the details below to publish a new article."}
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

        <label className={LABEL} htmlFor="bl-title">Title *</label>
        <input id="bl-title" className={INPUT} required maxLength={150} value={form.title} onChange={set("title")} />

        <label className={LABEL} htmlFor="bl-cat">Category</label>
        <input
          id="bl-cat"
          className={INPUT}
          maxLength={40}
          placeholder="Pick or type a category"
          list="blog-cats"
          value={form.category}
          onChange={set("category")}
        />
        <datalist id="blog-cats">
          {BLOG_CATEGORIES.map((c) => <option key={c.name} value={c.name} />)}
        </datalist>

        <label className={LABEL} htmlFor="bl-ex">Short summary (shown on the card)</label>
        <textarea
          id="bl-ex"
          className={`${INPUT} min-h-[84px] resize-y`}
          maxLength={300}
          placeholder="Leave empty to auto-create from the blog text"
          value={form.excerpt}
          onChange={set("excerpt")}
        />

        <label className={LABEL} htmlFor="bl-content">Blog text *</label>
        <textarea
          id="bl-content"
          className={`${INPUT} min-h-[260px] resize-y leading-[1.7] sm:min-h-[320px]`}
          required
          value={form.content}
          onChange={set("content")}
        />
        <p className="mt-1.5 text-[.8rem] leading-[1.6] text-[#4a5a7a]">
          Leave a blank line between paragraphs. Start a line with <b className="text-[#14274e]">## </b> to make a heading.
        </p>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#eadfd6] bg-[#fffaf5] px-4 py-3">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 flex-none cursor-pointer accent-[#ff4d6d]"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          <span className="text-[.9rem] font-semibold leading-[1.5]">
            Publish on the website
            <span className="block text-[.8rem] font-normal text-[#4a5a7a]">Untick to save it as a draft.</span>
          </span>
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={busy}
            className="cursor-pointer rounded-full border-0 bg-[#14274e] px-6 py-3 text-[.92rem] font-bold text-white shadow-[0_8px_20px_rgba(20,39,78,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff4d6d] hover:shadow-[0_12px_26px_rgba(255,77,109,0.35)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#14274e] motion-reduce:transition-none"
          >
            {busy ? "Saving…" : editingId ? "Save changes" : "Publish blog"}
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

      {/* ---------- Posts list ---------- */}
      <div className="min-w-0 rounded-[18px] border border-[#eadfd6] bg-[linear-gradient(180deg,#fff_0%,#fffaf5_100%)] p-4 sm:p-5">
        <h2 className="mb-4 text-[1.1rem] font-bold sm:text-[1.2rem]">
          Your posts{" "}
          {posts && <span className="font-semibold text-[#4a5a7a]">({posts.length})</span>}
        </h2>

        {!posts && <p className="text-[.92rem] text-[#4a5a7a]">Loading…</p>}
        {posts?.length === 0 && (
          <p className="rounded-xl border border-dashed border-[#eadfd6] bg-white px-4 py-6 text-center text-[.9rem] text-[#4a5a7a]">
            No posts yet. Write your first one.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {posts?.map((p) => {
            const { index, Icon } = categoryMeta(p.category);
            return (
              <div
                key={p.id}
                style={accentStyle(index)}
                className={`flex items-start gap-3 rounded-2xl border bg-white p-3.5 transition duration-300 motion-reduce:transition-none ${
                  editingId === p.id
                    ? "border-[rgba(var(--glow),0.55)] shadow-[0_8px_22px_rgba(var(--glow),0.16)]"
                    : "border-[#eadfd6] hover:border-[rgba(var(--glow),0.4)]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[color:var(--tint)] text-[color:var(--at)]"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>

                <div className="min-w-0 flex-1">
                  <b className="block break-words text-[.95rem] leading-[1.35]">{p.title}</b>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[.78rem] text-[#4a5a7a]">
                    <span>{formatDate(p.createdAt)}</span>
                    {p.category && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{p.category}</span>
                      </>
                    )}
                    {!p.published && (
                      <span className="rounded-full border border-[#ffe0b8] bg-[#fff6e6] px-2 py-0.5 text-[.7rem] font-bold text-[#c76a0c]">
                        Draft
                      </span>
                    )}
                  </span>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[.82rem] font-bold">
                    <button
                      type="button"
                      onClick={() => edit(p)}
                      className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[#14274e] transition-colors hover:text-[#ff4d6d]"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p)}
                      className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[#4a5a7a] transition-colors hover:text-[#c0324a]"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      Delete
                    </button>
                    {p.published && (
                      <a
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#4a5a7a] no-underline transition-colors hover:text-[#14274e]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}