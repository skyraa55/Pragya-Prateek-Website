import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, formatDate } from "../api.js";
import { BLOG_CATEGORIES } from "../siteConfig.js";
import { mergeBlogs } from "../components/Blogsdata.js";
import BlogCard, { accentStyle } from "../components/BlogCard.jsx";
import GlassButton from "../components/GlassButton.jsx";
import { categoryMeta, readMinutes } from "../components/blogUtils.js";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&display=swap");
  @keyframes blFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  @keyframes blShimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
`;
const SERIF = { fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' };

/* Sub heading with a thin line on each side (same as the home page section) */
function SubHeading({ children }) {
  return (
    <h2 className="mb-5 flex items-center gap-2.5 text-center text-[clamp(1rem,3.4vw,1.35rem)] font-bold sm:mb-7 sm:gap-4">
      <span className="h-px min-w-[12px] flex-1 bg-[#eadfd6]" />
      <span className="max-w-[80%] sm:max-w-none">{children}</span>
      <span className="h-px min-w-[12px] flex-1 bg-[#eadfd6]" />
    </h2>
  );
}

/* Big card for the newest post */
function Featured({ post }) {
  const { index, Icon } = categoryMeta(post.category);
  return (
    <article
      style={accentStyle(index)}
      className="mb-10 grid overflow-hidden rounded-[22px] border border-[#eadfd6] bg-white shadow-[0_14px_40px_rgba(20,39,78,0.08)] sm:mb-14 lg:grid-cols-[0.8fr_1.2fr]"
    >
      <div
        className="relative flex min-h-[170px] flex-col justify-between gap-8 p-6 sm:min-h-[210px] sm:p-8 lg:min-h-[320px]"
        style={{
          backgroundColor: "var(--tint)",
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(var(--glow), 0.26), transparent 55%), radial-gradient(circle at 88% 90%, rgba(var(--glow), 0.18), transparent 50%)",
        }}
      >
        <span className="w-fit rounded-full border border-white/95 bg-white/70 px-3 py-1 text-[.74rem] font-bold text-[#14274e] backdrop-blur-lg">
          Latest article
        </span>
        <div className="flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="grid h-14 w-14 flex-none place-items-center rounded-2xl bg-white text-[color:var(--at)] shadow-[0_8px_20px_rgba(var(--glow),0.25)] sm:h-16 sm:w-16"
          >
            <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.8} />
          </span>
          <span className="text-[.78rem] font-bold uppercase tracking-[.09em] text-[color:var(--at)]">
            {post.category}
          </span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center p-6 sm:p-8 lg:p-10"
        style={{ backgroundImage: "linear-gradient(180deg, #fff 0%, var(--tint) 100%)" }}
      >
        <span className="mb-3 text-[.82rem] text-[#4a5a7a]">
          {formatDate(post.createdAt)} <span aria-hidden="true">·</span> {readMinutes(post)} min read
        </span>
        <h3
          style={SERIF}
          className="mb-3 text-[clamp(1.4rem,3.6vw,2.15rem)] font-semibold italic leading-[1.25] tracking-[-0.005em]"
        >
          <Link to={`/blog/${post.slug}`} className="text-[#14274e] no-underline transition-colors hover:text-[color:var(--at)]">
            {post.title}
          </Link>
        </h3>
        <p className="mb-6 text-[clamp(.92rem,2.2vw,1.04rem)] leading-[1.75] text-[#4a5a7a]">{post.excerpt}</p>
        <GlassButton to={`/blog/${post.slug}`}>Read article</GlassButton>
      </div>
    </article>
  );
}

export default function BlogList() {
  const [posts, setPosts] = useState(null);
  const [params, setParams] = useSearchParams();
  const [cat, setCat] = useState(params.get("cat") || "All");
  useEffect(() => { setCat(params.get("cat") || "All"); }, [params]);

  useEffect(() => {
    document.title = "Blogs — Pragya Prateek";
    // client's new blogs (API) + the static blogs from Blogsdata.js
    // if the API fails, the static blogs are still shown
    api
      .getBlogs()
      .then((data) => setPosts(mergeBlogs(data)))
      .catch(() => setPosts(mergeBlogs([])));
  }, []);

  const chooseCat = (name) => {
    setCat(name);
    if (name === "All") setParams({});
    else setParams({ cat: name });
  };

  const categories = posts
    ? [...new Set([...BLOG_CATEGORIES.map((c) => c.name), ...posts.map((p) => p.category).filter(Boolean)])]
    : [];
  const shown = posts ? posts.filter((p) => cat === "All" || p.category === cat) : [];

  const showFeatured = cat === "All" && shown.length > 0;
  const featured = showFeatured ? shown[0] : null;
  const gridPosts = showFeatured ? shown.slice(1) : shown;

  return (
    <section className="min-h-[70vh] overflow-x-hidden bg-[linear-gradient(180deg,#fffaf5_0%,#fff3ec_100%)] py-12 text-[#14274e] sm:py-16 lg:py-20">
      <style>{STYLES}</style>

      <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <div className="mx-auto mb-8 max-w-[700px] text-center sm:mb-12">
          <span className="mb-3 inline-block rounded-full border border-[#ffd3da] bg-white px-3 py-1 text-[.75rem] font-bold text-[#ff4d6d] sm:mb-4 sm:px-4 sm:py-1.5 sm:text-[.85rem]">
            Blog
          </span>
          <h1 className="mb-3 text-[clamp(1.7rem,6.4vw,3rem)] font-bold leading-[1.15] tracking-[-0.02em] sm:mb-4">
            <span className="inline-block bg-[linear-gradient(100deg,#ff4d6d,#ff9f43,#8b6fe0,#ff4d6d)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[blFlow_7s_ease-in-out_infinite] motion-reduce:animate-none">
              Mental Health,
            </span>{" "}
            Careers &amp; Everyday Life
          </h1>
          <p className="mx-auto text-[clamp(.9rem,2.6vw,1.08rem)] leading-[1.7] text-[#4a5a7a]">
            Longer, detailed conversations around psychology, from building a career in the field
            to understanding the experiences we meet in everyday life.
          </p>
        </div>

        {/* ---------- Category filter ---------- */}
        {posts && (
          <div className="mb-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:mb-12 sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {["All", ...categories].map((c) => {
              const on = cat === c;
              const { index } = categoryMeta(c);
              const count = c === "All" ? posts.length : posts.filter((p) => p.category === c).length;
              const style =
                c === "All"
                  ? on ? { backgroundColor: "#14274e" } : {}
                  : { ...accentStyle(index), ...(on ? { backgroundImage: "linear-gradient(100deg,var(--a1),var(--a2))" } : {}) };
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => chooseCat(c)}
                  style={style}
                  className={`inline-flex flex-none cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[.85rem] font-bold transition duration-300 motion-reduce:transition-none ${
                    on
                      ? "border-transparent text-white shadow-[0_8px_20px_rgba(20,39,78,0.18)]"
                      : "border-[#eadfd6] bg-white text-[#14274e] hover:border-[#14274e]/40"
                  }`}
                >
                  {c}
                  <span className={`text-[.75rem] font-semibold ${on ? "text-white/80" : "text-[#4a5a7a]"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ---------- Loading ---------- */}
        {!posts && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7" aria-label="Loading posts">
            {[0, 1, 2].map((n) => (
              <div
                key={n}
                className="h-[280px] animate-[blShimmer_1.4s_ease-in-out_infinite] rounded-[20px] border border-[#eadfd6] bg-[linear-gradient(100deg,#fff_30%,#fff3ec_50%,#fff_70%)] bg-[length:250%_100%] motion-reduce:animate-none"
              />
            ))}
          </div>
        )}

        {/* ---------- Empty ---------- */}
        {posts && shown.length === 0 && (
          <div className="mx-auto max-w-[520px] rounded-[20px] border border-dashed border-[#eadfd6] bg-white px-6 py-10 text-center">
            <p className="mb-4 text-[#4a5a7a]">There are no articles in this category yet.</p>
            <button
              type="button"
              onClick={() => chooseCat("All")}
              className="cursor-pointer rounded-full border border-[#14274e] bg-transparent px-5 py-2 text-[.88rem] font-bold text-[#14274e] transition hover:bg-[#14274e] hover:text-white"
            >
              View all articles
            </button>
          </div>
        )}

        {/* ---------- Featured + grid ---------- */}
        {featured && <Featured post={featured} />}

        {gridPosts.length > 0 && (
          <>
            <SubHeading>{showFeatured ? "More articles" : cat}</SubHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
              {gridPosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}