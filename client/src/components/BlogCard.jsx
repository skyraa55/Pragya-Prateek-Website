import { Link } from "react-router-dom";
import { formatDate } from "../api.js";
import { BLOG_CATEGORIES } from "../siteConfig.js";

/* =========================================================
   Accent colours: change these hex values to match your site.
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
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
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

export default function BlogCard({ post }) {
  const index = BLOG_CATEGORIES.findIndex((c) => c.name === post.category);

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={accentStyle(index < 0 ? 0 : index)}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#eadfd6] bg-white text-[#14274e] no-underline shadow-[0_8px_24px_rgba(20,39,78,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[rgba(var(--glow),0.4)] hover:shadow-[0_18px_40px_rgba(var(--glow),0.2)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--a1)] motion-reduce:transition-none"
    >
      {/* ---------- Top panel ---------- */}
      <div
        className="relative flex h-[116px] items-center justify-center sm:h-[136px]"
        style={{
          backgroundColor: "var(--tint)",
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(var(--glow), 0.24), transparent 55%), radial-gradient(circle at 88% 90%, rgba(var(--glow), 0.16), transparent 50%)",
        }}
      >
        <span className="absolute left-3.5 top-3.5 max-w-[calc(100%-1.8rem)] truncate rounded-full border border-white/95 bg-white/70 px-3 py-[5px] text-[.74rem] font-bold text-[#14274e] backdrop-blur-lg">
          {post.category}
        </span>
        <span
          aria-hidden="true"
          className="grid h-[60px] w-[60px] place-items-center rounded-full bg-white text-[1.75rem] shadow-[0_8px_20px_rgba(var(--glow),0.25)] transition-transform duration-300 group-hover:-translate-y-[3px] sm:h-[68px] sm:w-[68px] sm:text-[2rem]"
        >
          {post.icon}
        </span>
      </div>

      {/* ---------- Body ---------- */}
      <div className="flex flex-1 flex-col gap-2 px-5 pb-6 pt-5">
        <span className="text-[.78rem] text-[#4a5a7a]">{formatDate(post.createdAt)}</span>

        <h3 className="text-[1.13rem] font-bold leading-[1.35] overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] transition-colors duration-300 group-hover:text-[color:var(--at)]">
          {post.title}
        </h3>

        <p className="flex-1 text-[.92rem] leading-[1.65] text-[#4a5a7a] overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {post.excerpt}
        </p>

        <span className="mt-1.5 inline-flex items-center gap-1.5 text-[.9rem] font-bold text-[color:var(--at)]">
          Read more
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}