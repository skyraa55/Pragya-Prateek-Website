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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${className}`}>
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
    <h3 className="mb-5 flex items-center gap-2.5 text-center text-[clamp(1rem,3.4vw,1.35rem)] font-bold sm:mb-7 sm:gap-4">
      <span className="h-px min-w-[12px] flex-1 bg-[#eadfd6]" />
      <span className="max-w-[80%] sm:max-w-none">{children}</span>
      <span className="h-px min-w-[12px] flex-1 bg-[#eadfd6]" />
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
      className="overflow-x-hidden bg-[linear-gradient(180deg,#fffaf5_0%,#fff3ec_100%)] py-10 text-[#14274e] sm:py-16 lg:py-24"
    >
      <style>{KEYFRAMES}</style>

      <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <div className="mx-auto mb-8 max-w-[680px] text-center sm:mb-12 lg:mb-14">
          <span className="mb-3 inline-block rounded-full border border-[#ffd3da] bg-white px-3 py-1 text-[.75rem] font-bold text-[#ff4d6d] sm:mb-4 sm:px-4 sm:py-1.5 sm:text-[.85rem]">
            Blogs
          </span>

          <h2 className="mb-3 text-[clamp(1.55rem,6.2vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.02em] sm:mb-4">
            <span className="inline-block bg-[linear-gradient(100deg,#ff4d6d,#ff9f43,#8b6fe0,#ff4d6d)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[bpFlow_7s_ease-in-out_infinite] motion-reduce:animate-none">
              Mental Health,
            </span>{" "}
            Careers &amp; Everyday Life
          </h2>

          <p className="mx-auto text-[clamp(.88rem,2.6vw,1.08rem)] leading-[1.7] text-[#4a5a7a] sm:leading-[1.75]">
            Sometimes you need more than a short video or social media post. The blog is a space
            for longer, detailed conversations around psychology, from building a career in the
            field to understanding the psychological experiences we encounter in everyday life.
          </p>
        </div>

        {/* ---------- Categories ---------- */}
        <SubHeading>Explore by category</SubHeading>
        <div className="mb-10 grid grid-cols-1 gap-3 sm:mb-14 sm:grid-cols-2 sm:gap-4 lg:mb-16 lg:grid-cols-3 lg:gap-[1.4rem]">
          {BLOG_CATEGORIES.map((c, i) => {
            // falls back to a sparkle icon if a category has no / an unknown iconName
            const Icon = ICONS[c.iconName] || Sparkles;

            return (
              <Link
                key={c.name}
                to={`/blog?cat=${encodeURIComponent(c.name)}`}
                style={accentStyle(i)}
                className="group relative flex items-start gap-3 rounded-2xl border border-[#eadfd6] bg-white p-3.5 text-[#14274e] no-underline transition duration-300 hover:-translate-y-1 hover:border-[rgba(var(--glow),0.45)] hover:shadow-[0_14px_30px_rgba(var(--glow),0.16)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--a1)] motion-reduce:transition-none sm:gap-4 sm:p-4 lg:p-5"
              >
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[color:var(--tint)] text-[color:var(--at)] transition duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none sm:h-[46px] sm:w-[46px] sm:rounded-[14px] lg:h-[52px] lg:w-[52px]"
                >
                  <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px] lg:h-6 lg:w-6" strokeWidth={1.9} />
                </span>

                <div className="min-w-0 flex-1 sm:pr-5">
                  <h4 className="mb-0.5 text-[.98rem] font-bold leading-[1.3] sm:mb-1 sm:text-[1.05rem]">
                    {c.name}
                  </h4>
                  <p className="text-[.84rem] leading-[1.55] text-[#4a5a7a] sm:text-[.9rem] sm:leading-[1.6]">
                    {c.desc}
                  </p>
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
          <p className="rounded-2xl border border-dashed border-[#ffd3da] bg-white px-4 py-6 text-center text-[.9rem] text-[#c0324a] sm:py-8 sm:text-base">
            {error}
          </p>
        )}

        {!error && !posts && (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
            aria-label="Loading posts"
          >
            {[0, 1, 2].map((n) => (
              <div
                key={n}
                className={`h-[260px] rounded-[18px] border border-[#eadfd6] bg-[linear-gradient(100deg,#fff_30%,#fff3ec_50%,#fff_70%)] bg-[length:250%_100%] animate-[bpShimmer_1.4s_ease-in-out_infinite] motion-reduce:animate-none sm:h-[300px] lg:h-[330px] ${
                  n === 2 ? "sm:hidden lg:block" : ""
                }`}
              />
            ))}
          </div>
        )}

        {posts && posts.length === 0 && (
          <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#eadfd6] bg-white px-4 py-6 text-center text-[.9rem] text-[#4a5a7a] sm:py-8 sm:text-base">
            <Leaf className="h-4 w-4 flex-none text-[#ff4d6d] sm:h-5 sm:w-5" strokeWidth={1.9} aria-hidden="true" />
            New posts are coming soon.
          </p>
        )}

        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {posts.map((p, idx) => (
              /* on tablets (2 columns) the 3rd card would sit alone, so it spans both and stays centred */
              <div
                key={p.id}
                className={idx === 2 ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-.75rem)] lg:col-span-1 lg:w-auto" : ""}
              >
                <BlogCard post={p} />
              </div>
            ))}
          </div>
        )}

        {/* ---------- Glass button ---------- */}
        <div className="mt-7 flex justify-center sm:mt-10 lg:mt-11">
          <Link
            to="/blog"
            className={`group relative isolate inline-flex w-auto max-w-full items-center justify-between gap-2.5 overflow-hidden rounded-full border-[1.5px] border-white/90 bg-white/25 bg-[image:linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.15)_60%)] py-[5px] pl-4 pr-[5px] text-[.82rem] font-bold text-[#14274e] no-underline shadow-[0_8px_20px_rgba(255,77,109,0.22),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,77,109,0.12)] backdrop-blur-[14px] backdrop-saturate-[1.8] transition duration-[450ms] ${EASE} hover:-translate-y-[3px] hover:text-white hover:shadow-[0_16px_32px_rgba(255,77,109,0.38),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,255,255,0.15)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none sm:gap-3.5 sm:py-[6px] sm:pl-5 sm:pr-[6px] sm:text-[.92rem] lg:py-[7px] lg:pl-[1.4rem] lg:pr-[7px] lg:text-[.95rem]`}
          >
            {/* two colour orbs drifting behind the glass; they bloom on hover */}
            <span
              aria-hidden="true"
              className={`absolute -top-1/4 left-[6%] -z-10 h-12 w-12 rounded-full bg-[#ff4d6d] opacity-75 blur-[12px] transition duration-[800ms] ${EASE} animate-[bpOrbA_8s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none sm:h-16 sm:w-16 sm:blur-[14px]`}
            />
            <span
              aria-hidden="true"
              className={`absolute -bottom-[35%] right-[12%] -z-10 h-12 w-12 rounded-full bg-[#ffb347] opacity-75 blur-[12px] transition duration-[800ms] ${EASE} animate-[bpOrbB_9s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none sm:h-16 sm:w-16 sm:blur-[14px]`}
            />

            <span className="relative z-[1] whitespace-nowrap group-hover:[text-shadow:0_1px_6px_rgba(20,39,78,0.3)]">
              Read the Blog
            </span>

            {/* arrow bubble: old arrow slides out, new one slides in */}
            <span className="relative z-[1] inline-flex h-7 w-7 flex-none items-center justify-center overflow-hidden rounded-full border-[1.5px] border-white/95 bg-white/65 text-[#ff4d6d] shadow-[0_4px_10px_rgba(255,77,109,0.25),inset_0_1px_0_#fff] sm:h-8 sm:w-8 lg:h-[38px] lg:w-[38px]">
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