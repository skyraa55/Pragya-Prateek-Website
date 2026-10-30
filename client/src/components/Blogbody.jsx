import { accentStyle } from "./BlogCard.jsx";
import { categoryMeta, getBlocks } from "./blogUtils.js";

/* Renders a blog's content (static blogs and blogs added from /admin) in one clean reading style */
export default function BlogBody({ post }) {
  const { index } = categoryMeta(post.category);
  const blocks = getBlocks(post);

  return (
    <div style={accentStyle(index)} className="min-w-0 text-[#14274e]">
      {blocks.map((b, i) => {
        if (b.t === "h") {
          return (
            <h2
              key={i}
              className="mb-3 mt-9 break-words text-[clamp(1.2rem,4.4vw,1.65rem)] font-bold leading-[1.3] tracking-[-0.01em] sm:mb-4 sm:mt-12"
            >
              {b.x}
            </h2>
          );
        }

        if (b.t === "li") {
          const next = blocks[i + 1];
          const isLast = !next || next.t !== "li";
          return (
            <div
              key={i}
              className={`flex gap-3 border-t border-[#eadfd6] py-4 sm:gap-4 sm:py-5 ${isLast ? "mb-6 border-b" : ""}`}
            >
              <span
                aria-hidden="true"
                className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full border border-[rgba(var(--glow),0.35)] bg-[color:var(--tint)] text-[.76rem] font-bold text-[color:var(--at)] sm:h-8 sm:w-8 sm:text-[.82rem]"
              >
                {b.n}
              </span>
              <div className="min-w-0">
                {b.h && (
                  <h3 className="mb-1 break-words text-[1rem] font-bold leading-[1.35] sm:mb-1.5 sm:text-[1.05rem]">
                    {b.h}
                  </h3>
                )}
                <p className="break-words text-[.95rem] leading-[1.8] text-[#4a5a7a] sm:text-[1rem]">{b.x}</p>
              </div>
            </div>
          );
        }

        return (
          <p key={i} className="mb-4 break-words text-[.98rem] leading-[1.85] text-[#33425f] sm:mb-5 sm:text-[1.06rem]">
            {b.x}
          </p>
        );
      })}
    </div>
  );
}