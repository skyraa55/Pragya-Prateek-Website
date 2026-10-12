import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../useSite.js";

/* ---------- Theme (same brand palette as the About page) ---------- */
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
};

/* One accent per service: tint (panel), accent (badge), deep (text on tint) */
const themes = [
  { tint: C.tintPink, accent: C.pink, deep: "#e23a5c" },
  { tint: C.tintPurple, accent: C.purple, deep: "#6f52c9" },
  { tint: C.tintYellow, accent: C.orange, deep: "#c96a0a" },
];

/* ---------- Content (unchanged) ---------- */
const buildServices = (guidanceHref) => [
  {
    title: "One-to-One Psychology Career Guidance Sessions",
    tagline: "Sometimes General Information Isn't Enough.",
    paras: [
      "There is plenty of information available online but your situation is unique.",
      "A 1:1 session gives us the opportunity to look at your background, your goals, your questions and your current situation and work towards greater clarity about your next steps.",
      "If you are a psychology student, recent graduate or someone considering a career in psychology in future, personalised guidance can help you understand your options and identify the next steps that make sense for your goals.",
    ],
    listTitle: "Guidance can include:",
    items: [
      "Understanding career pathways in psychology",
      "Exploring specialisations and emerging fields",
      "Choosing further education",
      "Identifying relevant skills",
      "Understanding professional opportunities",
      "Planning your next steps after degree",
      "Creating a practical career roadmap",
    ],
    buttons: [{ label: "Find Your Next Step →", to: "/book", primary: true }],
  },
  {
    title: "Workshops & Programs",
    tagline: "Learning Psychology Through Experience",
    paras: [
      "Workshops can create a different kind of learning experience: one that is interactive, practical and easier to connect with real life.",
      "I design and facilitate psychology-based workshops and learning experiences around relevant personal, educational and professional-development themes.",
    ],
    listTitle: "These can be developed for:",
    items: ["Educational institutions", "Student groups", "Organisations", "Communities", "Professional groups", "Other relevant audiences"],
    buttons: [
      { label: "Explore Workshops →", to: "/workshops" },
      { label: "Discuss Your Workshop →", to: "/book", primary: true },
    ],
  },
  {
    title: "Professional Growth Guidance",
    tagline: "Want to Start and Grow Your Work in Mental Health Space?",
    paras: [
      "Having the qualification is one part of building a professional career.",
      "Understanding how to communicate your expertise, create useful educational content and build a professional presence digitally is another.",
      "I offer practical guidance for psychology or mental-health freshers or professionals who want to explore these areas step by step.",
    ],
    listTitle: "This may include guidance around:",
    items: [
      "Educational content creation",
      "YouTube and Instagram presence",
      "Personal branding",
      "Communicating psychology online",
      "Building a content strategy",
      "Developing your professional presence",
      "Understanding how to start and structure your online work",
    ],
    buttons: [
      guidanceHref
        ? { label: "Explore Professional Guidance →", href: guidanceHref, external: true }
        : { label: "Explore Professional Guidance →", to: "/professional-guidance" },
      { label: "Start Your Growth Plan →", to: "/book", primary: true },
    ],
  },
];

