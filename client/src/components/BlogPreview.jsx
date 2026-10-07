import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Baby, HeartHandshake, Users, Brain, Sparkles, Leaf } from "lucide-react";
import { api } from "../api.js";
import { BLOG_CATEGORIES } from "../siteConfig.js";
import BlogCard, { accentStyle } from "./BlogCard.jsx";

/* Maps the `iconName` in siteConfig.js to the real icon component.
   To use a new icon: import it above and add it here. */
const ICONS = {
  GraduationCap,
  Baby,
  HeartHandshake,
  Users,
  Brain,
};

/* Only the animation keyframes live here (Tailwind can't define them without editing its config) */
const KEYFRAMES = `
  @keyframes bpFlow    { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  @keyframes bpOrbA    { 0%,100% { translate: 0 0; } 50% { translate: 100px 10px; } }
  @keyframes bpOrbB    { 0%,100% { translate: 0 0; } 50% { translate: -90px -8px; } }
  @keyframes bpShimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
`;

const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

function ArrowIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Sub heading with a thin line on each side */
function SubHeading({ children }) {
  return (
    <h3 className="mb-7 flex items-center gap-3 text-center text-[clamp(1.1rem,3vw,1.35rem)] font-bold sm:gap-[1.1rem]">
      <span className="h-px flex-1 bg-[#eadfd6]" />
      {children}
      <span className="h-px flex-1 bg-[#eadfd6]" />
    </h3>
  );
}

