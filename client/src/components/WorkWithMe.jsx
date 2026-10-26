import { Link } from "react-router-dom";

/* Each card gets its own colour pair from the site theme */
const areas = [
  { tone: "t1", title: "Workshops & Programs", desc: "Psychology-based awareness and developmental workshops." },
  { tone: "t2", title: "Educational Content", desc: "Mental health-focused content, scripts, blogs, articles and educational projects." },
  { tone: "t3", title: "Professional Projects", desc: "Projects related to psychology career and professional development." },
  { tone: "t4", title: "Content Collaborations", desc: "Relevant collaborations across YouTube, Instagram and other digital platforms." },
  { tone: "t5", title: "Professional Guidance", desc: "Guidance for psychology and mental-health professionals exploring content creation, client conversion or digital presence." },
];

/* ---------- Arrow icon ---------- */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default function WorkWithMe() {
  return (
    <section className="wwm" id="work">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&display=swap");

        .wwm {
          --c-pink: #ff4d6d;
          --c-orange: #ff9f43;
          --c-purple: #8b6fe0;
          --c-blue: #4dabf7;
          --c-green: #2fb67c;
          --c-navy: #14274e;
          --c-navy-soft: #4a5a7a;
          --c-bg: #fffaf5;
          --c-line: #eadfd6;

          background: linear-gradient(180deg, #ffffff 0%, var(--c-bg) 100%);
          color: var(--c-navy);
          padding: clamp(2.5rem, 8vw, 5.5rem) 0 clamp(3rem, 9vw, 6.5rem);
          overflow-x: hidden;
        }
        .wwm *, .wwm *::before, .wwm *::after { box-sizing: border-box; }

        .wwm-wrap {
          width: 100%;
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 4vw, 2rem);
        }

        /* ---------- Heading ---------- */
        .wwm-head {
          max-width: 700px;
          margin: 0 auto clamp(2rem, 6vw, 3.5rem);
          text-align: center;
        }
        .wwm-eyebrow {
          display: inline-block;
          padding: .3rem .9rem;
          margin-bottom: .9rem;
          border-radius: 999px;
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--c-pink);
          background: #fff1f3;
          border: 1px solid #ffd3da;
        }
        .wwm-title {
          font-size: clamp(1.6rem, 6vw, 3rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0 0 clamp(.9rem, 3vw, 1.3rem);
        }
        .wwm-title span {
          background: linear-gradient(100deg, var(--c-pink), var(--c-orange), var(--c-purple), var(--c-pink));
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: wwmFlow 7s ease-in-out infinite;
        }
        @keyframes wwmFlow {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .wwm-sub {
          margin: 0 auto;
          color: var(--c-navy-soft);
          font-size: clamp(.9rem, 2.6vw, 1.08rem);
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        /* ---------- Sub heading with lines ---------- */
        .wwm-lead {
          display: flex;
          align-items: center;
          gap: clamp(.75rem, 2.5vw, 1.25rem);
          margin-bottom: clamp(1.25rem, 4vw, 2rem);
        }
        .wwm-lead::before,
        .wwm-lead::after {
          content: "";
          flex: 1;
          height: 2px;
          border-radius: 999px;
        }
        .wwm-lead::before { background: linear-gradient(90deg, transparent, var(--c-pink), var(--c-orange)); }
        .wwm-lead::after  { background: linear-gradient(90deg, var(--c-orange), var(--c-pink), transparent); }
        .wwm-lead h3 {
          margin: 0;
          font-family: "Playfair Display", Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(1.2rem, 4vw, 1.9rem);
          line-height: 1.3;
          color: var(--c-navy);
          text-align: center;
        }

        /* ---------- Cards grid ---------- */
        .wwm-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1.1rem, 3vw, 1.75rem);
        }
        @media (min-width: 640px) {
          .wwm-grid { grid-template-columns: repeat(2, 1fr); }
          /* last card sits centred under the pair */
          .wwm-card:last-child {
            grid-column: 1 / -1;
            width: calc(50% - .9rem);
            justify-self: center;
          }
        }
        @media (min-width: 992px) {
          .wwm-grid { grid-template-columns: repeat(6, 1fr); }
          .wwm-card { grid-column: span 2; }
          /* second row of two is centred */
          .wwm-card:nth-child(4) { grid-column: 2 / span 2; }
          .wwm-card:nth-child(5) { grid-column: 4 / span 2; }
          .wwm-card:last-child { width: auto; justify-self: stretch; }
        }

        .wwm-card {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: clamp(1.25rem, 3vw, 1.75rem);
          border-radius: clamp(16px, 2vw, 20px);
          background: linear-gradient(180deg, #fff 0%, var(--tint) 100%);
          border: 1px solid var(--c-line);
          box-shadow: 0 10px 30px rgba(20, 39, 78, .06);
          transition: transform .35s ease, box-shadow .35s ease;
        }
        .wwm-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(20, 39, 78, .12);
        }
        .wwm-card.t1 { --a1: var(--c-pink);   --a2: var(--c-orange); --glow: 255, 77, 109;  --tint: #fff1f3; }
        .wwm-card.t2 { --a1: var(--c-purple); --a2: var(--c-blue);   --glow: 139, 111, 224; --tint: #f3f0fd; }
        .wwm-card.t3 { --a1: var(--c-green);  --a2: var(--c-blue);   --glow: 47, 182, 124;  --tint: #ecf9f3; }
        .wwm-card.t4 { --a1: var(--c-orange); --a2: var(--c-pink);   --glow: 255, 159, 67;  --tint: #fff6ec; }
        .wwm-card.t5 { --a1: var(--c-purple); --a2: var(--c-pink);   --glow: 139, 111, 224; --tint: #f6f0fd; }

        /* number badge replaces the emoji */
        .wwm-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: clamp(42px, 4vw + 26px, 52px);
          height: clamp(42px, 4vw + 26px, 52px);
          margin-bottom: 1rem;
          border-radius: 50%;
          font-family: "Playfair Display", Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 600;
          font-size: 1.2rem;
          color: #fff;
          background: linear-gradient(135deg, var(--a1), var(--a2));
          box-shadow: 0 8px 18px rgba(var(--glow), .35), inset 0 1.5px 0 rgba(255, 255, 255, .5);
          transition: transform .45s cubic-bezier(.22, 1, .36, 1);
        }
        .wwm-card:hover .wwm-num { transform: scale(1.1) rotate(-6deg); }

        .wwm-card h4 {
          margin: 0 0 .55rem;
          font-size: clamp(1.05rem, 2.2vw, 1.25rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.3;
          color: var(--c-navy);
          overflow-wrap: anywhere;
        }
        .wwm-card p {
          margin: 0;
          color: var(--c-navy-soft);
          font-size: clamp(.88rem, 1.8vw, .96rem);
          line-height: 1.65;
        }

        /* ---------- Call to action ---------- */
        .wwm-cta {
          --a1: var(--c-pink);
          --a2: var(--c-orange);
          --glow: 255, 77, 109;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1rem, 3vw, 1.4rem);
          margin-top: clamp(2rem, 6vw, 3.5rem);
          padding: clamp(1.75rem, 5vw, 3rem) clamp(1.1rem, 4vw, 2rem);
          text-align: center;
          border-radius: clamp(18px, 2.4vw, 26px);
          background: linear-gradient(180deg, #fff 0%, #fff1f3 100%);
          border: 1px solid var(--c-line);
          box-shadow: 0 10px 30px rgba(20, 39, 78, .06);
        }
        .wwm-cta::before,
        .wwm-cta::after {
          content: "";
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          filter: blur(40px);
          opacity: .35;
        }
        .wwm-cta::before { width: 220px; height: 220px; top: -90px; left: -60px; background: var(--c-pink); }
        .wwm-cta::after  { width: 220px; height: 220px; bottom: -90px; right: -60px; background: var(--c-orange); }
        .wwm-cta p {
          margin: 0;
          max-width: 46ch;
          color: var(--c-navy);
          font-weight: 600;
          font-size: clamp(.95rem, 2.4vw, 1.12rem);
          line-height: 1.6;
        }

        /* ---------- Glass button (same as Intro) ---------- */
        .wwm-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          max-width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(.5rem, 1vw + .2rem, .9rem);
          padding: clamp(.25rem, .5vw + .12rem, .45rem) clamp(.25rem, .5vw + .12rem, .45rem) clamp(.25rem, .5vw + .12rem, .45rem) clamp(.9rem, 1.2vw + .6rem, 1.3rem);
          border-radius: 999px;
          font-size: clamp(.78rem, 1.4vw + .55rem, .93rem);
          font-weight: 700;
          line-height: 1.25;
          color: var(--c-navy);
          text-decoration: none;
          background:
            linear-gradient(180deg, rgba(255,255,255,.8), rgba(255,255,255,.15) 60%),
            rgba(255, 255, 255, .25);
          -webkit-backdrop-filter: blur(14px) saturate(180%);
          backdrop-filter: blur(14px) saturate(180%);
          border: 1.5px solid rgba(255, 255, 255, .9);
          box-shadow:
            0 8px 20px rgba(var(--glow), .22),
            inset 0 1.5px 0 rgba(255, 255, 255, .95),
            inset 0 -8px 16px rgba(var(--glow), .12);
          transition:
            transform .45s cubic-bezier(.22, 1, .36, 1),
            box-shadow .45s cubic-bezier(.22, 1, .36, 1),
            color .35s ease;
        }
        .wwm-btn::before,
        .wwm-btn::after {
          content: "";
          position: absolute;
          z-index: -1;
          width: clamp(44px, 4vw + 28px, 64px);
          height: clamp(44px, 4vw + 28px, 64px);
          border-radius: 50%;
          filter: blur(12px);
          opacity: .75;
          transition: scale .8s cubic-bezier(.22, 1, .36, 1), opacity .4s ease;
        }
        .wwm-btn::before { background: var(--a1); left: 6%; top: -25%; animation: wwmOrbA 8s ease-in-out infinite; }
        .wwm-btn::after  { background: var(--a2); right: 12%; bottom: -35%; animation: wwmOrbB 9s ease-in-out infinite; }
        @keyframes wwmOrbA { 0%, 100% { translate: 0 0; } 50% { translate: 100px 10px; } }
        @keyframes wwmOrbB { 0%, 100% { translate: 0 0; } 50% { translate: -90px -8px; } }

        .wwm-btn-text { position: relative; z-index: 1; min-width: 0; }
        .wwm-btn-arrow {
          position: relative;
          z-index: 1;
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: clamp(28px, 2vw + 20px, 38px);
          height: clamp(28px, 2vw + 20px, 38px);
          border-radius: 50%;
          overflow: hidden;
          color: var(--a1);
          background: rgba(255, 255, 255, .65);
          border: 1.5px solid rgba(255, 255, 255, .95);
          box-shadow: 0 4px 10px rgba(var(--glow), .25), inset 0 1px 0 #fff;
          transition: transform .45s cubic-bezier(.22, 1, .36, 1);
        }
        .wwm-btn-arrow svg {
          position: absolute;
          width: clamp(13px, .6vw + 10px, 16px);
          height: clamp(13px, .6vw + 10px, 16px);
          transition: transform .45s cubic-bezier(.22, 1, .36, 1);
        }
        .wwm-btn-arrow svg:nth-child(2) { transform: translateX(-28px); }
        .wwm-btn:hover {
          transform: translateY(-3px);
          color: #fff;
          box-shadow:
            0 16px 32px rgba(var(--glow), .38),
            inset 0 1.5px 0 rgba(255, 255, 255, .95),
            inset 0 -8px 16px rgba(255, 255, 255, .15);
        }
        .wwm-btn:hover::before,
        .wwm-btn:hover::after { scale: 5.5; opacity: .95; }
        .wwm-btn:hover .wwm-btn-text { text-shadow: 0 1px 6px rgba(20, 39, 78, .3); }
        .wwm-btn:hover .wwm-btn-arrow { transform: scale(1.08); }
        .wwm-btn:hover .wwm-btn-arrow svg:nth-child(1) { transform: translateX(28px); }
        .wwm-btn:hover .wwm-btn-arrow svg:nth-child(2) { transform: translateX(0); }
        .wwm-btn:focus-visible { outline: 3px solid var(--c-navy); outline-offset: 3px; }

        /* ---------- Responsive ---------- */
        @media (min-width: 1440px) {
          .wwm-wrap { max-width: 1200px; }
          .wwm-grid { gap: 2.25rem; }
          .wwm-card { padding: 2rem; }
        }
        @media (max-width: 639px) {
          .wwm-grid { max-width: 560px; margin: 0 auto; }
        }
        @media (max-width: 560px) {
          .wwm-lead::before,
          .wwm-lead::after { flex: 0 0 18px; }
        }
        @media (max-width: 360px) {
          .wwm-lead::before,
          .wwm-lead::after { display: none; }
        }
        @media (hover: none) {
          .wwm-card:hover { transform: none; box-shadow: 0 10px 30px rgba(20, 39, 78, .06); }
          .wwm-card:hover .wwm-num { transform: none; }
          .wwm-btn:hover { transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wwm *, .wwm *::before, .wwm *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="wwm-wrap">
        <div className="wwm-head">
          <h2 className="wwm-title">
            Have an Idea, Project or <span>Collaboration in Mind?</span>
          </h2>
          <p className="wwm-sub">
            I am open to working with individuals, educational institutions, organisations,
            mental-health professionals and relevant brands on projects that align with my areas of work.
          </p>
        </div>

        <div className="wwm-lead">
          <h3>Collaboration Areas</h3>
        </div>

        <div className="wwm-grid">
          {areas.map((a, i) => (
            <div key={a.title} className={`wwm-card ${a.tone}`}>
              <span className="wwm-num" aria-hidden="true">{i + 1}</span>
              <h4>{a.title}</h4>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="wwm-cta">
          <p>If you have an idea you would like to discuss, I would love to hear about it.</p>
          <Link className="wwm-btn" to="/book">
            <span className="wwm-btn-text">Let's Work Together</span>
            <span className="wwm-btn-arrow">
              <ArrowIcon />
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}