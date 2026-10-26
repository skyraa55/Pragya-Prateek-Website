import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSite } from "../useSite.js";

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

export default function ContentSection() {
  const SITE = useSite();
  const { hash } = useLocation();

  // Which part to show: #instagram -> Instagram, anything else -> YouTube
  const active = hash === "#instagram" ? "instagram" : "youtube";

  // Scroll to the section whenever a button in Intro (or a tab here) changes the hash
  useEffect(() => {
    if (hash) {
      const el = document.getElementById("content");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <section className="cs" id="content">
      <style>{`
        .cs {
          --c-pink: #ff4d6d;
          --c-orange: #ff9f43;
          --c-purple: #8b6fe0;
          --c-blue: #4dabf7;
          --c-green: #2fb67c;
          --c-navy: #14274e;
          --c-navy-soft: #4a5a7a;
          --c-bg: #fffaf5;
          --c-line: #eadfd6;

          background: var(--c-bg);
          color: var(--c-navy);
          padding: clamp(2.5rem, 8vw, 5.5rem) 0 clamp(3rem, 9vw, 6.5rem);
          overflow-x: hidden;
          scroll-margin-top: 80px;
        }
        .cs *, .cs *::before, .cs *::after { box-sizing: border-box; }

        .cs-wrap {
          width: 100%;
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 4vw, 2rem);
        }

        /* ---------- Heading ---------- */
        .cs-head {
          max-width: 640px;
          margin: 0 auto clamp(1.5rem, 5vw, 2.5rem);
          text-align: center;
        }
        .cs-eyebrow {
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
        .cs-title {
          font-size: clamp(1.6rem, 6vw, 3rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .cs-title span {
          background: linear-gradient(100deg, var(--c-pink), var(--c-orange), var(--c-purple), var(--c-pink));
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: csFlow 7s ease-in-out infinite;
        }
        @keyframes csFlow {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        /* ---------- Tab switcher ---------- */
        .cs-tabs {
          display: flex;
          width: fit-content;
          max-width: 100%;
          margin: 0 auto clamp(1.25rem, 4vw, 2rem);
          padding: .3rem;
          gap: .3rem;
          border-radius: 999px;
          background: #fff;
          border: 1px solid var(--c-line);
          box-shadow: 0 8px 24px rgba(20, 39, 78, .06);
        }
        .cs-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          padding: .6rem clamp(.85rem, 3vw, 1.5rem);
          border-radius: 999px;
          font-size: clamp(.8rem, 1.4vw + .5rem, .95rem);
          font-weight: 700;
          color: var(--c-navy-soft);
          text-decoration: none;
          white-space: nowrap;
          transition: color .3s ease, background .3s ease, box-shadow .3s ease, transform .3s ease;
        }
        .cs-tab:hover { color: var(--c-navy); }
        .cs-tab.is-active {
          color: #fff;
          box-shadow: 0 8px 18px rgba(var(--glow), .35);
        }
        .cs-tab.yt { --glow: 255, 77, 109; }
        .cs-tab.ig { --glow: 47, 182, 124; }
        .cs-tab.yt.is-active { background: linear-gradient(100deg, var(--c-pink), var(--c-orange)); }
        .cs-tab.ig.is-active { background: linear-gradient(100deg, var(--c-green), var(--c-blue)); }
        .cs-tab:focus-visible { outline: 3px solid var(--c-navy); outline-offset: 2px; }

        /* ---------- Panel card ---------- */
        .cs-panel {
          display: grid;
          grid-template-columns: 1fr;
          overflow: hidden;
          border-radius: clamp(16px, 2vw, 22px);
          background: #fff;
          border: 1px solid var(--c-line);
          box-shadow: 0 10px 30px rgba(20, 39, 78, .06);
          animation: csIn .55s cubic-bezier(.22, 1, .36, 1) both;
        }
        @keyframes csIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 820px) {
          .cs-panel { grid-template-columns: 0.85fr 1.15fr; }
        }
        .cs-panel.yt {
          --a1: var(--c-pink);
          --a2: var(--c-orange);
          --glow: 255, 77, 109;
          --tint: #fff1f3;
        }
        .cs-panel.ig {
          --a1: var(--c-green);
          --a2: var(--c-blue);
          --glow: 47, 182, 124;
          --tint: #ecf9f3;
        }

        /* left visual */
        .cs-visual {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          min-height: clamp(180px, 34vw, 260px);
          padding: 2rem 1.25rem;
          text-align: center;
          color: #fff;
          background: linear-gradient(135deg, var(--a1), var(--a2));
        }
        .cs-visual::before,
        .cs-visual::after {
          content: "";
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          background: rgba(255, 255, 255, .22);
          filter: blur(6px);
        }
        .cs-visual::before { width: 220px; height: 220px; top: -70px; left: -60px; animation: csDrift 9s ease-in-out infinite; }
        .cs-visual::after  { width: 180px; height: 180px; bottom: -60px; right: -40px; animation: csDrift 11s ease-in-out infinite reverse; }
        @keyframes csDrift {
          0%, 100% { translate: 0 0; }
          50%      { translate: 24px 18px; }
        }
        .cs-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(64px, 9vw, 84px);
          height: clamp(64px, 9vw, 84px);
          border-radius: 50%;
          font-size: clamp(1.7rem, 4vw, 2.2rem);
          background: rgba(255, 255, 255, .25);
          border: 1.5px solid rgba(255, 255, 255, .85);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 24px rgba(20, 39, 78, .18), inset 0 1.5px 0 rgba(255, 255, 255, .9);
        }
        .cs-platform {
          margin: 0;
          font-family: "Playfair Display", Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          line-height: 1.3;
          overflow-wrap: anywhere;
        }

        /* right content */
        .cs-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(1.25rem, 4vw, 2.5rem);
          background: linear-gradient(180deg, #fff 0%, var(--tint) 100%);
        }
        .cs-body h3 {
          font-size: clamp(1.15rem, 2.4vw, 1.5rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.3;
          margin: 0 0 .6rem;
          overflow-wrap: anywhere;
        }
        .cs-tagline {
          margin: 0 0 1rem;
          font-weight: 700;
          font-size: clamp(.92rem, 1.8vw, 1.02rem);
          color: var(--a1);
        }
        .cs-body p.cs-text {
          margin: 0 0 .85rem;
          color: var(--c-navy-soft);
          font-size: clamp(.88rem, 1.8vw, .98rem);
          line-height: 1.7;
        }
        .cs-chips {
          display: flex;
          flex-wrap: wrap;
          gap: .5rem;
          margin: .4rem 0 clamp(1.1rem, 3vw, 1.6rem);
        }
        .cs-chip {
          padding: .35rem .85rem;
          border-radius: 999px;
          font-size: .8rem;
          font-weight: 700;
          color: var(--c-navy);
          background: #fff;
          border: 1px solid var(--c-line);
          box-shadow: 0 2px 6px rgba(20, 39, 78, .05);
        }
        .cs-chip::before {
          content: "";
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-right: .45rem;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--a1), var(--a2));
        }

        /* ---------- Glass button (same style as Intro) ---------- */
        .cs-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          align-self: flex-start;
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
        .cs-btn::before,
        .cs-btn::after {
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
        .cs-btn::before { background: var(--a1); left: 6%; top: -25%; animation: csOrbA 8s ease-in-out infinite; }
        .cs-btn::after  { background: var(--a2); right: 12%; bottom: -35%; animation: csOrbB 9s ease-in-out infinite; }
        @keyframes csOrbA { 0%, 100% { translate: 0 0; } 50% { translate: 100px 10px; } }
        @keyframes csOrbB { 0%, 100% { translate: 0 0; } 50% { translate: -90px -8px; } }

        .cs-btn-text { position: relative; z-index: 1; min-width: 0; }
        .cs-btn-arrow {
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
        .cs-btn-arrow svg {
          position: absolute;
          width: clamp(13px, .6vw + 10px, 16px);
          height: clamp(13px, .6vw + 10px, 16px);
          transition: transform .45s cubic-bezier(.22, 1, .36, 1);
        }
        .cs-btn-arrow svg:nth-child(2) { transform: translateX(-28px); }
        .cs-btn:hover {
          transform: translateY(-3px);
          color: #fff;
          box-shadow:
            0 16px 32px rgba(var(--glow), .38),
            inset 0 1.5px 0 rgba(255, 255, 255, .95),
            inset 0 -8px 16px rgba(255, 255, 255, .15);
        }
        .cs-btn:hover::before,
        .cs-btn:hover::after { scale: 5.5; opacity: .95; }
        .cs-btn:hover .cs-btn-text { text-shadow: 0 1px 6px rgba(20, 39, 78, .3); }
        .cs-btn:hover .cs-btn-arrow { transform: scale(1.08); }
        .cs-btn:hover .cs-btn-arrow svg:nth-child(1) { transform: translateX(28px); }
        .cs-btn:hover .cs-btn-arrow svg:nth-child(2) { transform: translateX(0); }
        .cs-btn:focus-visible { outline: 3px solid var(--c-navy); outline-offset: 3px; }

        /* ---------- Responsive ---------- */
        @media (min-width: 1440px) {
          .cs-wrap { max-width: 1200px; }
          .cs-body { padding: 3rem; }
        }
        @media (max-width: 420px) {
          .cs-tab { padding: .55rem .8rem; }
        }
        @media (hover: none) {
          .cs-btn:hover { transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs *, .cs *::before, .cs *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="cs-wrap">
        <div className="cs-head">
          <span className="cs-eyebrow">Content</span>
          <h2 className="cs-title">
            Find Me <span>Online</span>
          </h2>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className="cs-tabs" role="tablist" aria-label="Choose a platform">
          <Link
            to={{ hash: "#youtube" }}
            replace
            role="tab"
            aria-selected={active === "youtube"}
            className={`cs-tab yt${active === "youtube" ? " is-active" : ""}`}
          >
            <span aria-hidden="true">▶</span> Career Guidance
          </Link>
          <Link
            to={{ hash: "#instagram" }}
            replace
            role="tab"
            aria-selected={active === "instagram"}
            className={`cs-tab ig${active === "instagram" ? " is-active" : ""}`}
          >
            <span aria-hidden="true">◎</span> Everyday Psychology
          </Link>
        </div>

        {/* ---------- YouTube part ---------- */}
        {active === "youtube" && (
          <div className="cs-panel yt" id="youtube" key="youtube" role="tabpanel">
            <div className="cs-visual">
              <span className="cs-badge" aria-hidden="true">▶</span>
              <p className="cs-platform">YouTube</p>
            </div>
            <div className="cs-body">
              <h3>YouTube — {SITE.youtubeName}</h3>
              <p className="cs-tagline">
                A dedicated space for psychology students and aspiring psychology professionals.
              </p>
              <p className="cs-text">
                On YouTube, I cover psychology career options, education pathways, emerging fields,
                professional skills, earning ideas and practical career guidance.
              </p>
              <div className="cs-chips">
                <span className="cs-chip">Career options</span>
                <span className="cs-chip">Education pathways</span>
                <span className="cs-chip">Emerging fields</span>
                <span className="cs-chip">Professional skills</span>
                <span className="cs-chip">Earning ideas</span>
              </div>
              <a className="cs-btn" href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <span className="cs-btn-text">Watch on YouTube</span>
                <span className="cs-btn-arrow">
                  <ArrowIcon />
                  <ArrowIcon />
                </span>
              </a>
            </div>
          </div>
        )}

        {/* ---------- Instagram part ---------- */}
        {active === "instagram" && (
          <div className="cs-panel ig" id="instagram" key="instagram" role="tabpanel">
            <div className="cs-visual">
              <span className="cs-badge" aria-hidden="true">◎</span>
              <p className="cs-platform">Instagram</p>
            </div>
            <div className="cs-body">
              <h3>Instagram{SITE.instagramHandle ? ` — ${SITE.instagramHandle}` : ""}</h3>
              <p className="cs-tagline">A more everyday side of psychology.</p>
              <p className="cs-text">
                On Instagram, I explore parenting, relationships, generational differences and the
                psychological patterns we observe in everyday life.
              </p>
              <p className="cs-text">
                The goal isn't to turn every experience into a diagnosis but to encourage curiosity,
                reflection and a better understanding of human behaviour.
              </p>
              <div className="cs-chips">
                <span className="cs-chip">Parenting</span>
                <span className="cs-chip">Relationships</span>
                <span className="cs-chip">Generational differences</span>
                <span className="cs-chip">Everyday patterns</span>
              </div>
              {SITE.instagramUrl && (
                <a className="cs-btn" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <span className="cs-btn-text">Follow on Instagram</span>
                  <span className="cs-btn-arrow">
                    <ArrowIcon />
                    <ArrowIcon />
                  </span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}