/* ---------- Helpers ---------- */
function Reveal({ children, delay = 0, dir = "up", as: Tag = "div", className = "" }) {
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
    <Tag ref={ref} className={`sv-rv sv-${dir} ${show ? "sv-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

const Grad = ({ children }) => <span className="sv-word">{children}</span>;

const Check = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

function Btn({ b }) {
  const cls = `sv-btn ${b.primary ? "sv-btn-primary" : "sv-btn-line"}`;
  if (b.to) return <Link className={cls} to={b.to}>{b.label}</Link>;
  return (
    <a className={cls} href={b.href} {...(b.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {b.label}
    </a>
  );
}

/* ---------- Page ---------- */
export default function Services() {
  const SITE = useSite();
  const services = buildServices(SITE.professionalGuidanceDocUrl);

  return (
    <section id="services" className="services-root" style={{ color: C.navy }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap');
        .services-root{
          font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden;
          background:${C.bg};
          padding:clamp(4rem,8vw,6.5rem) 0 0;
        }
        .services-root *,.services-root *::before,.services-root *::after{box-sizing:border-box}
        .services-root h2,.services-root h3,.services-root p,.services-root ul{margin:0;padding:0}
        .services-root ul{list-style:none}
        .services-root a{text-decoration:none}

        .sv-wrap{width:92%;max-width:1120px;margin:0 auto}

        /* header */
        .sv-head{display:flex;flex-direction:column;align-items:center;gap:1.1rem;text-align:center;padding-bottom:clamp(3rem,6vw,4.5rem)}
        .sv-label{font-size:.95rem;font-weight:600;color:#e23a5c}
        .sv-h2{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;line-height:1.18;letter-spacing:-.02em}
        .sv-intro{max-width:62ch;font-size:1.06rem;line-height:1.85;color:${C.soft}}

        /* gradient word */
        .sv-word{
          display:inline-block;
          background:linear-gradient(100deg,${C.pink},${C.orange},${C.purple},${C.pink});
          background-size:300% 100%;
          -webkit-background-clip:text;background-clip:text;
          -webkit-text-fill-color:transparent;color:transparent;
          animation:svFlow 7s ease-in-out infinite;
        }
        @keyframes svFlow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

        /* scroll reveal (fade only, nothing slides) */
        .sv-rv{opacity:0;transition:opacity .9s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1)}
        .sv-up{transform:translateY(16px)}
        .sv-fade{transform:none}
        .sv-in{opacity:1;transform:none}

        /* one full-width band per service: all three are always visible */
        .sv-band{background:var(--tint);padding:clamp(3.25rem,7vw,5.5rem) 0}
        .sv-grid{display:grid;grid-template-columns:1fr;gap:clamp(2.25rem,4vw,3rem)}
        @media (min-width:1024px){
          .sv-grid{grid-template-columns:7fr 5fr;gap:clamp(3.5rem,6vw,5.5rem);align-items:start}
          .sv-band.sv-flip .sv-grid{grid-template-columns:5fr 7fr}
          .sv-band.sv-flip .sv-main{order:2}
          .sv-band.sv-flip .sv-side{order:1}
        }

        /* reading column */
        .sv-main{position:relative}
        .sv-ghost{
          position:absolute;right:0;top:-1.2rem;z-index:0;pointer-events:none;user-select:none;
          font-size:clamp(7rem,15vw,11rem);font-weight:800;line-height:.8;letter-spacing:-.04em;color:var(--accent);opacity:.12;
        }
        .sv-main > *:not(.sv-ghost){position:relative;z-index:1}
        .sv-top{display:flex;align-items:center;gap:1rem;max-width:calc(100% - 4rem)}
        .sv-num{display:grid;place-items:center;flex-shrink:0;width:48px;height:48px;border-radius:50%;background:var(--accent);color:#fff;font-size:1.15rem;font-weight:800}
        .sv-main.sv-in .sv-num{animation:svPop .8s cubic-bezier(.3,1.5,.5,1) .15s backwards}
        @keyframes svPop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:none}}
        .sv-title{font-size:clamp(1.4rem,2.5vw,1.95rem);font-weight:700;line-height:1.25;letter-spacing:-.015em}
        .sv-tag{margin-top:1.6rem;font-size:1.08rem;font-weight:700;line-height:1.45;color:var(--deep)}
        .sv-paras{display:flex;flex-direction:column;gap:1.15rem;margin-top:1.25rem;max-width:62ch}
        .sv-p{font-size:1.04rem;line-height:1.9;color:${C.soft}}

        /* list card with the buttons at its foot */
        .sv-side{background:#fff;border-radius:30px;padding:clamp(1.6rem,3vw,2.4rem);box-shadow:0 28px 54px -38px rgba(20,39,78,.45)}
        .sv-list-t{font-size:1.06rem;font-weight:700;padding-bottom:1.15rem;border-bottom:1px solid ${C.line}}
        .sv-items{display:flex;flex-direction:column;gap:1.05rem;margin-top:1.4rem}
        .sv-item{display:flex;align-items:flex-start;gap:.9rem;font-size:1rem;line-height:1.5;color:${C.navy};opacity:0}
        .sv-ck{display:grid;place-items:center;flex-shrink:0;width:24px;height:24px;margin-top:1px;border-radius:50%;background:var(--tint);color:var(--deep)}
        .sv-side.sv-in .sv-item{opacity:1;animation:svItem .7s cubic-bezier(.22,1,.36,1) backwards;animation-delay:var(--d,0ms)}
        @keyframes svItem{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
        .sv-btns{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.9rem;padding-top:1.7rem;border-top:1px solid ${C.line}}

        /* buttons */
        .sv-btn{
          display:inline-flex;align-items:center;justify-content:center;padding:.8rem 1.4rem;border-radius:999px;
          font-family:inherit;font-size:.92rem;font-weight:700;line-height:1.2;border:1.5px solid transparent;cursor:pointer;
          transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease,color .3s ease;
        }
        .sv-btn:hover{transform:translateY(-2px)}
        .sv-btn-primary{color:#fff;background:linear-gradient(120deg,${C.pink},${C.orange});box-shadow:0 14px 26px -14px rgba(255,77,109,.75)}
        .sv-btn-primary:hover{box-shadow:0 18px 30px -14px rgba(255,77,109,.85)}
        .sv-btn-line{color:${C.navy};background:#fff;border-color:rgba(20,39,78,.18)}
        .sv-btn-line:hover{border-color:var(--accent);color:var(--deep)}

        @media (prefers-reduced-motion:reduce){
          .services-root *,.services-root *::before,.services-root *::after{animation:none!important;transition:none!important}
          .sv-rv,.sv-item,.sv-word{opacity:1!important;transform:none!important}
        }
      `}</style>

      {/* Header */}
      <div className="sv-wrap">
        <div className="sv-head">
          <Reveal><span className="sv-label">Services</span></Reveal>
          <Reveal delay={80}>
            <h2 className="sv-h2">
              Ways We Can <Grad>Work Together!</Grad>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="sv-intro">
              Whether you are trying to understand your psychology career, looking for personalised
              guidance, planning a workshop or exploring ways to build your professional or digital
              presence, there are different ways we can work together.
            </p>
          </Reveal>
        </div>
      </div>

      {/* All three services, one band each */}
      {services.map((s, i) => {
        const t = themes[i % themes.length];
        return (
          <div
            key={s.title}
            className={`sv-band ${i % 2 === 1 ? "sv-flip" : ""}`}
            style={{ "--tint": t.tint, "--accent": t.accent, "--deep": t.deep }}
          >
            <div className="sv-wrap">
              <div className="sv-grid">
                <Reveal className="sv-main" dir="fade">
                  <span className="sv-ghost" aria-hidden="true">{i + 1}</span>
                  <div className="sv-top">
                    <span className="sv-num" aria-hidden="true">{i + 1}</span>
                    <h3 className="sv-title">{s.title}</h3>
                  </div>
                  <p className="sv-tag">{s.tagline}</p>
                  <div className="sv-paras">
                    {s.paras.map((p) => (
                      <p key={p} className="sv-p">{p}</p>
                    ))}
                  </div>
                </Reveal>

                <Reveal className="sv-side" dir="fade" delay={120}>
                  <p className="sv-list-t">{s.listTitle}</p>
                  <ul className="sv-items">
                    {s.items.map((it, k) => (
                      <li key={it} className="sv-item" style={{ "--d": `${300 + k * 80}ms` }}>
                        <span className="sv-ck"><Check /></span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="sv-btns">
                    {s.buttons.map((b) => <Btn key={b.label} b={b} />)}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}