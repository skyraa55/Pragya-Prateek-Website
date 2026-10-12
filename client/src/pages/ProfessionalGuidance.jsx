import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ---------- Theme (same brand palette as the rest of the site) ---------- */
const C = {
  pink: "#ff4d6d",
  orange: "#ff9f43",
  purple: "#8b6fe0",
  navy: "#14274e",
  soft: "#4a5a7a",
  bg: "#fffaf5",
  line: "#eadfd6",
  tintPink: "#fff1f3",
  tintYellow: "#fff6e3",
  tintPurple: "#f1edfc",
  tintGreen: "#ecf9f3",
};

/* ---------- Icons (replace the emojis) ---------- */
const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const PenIcon = () => (
  <Svg>
    <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
    <path d="M14 6l3 3" />
  </Svg>
);
const PlayIcon = () => (
  <Svg>
    <rect x="3" y="5.5" width="18" height="13" rx="4" />
    <path d="M10.5 9.5v5l4-2.5-4-2.5z" />
  </Svg>
);
const TagIcon = () => (
  <Svg>
    <path d="M3 12V4h8l10 10-8 8L3 12z" />
    <circle cx="7.5" cy="8.5" r="1.3" />
  </Svg>
);
const ChatIcon = () => (
  <Svg>
    <path d="M4 5h16v11H9l-5 4V5z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </Svg>
);
const RouteIcon = () => (
  <Svg>
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6" />
  </Svg>
);
const BriefcaseIcon = () => (
  <Svg>
    <rect x="3" y="7" width="18" height="13" rx="3" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18" />
  </Svg>
);
const SproutIcon = () => (
  <Svg>
    <path d="M12 21v-9" />
    <path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z" />
    <path d="M12 15c0-3-2-5-6-5 0 3 2 5 6 5z" />
  </Svg>
);

/* ---------- Content (unchanged) ---------- */
const topics = [
  { Icon: PenIcon, title: "Educational content creation" },
  { Icon: PlayIcon, title: "YouTube and Instagram presence" },
  { Icon: TagIcon, title: "Personal branding" },
  { Icon: ChatIcon, title: "Communicating psychology online" },
  { Icon: RouteIcon, title: "Building a content strategy" },
  { Icon: BriefcaseIcon, title: "Developing your professional presence" },
  { Icon: SproutIcon, title: "Understanding how to start and structure your online work" },
];

/* tint + accent per card, cycling through the brand colours */
const tones = [
  { tint: C.tintPink, color: C.pink },
  { tint: C.tintYellow, color: "#e58a1f" },
  { tint: C.tintPurple, color: C.purple },
  { tint: C.tintGreen, color: "#2fb585" },
];