export default function BlogPreview() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getBlogs()
      .then((p) => setPosts(p.slice(0, 3)))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <section
      id="blog"
      className="overflow-x-hidden bg-[linear-gradient(180deg,#fffaf5_0%,#fff3ec_100%)] py-14 text-[#14274e] sm:py-20"
    >
      <style>{KEYFRAMES}</style>

      <div className="mx-auto w-[92%] max-w-[1120px]">
        {/* ---------- Heading ---------- */}
        <div className="mx-auto mb-10 max-w-[680px] text-center sm:mb-14">
          <span className="mb-4 inline-block rounded-full border border-[#ffd3da] bg-white px-4 py-1.5 text-[.85rem] font-bold text-[#ff4d6d]">
            Blogs
          </span>

          <h2 className="mb-4 text-[clamp(1.8rem,5vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.02em]">
            <span className="inline-block bg-[linear-gradient(100deg,#ff4d6d,#ff9f43,#8b6fe0,#ff4d6d)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[bpFlow_7s_ease-in-out_infinite] motion-reduce:animate-none">
              Mental Health,
            </span>{" "}
            Careers &amp; Everyday Life
          </h2>

          <p className="mx-auto text-[clamp(.97rem,2.4vw,1.08rem)] leading-[1.75] text-[#4a5a7a]">
            Sometimes you need more than a short video or social media post. The blog is a space
            for longer, detailed conversations around psychology, from building a career in the
            field to understanding the psychological experiences we encounter in everyday life.
          </p>
        </div>

        {/* ---------- Categories ---------- */}
        <SubHeading>Explore by category</SubHeading>
        <div className="mb-12 grid grid-cols-1 gap-[1.1rem] sm:mb-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[1.4rem]">
          {BLOG_CATEGORIES.map((c, i) => {
            // falls back to a sparkle icon if a category has no / an unknown iconName
            const Icon = ICONS[c.iconName] || Sparkles;

            return (
              <Link
                key={c.name}
                to={`/blog?cat=${encodeURIComponent(c.name)}`}
                style={accentStyle(i)}
                className="group relative flex items-start gap-4 rounded-2xl border border-[#eadfd6] bg-white p-4 text-[#14274e] no-underline transition duration-300 hover:-translate-y-1 hover:border-[rgba(var(--glow),0.45)] hover:shadow-[0_14px_30px_rgba(var(--glow),0.16)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--a1)] motion-reduce:transition-none sm:p-5"
              >
                <span
                  aria-hidden="true"
                  className="grid h-[46px] w-[46px] flex-none place-items-center rounded-[14px] bg-[color:var(--tint)] text-[color:var(--at)] transition duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none sm:h-[52px] sm:w-[52px]"
                >
                  <Icon className="h-[22px] w-[22px] sm:h-6 sm:w-6" strokeWidth={1.9} />
                </span>

                <div className="min-w-0 pr-5">
                  <h4 className="mb-1 text-[1.05rem] font-bold leading-[1.3]">{c.name}</h4>
                  <p className="text-[.9rem] leading-[1.6] text-[#4a5a7a]">{c.desc}</p>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute right-4 top-5 hidden -translate-x-1.5 text-[color:var(--at)] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
                >
                  <ArrowIcon />
                </span>
              </Link>
            );
          })}
        </div>

        {/* ---------- Latest posts ---------- */}
        <SubHeading>Latest posts</SubHeading>

        {error && (
          <p className="rounded-2xl border border-dashed border-[#ffd3da] bg-white px-4 py-8 text-center text-[#c0324a]">
            {error}
          </p>
        )}

        {!error && !posts && (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
            aria-label="Loading posts"
          >
            {[0, 1, 2].map((n) => (
              <div
                key={n}
                className="h-[330px] rounded-[18px] border border-[#eadfd6] bg-[linear-gradient(100deg,#fff_30%,#fff3ec_50%,#fff_70%)] bg-[length:250%_100%] animate-[bpShimmer_1.4s_ease-in-out_infinite] motion-reduce:animate-none"
              />
            ))}
          </div>
        )}

        {posts && posts.length === 0 && (
          <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#eadfd6] bg-white px-4 py-8 text-center text-[#4a5a7a]">
            <Leaf className="h-5 w-5 flex-none text-[#ff4d6d]" strokeWidth={1.9} aria-hidden="true" />
            New posts are coming soon.
          </p>
        )}

        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {posts.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {/* ---------- Glass button ---------- */}
        <div className="mt-8 flex justify-center sm:mt-11">
          <Link
            to="/blog"
            className={`group relative isolate inline-flex w-full items-center justify-between gap-3.5 overflow-hidden rounded-full border-[1.5px] border-white/90 bg-white/25 bg-[image:linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.15)_60%)] py-[7px] pl-5 pr-[7px] text-[.95rem] font-bold text-[#14274e] no-underline shadow-[0_10px_24px_rgba(255,77,109,0.25),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,77,109,0.12)] backdrop-blur-[14px] backdrop-saturate-[1.8] transition duration-[450ms] ${EASE} hover:-translate-y-[3px] hover:text-white hover:shadow-[0_16px_32px_rgba(255,77,109,0.38),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,255,255,0.15)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none sm:w-auto sm:pl-[1.4rem]`}
          >
            {/* two colour orbs drifting behind the glass; they bloom on hover */}
            <span
              aria-hidden="true"
              className={`absolute -top-1/4 left-[6%] -z-10 h-16 w-16 rounded-full bg-[#ff4d6d] opacity-75 blur-[14px] transition duration-[800ms] ${EASE} animate-[bpOrbA_8s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none`}
            />
            <span
              aria-hidden="true"
              className={`absolute -bottom-[35%] right-[12%] -z-10 h-16 w-16 rounded-full bg-[#ffb347] opacity-75 blur-[14px] transition duration-[800ms] ${EASE} animate-[bpOrbB_9s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none`}
            />

            <span className="relative z-[1] group-hover:[text-shadow:0_1px_6px_rgba(20,39,78,0.3)]">
              Read the Blog
            </span>

            {/* arrow bubble: old arrow slides out, new one slides in */}
            <span className="relative z-[1] inline-flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-full border-[1.5px] border-white/95 bg-white/65 text-[#ff4d6d] shadow-[0_4px_10px_rgba(255,77,109,0.25),inset_0_1px_0_#fff] sm:h-[38px] sm:w-[38px]">
              <ArrowIcon
                className={`absolute transition-transform duration-[450ms] ${EASE} group-hover:translate-x-7`}
              />
              <ArrowIcon
                className={`absolute -translate-x-7 transition-transform duration-[450ms] ${EASE} group-hover:translate-x-0`}
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}