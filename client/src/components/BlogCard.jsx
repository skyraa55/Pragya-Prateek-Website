import { Link } from "react-router-dom";
import { formatDate } from "../api.js";
import { categoryMeta, readMinutes } from "./blogUtils.js";

/* =========================================================
   Accent colours (same palette as Intro.jsx).
   a1/a2 = accent pair, glow = a1 as r,g,b, tint = soft bg,
   text = readable accent colour for text on white.
   Same category always gets the same accent.
   ========================================================= */
const ACCENTS = [
  { a1: "#ff4d6d", a2: "#ff9f43", glow: "255, 77, 109", tint: "#fff1f3", text: "#e0344f" },
  { a1: "#2fb67c", a2: "#4dabf7", glow: "47, 182, 124", tint: "#ecf9f3", text: "#1f9462" },
  { a1: "#8b6fe0", a2: "#4dabf7", glow: "139, 111, 224", tint: "#f1edff", text: "#6a4fc7" },
  { a1: "#ff9f43", a2: "#ffd45e", glow: "255, 159, 67", tint: "#fff6e6", text: "#c76a0c" },
  { a1: "#4dabf7", a2: "#8b6fe0", glow: "77, 171, 247", tint: "#eaf5ff", text: "#1f86d6" },
];

/* Turns an accent into CSS variables that the Tailwind classes read */
export function accentStyle(index) {
  const a = ACCENTS[index % ACCENTS.length];
  return {
    "--a1": a.a1,
    "--a2": a.a2,
    "--glow": a.glow,
    "--tint": a.tint,
    "--at": a.text,
  };
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BlogCard({ post }) {
  const { index, Icon } = categoryMeta(post.category);

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{
        ...accentStyle(index),
        backgroundImage: "linear-gradient(180deg, #fff 0%, var(--tint) 100%)",
      }}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-[#eadfd6] p-4 text-[#14274e] no-underline shadow-[0_10px_30px_rgba(20,39,78,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[rgba(var(--glow),0.4)] hover:shadow-[0_18px_40px_rgba(var(--glow),0.18)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--a1)] motion-reduce:transition-none sm:rounded-[20px] sm:p-5 lg:p-6"
    >
      {/* category */}
      <div className="mb-3.5 flex min-w-0 items-center gap-2.5 sm:mb-4">
        <span
          aria-hidden="true"
          className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-white text-[color:var(--at)] shadow-[0_4px_12px_rgba(var(--glow),0.18)] transition duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none sm:h-9 sm:w-9"
        >
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.9} />
        </span>
        <span className="truncate text-[.68rem] font-bold uppercase tracking-[.09em] text-[color:var(--at)] sm:text-[.72rem]">
          {post.category}
        </span>
      </div>

      <h3 className="mb-2 overflow-hidden break-words text-[1.05rem] font-bold leading-[1.35] transition-colors duration-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] group-hover:text-[color:var(--at)] sm:mb-2.5 sm:text-[1.12rem] sm:[-webkit-line-clamp:2] lg:text-[1.15rem]">
        {post.title}
      </h3>

      <p className="flex-1 overflow-hidden break-words text-[.88rem] leading-[1.7] text-[#4a5a7a] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:text-[.92rem]">
        {post.excerpt}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eadfd6] pt-3.5 sm:mt-5 sm:pt-4">
        <span className="min-w-0 text-[.76rem] leading-[1.5] text-[#4a5a7a] sm:text-[.8rem]">
          {formatDate(post.createdAt)} <span aria-hidden="true">·</span> {readMinutes(post)} min read
        </span>
        <span
          aria-hidden="true"
          className="grid h-8 w-8 flex-none place-items-center rounded-full border border-[rgba(var(--glow),0.35)] bg-white text-[color:var(--at)] transition duration-300 group-hover:border-transparent group-hover:bg-[color:var(--a1)] group-hover:text-white motion-reduce:transition-none"
        >
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}