/* ---------- Helpers ---------- */
function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`pg-rv ${show ? "pg-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

const Grad = ({ children }) => <span className="pg-word">{children}</span>;

export default function ProfessionalGuidance() {
  useEffect(() => { document.title = "Professional Growth Guidance — Pragya Prateek"; }, []);

  return (
    <section className="pg-root" style={{ color: C.navy }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap');
        .pg-root{
          font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;
          min-height:70vh;
          background:
            radial-gradient(55% 40% at 12% 0%, ${C.tintPink} 0%, transparent 70%),
            radial-gradient(50% 40% at 92% 6%, ${C.tintPurple} 0%, transparent 70%),
            ${C.bg};
          padding:clamp(2.5rem,5vw,4rem) 0 clamp(4rem,8vw,6.5rem);
        }
        .pg-root *,.pg-root *::before,.pg-root *::after{box-sizing:border-box}
        .pg-root h1,.pg-root h2,.pg-root p,.pg-root ul{margin:0;padding:0}
        .pg-root ul{list-style:none}
        .pg-root a{text-decoration:none}
        .pg-wrap{width:92%;max-width:960px;margin:0 auto}

        /* back link */
        .pg-back{
          display:inline-flex;align-items:center;gap:.5rem;padding:.55rem 1.1rem .55rem .9rem;border-radius:999px;
          background:#fff;border:1px solid ${C.line};color:${C.navy};font-size:.9rem;font-weight:700;
          transition:transform .3s ease,border-color .3s ease,color .3s ease;
        }
        .pg-back svg{transition:transform .3s ease}
        .pg-back:hover{border-color:${C.pink};color:#e23a5c}
        .pg-back:hover svg{transform:translateX(-3px)}

        /* hero */
        .pg-hero{display:flex;flex-direction:column;align-items:center;gap:1.25rem;text-align:center;margin-top:clamp(2.5rem,5vw,3.75rem)}
        .pg-h1{max-width:20ch;font-size:clamp(2rem,5vw,3.2rem);font-weight:700;line-height:1.15;letter-spacing:-.025em;text-wrap:balance}
        .pg-intro{max-width:62ch;font-size:1.08rem;line-height:1.9;color:${C.soft}}
        .pg-word{
          display:inline-block;
          background:linear-gradient(100deg,${C.pink},${C.orange},${C.purple},${C.pink});background-size:300% 100%;
          -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
          animation:pgFlow 7s ease-in-out infinite;
        }
        @keyframes pgFlow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

        /* scroll reveal (fade only) */
        .pg-rv{opacity:0;transition:opacity .9s cubic-bezier(.22,1,.36,1)}
        .pg-in{opacity:1}

        /* topics */
        .pg-topics-head{display:flex;flex-direction:column;align-items:center;gap:.9rem;text-align:center;margin-top:clamp(3.5rem,7vw,5.5rem)}
        .pg-h2{font-size:clamp(1.4rem,2.6vw,1.85rem);font-weight:700;letter-spacing:-.015em}
        .pg-root .pg-grid{display:grid;grid-template-columns:1fr;gap:1.1rem;margin-top:clamp(2.5rem,5vw,3.5rem)}
        @media (min-width:640px){
          .pg-root .pg-grid{grid-template-columns:1fr 1fr;gap:1.25rem}
          .pg-grid > li:last-child:nth-child(odd){grid-column:1 / -1;justify-self:center;width:calc(50% - .625rem)}
        }
        .pg-card{
          display:flex;align-items:center;gap:1.1rem;height:100%;background:#fff;border:1px solid ${C.line};border-radius:24px;padding:1.2rem 1.4rem 1.2rem 1.2rem;
          box-shadow:0 18px 36px -30px rgba(20,39,78,.45);transition:transform .35s ease,box-shadow .35s ease,border-color .35s ease;
        }
        .pg-card:hover{transform:translateY(-4px);box-shadow:0 24px 40px -28px rgba(20,39,78,.5);border-color:var(--c)}
        .pg-ic{display:grid;place-items:center;flex-shrink:0;width:56px;height:56px;border-radius:18px;background:var(--t);color:var(--c);transition:transform .45s cubic-bezier(.3,1.5,.5,1)}
        .pg-card:hover .pg-ic{transform:scale(1.08) rotate(-6deg)}
        .pg-card-t{font-size:1.02rem;font-weight:700;line-height:1.4}

        /* call to action */
        .pg-cta{display:flex;justify-content:center;margin-top:clamp(3rem,6vw,4.5rem)}
        .pg-btn{
          display:inline-flex;align-items:center;justify-content:center;padding:1rem 2.1rem;border-radius:999px;color:#fff;
          font-family:inherit;font-size:1rem;font-weight:700;line-height:1.2;background:linear-gradient(120deg,${C.pink},${C.orange});
          box-shadow:0 18px 32px -16px rgba(255,77,109,.8);transition:transform .3s ease,box-shadow .3s ease;
        }
        .pg-btn:hover{transform:translateY(-3px);box-shadow:0 24px 36px -16px rgba(255,77,109,.9)}
        .pg-btn:focus-visible,.pg-back:focus-visible{outline:3px solid rgba(255,77,109,.35);outline-offset:3px}

        /* responsiveness */
        .pg-h1,.pg-intro,.pg-card-t{overflow-wrap:break-word}
        .pg-card > :last-child{min-width:0}
        @media (max-width:640px){
          .pg-hero{gap:1.1rem}
          .pg-topics-head{margin-top:3rem}
        }
        @media (max-width:480px){
          .pg-wrap{width:90%}
          .pg-intro{font-size:1rem;line-height:1.8}
          .pg-card{gap:.9rem;padding:1rem 1.1rem 1rem 1rem;border-radius:20px}
          .pg-ic{width:48px;height:48px;border-radius:15px}
          .pg-ic svg{width:22px;height:22px}
          .pg-card-t{font-size:.98rem}
          .pg-btn{width:100%;padding:1rem 1.25rem}
        }
        @media (min-width:1280px){
          .pg-wrap{max-width:1040px}
        }

        @media (prefers-reduced-motion:reduce){
          .pg-root *,.pg-root *::before,.pg-root *::after{animation:none!important;transition:none!important}
          .pg-rv{opacity:1!important}
        }
      `}</style>

      <div className="pg-wrap">
        <Link to="/services" className="pg-back">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back to Services
        </Link>

        {/* Hero */}
        <div className="pg-hero">
          <Reveal delay={80}>
            <h1 className="pg-h1">
              Want to Start and <Grad>Grow Your Work</Grad> in Mental Health Space?
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="pg-intro">
              Having the qualification is one part of building a professional career. Understanding
              how to communicate your expertise, create useful educational content and build a
              professional presence digitally is another. I offer practical guidance for psychology
              or mental-health freshers or professionals who want to explore these areas step by step.
            </p>
          </Reveal>
        </div>

        {/* Topics */}
        <Reveal className="pg-topics-head">
          <h2 className="pg-h2">This may include guidance around:</h2>
        </Reveal>

        <ul className="pg-grid">
          {topics.map((t, i) => {
            const tone = tones[i % tones.length];
            return (
              <Reveal key={t.title} as="li" delay={(i % 2) * 90}>
                <div className="pg-card" style={{ "--t": tone.tint, "--c": tone.color }}>
                  <span className="pg-ic"><t.Icon /></span>
                  <b className="pg-card-t">{t.title}</b>
                </div>
              </Reveal>
            );
          })}
        </ul>

        {/* CTA */}
        <Reveal className="pg-cta">
          <Link to="/book" className="pg-btn">Start Your Growth Plan →</Link>
        </Reveal>
      </div>
    </section>
  );
}