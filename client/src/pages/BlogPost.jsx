import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api, formatDate } from "../api.js";
import { findStaticBlog, mergeBlogs } from "../components/Blogsdata.js";
import BlogBody from "../components/Blogbody.jsx";
import BlogCard, { accentStyle } from "../components/BlogCard.jsx";
import GlassButton from "../components/GlassButton.jsx";
import { categoryMeta, readMinutes } from "../components/blogUtils.js";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&display=swap");
`;
const SERIF = { fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' };

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [all, setAll] = useState([]);

  /* the post itself */
  useEffect(() => {
    setPost(null);
    setError("");
    window.scrollTo(0, 0);

    // 1) static blogs from Blogsdata.js
    const staticPost = findStaticBlog(slug);
    if (staticPost) {
      setPost(staticPost);
      document.title = `${staticPost.title} — Pragya Prateek`;
      return;
    }

    // 2) blogs added by the client from the admin page
    api
      .getBlog(slug)
      .then((p) => {
        setPost(p);
        document.title = `${p.title} — Pragya Prateek`;
      })
      .catch((e) => setError(e.status === 404 ? "This post could not be found." : e.message));
  }, [slug]);

  /* other posts for "Keep reading" */
  useEffect(() => {
    api
      .getBlogs()
      .then((d) => setAll(mergeBlogs(d)))
      .catch(() => setAll(mergeBlogs([])));
  }, []);

  const meta = post ? categoryMeta(post.category) : null;
  const Icon = meta ? meta.Icon : null;
  const related = post
    ? all
        .filter((p) => p.slug !== slug)
        .sort((a, b) => (b.category === post.category) - (a.category === post.category))
        .slice(0, 2)
    : [];

  return (
    <article className="min-h-[70vh] overflow-x-hidden bg-[linear-gradient(180deg,#fffaf5_0%,#fff3ec_100%)] py-8 text-[#14274e] sm:py-12 lg:py-16">
      <style>{STYLES}</style>

      <div className="mx-auto w-full max-w-[740px] px-4 sm:px-6">
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-2 text-[.86rem] font-bold text-[#4a5a7a] no-underline transition-colors hover:text-[#ff4d6d] sm:mb-7 sm:text-[.88rem]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          All articles
        </Link>

        {error && <p className="mt-6 text-[#4a5a7a]">{error}</p>}
        {!error && !post && <p className="mt-6 text-[#4a5a7a]">Loading…</p>}

        {post && (
          <div style={accentStyle(meta.index)}>
            {/* ---------- Header ---------- */}
            <header className="mb-7 border-b border-[#eadfd6] pb-6 sm:mb-9 sm:pb-8">
              <span className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(var(--glow),0.3)] bg-[color:var(--tint)] px-3 py-1.5 text-[.7rem] font-bold uppercase tracking-[.08em] text-[color:var(--at)] sm:mb-5 sm:px-3.5 sm:text-[.74rem]">
                <Icon className="h-4 w-4 flex-none" strokeWidth={1.9} aria-hidden="true" />
                <span className="truncate">{post.category}</span>
              </span>

              <h1 className="mb-3 break-words text-[clamp(1.55rem,6vw,2.8rem)] font-bold leading-[1.2] tracking-[-0.02em] sm:mb-4">
                {post.title}
              </h1>

              {post.excerpt && (
                <p
                  style={SERIF}
                  className="mb-4 break-words text-[clamp(1rem,2.8vw,1.3rem)] font-semibold italic leading-[1.5] text-[#4a5a7a] sm:mb-5"
                >
                  {post.excerpt}
                </p>
              )}

              <span className="text-[.82rem] text-[#4a5a7a] sm:text-[.85rem]">
                {formatDate(post.createdAt)} <span aria-hidden="true">·</span> {readMinutes(post)} min read
              </span>
            </header>

            {/* ---------- Content ---------- */}
            <BlogBody post={post} />

            {/* ---------- Call to action ---------- */}
            <div
              className="mt-10 rounded-[18px] border border-[#eadfd6] p-5 shadow-[0_10px_30px_rgba(20,39,78,0.06)] sm:mt-12 sm:rounded-[20px] sm:p-8"
              style={{ ...accentStyle(0), backgroundImage: "linear-gradient(180deg, #fff 0%, var(--tint) 100%)" }}
            >
              <h3 className="mb-1.5 text-[1.12rem] font-bold sm:text-[1.35rem]">Want to talk this through?</h3>
              <p className="mb-5 text-[.92rem] leading-[1.7] text-[#4a5a7a] sm:text-[.95rem]">
                Book a one-on-one session, online, from anywhere.
              </p>
              <GlassButton to="/book">Book a Session</GlassButton>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Keep reading ---------- */}
      {post && related.length > 0 && (
        <div className="mx-auto mt-12 w-full max-w-[1120px] px-4 sm:mt-20 sm:px-6 lg:px-8">
          <h2 className="mb-5 flex items-center gap-2.5 text-center text-[clamp(1rem,3.4vw,1.35rem)] font-bold sm:mb-7 sm:gap-4">
            <span className="h-px min-w-[12px] flex-1 bg-[#eadfd6]" />
            <span>Keep reading</span>
            <span className="h-px min-w-[12px] flex-1 bg-[#eadfd6]" />
          </h2>
          <div className="mx-auto grid max-w-[820px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}