import { Link } from "react-router-dom";
import { useSite } from "../useSite.js";

/* ---------- Your image paths ---------- */
const CARD_IMAGES = {
  career: "Psychology & Career Guidance.png",
  everyday: "Everyday Psychology.png",
};

/* ---------- Arrow icon (size is controlled by CSS) ---------- */
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

/* ---------- Image (placeholder if no src) ---------- */
function CardImage({ src, alt, label }) {
  if (src) {
    return <img src={src} alt={alt} className="intro-img" loading="lazy" />;
  }
  return (
    <div className="intro-placeholder" role="img" aria-label={`${label} placeholder`}>
      Add image: {label}
    </div>
  );
}

export default function Intro() {
  const SITE = useSite();

  return (
    <section id="intro" className="intro">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&display=swap");

        /* =========================================================
           THEME COLORS: change these hex values to match your site
           ========================================================= */
        .intro {
          --c-pink: #ff4d6d;
          --c-orange: #ff9f43;
          --c-purple: #8b6fe0;
          --c-blue: #4dabf7;
          --c-green: #2fb67c;
          --c-navy: #14274e;
          --c-navy-soft: #4a5a7a;
          --c-bg: #fffaf5;
          --c-line: #eadfd6;

          /* fluid button sizes: they grow smoothly from small phones to large screens */
          --btn-font: clamp(.78rem, 1.4vw + .55rem, .93rem);
          --btn-arrow: clamp(28px, 2vw + 20px, 38px);
          --btn-pad: clamp(.25rem, .5vw + .12rem, .45rem);
          --btn-pad-left: clamp(.9rem, 1.2vw + .6rem, 1.3rem);
          --btn-gap: clamp(.5rem, 1vw + .2rem, .9rem);
          --orb: clamp(44px, 4vw + 28px, 64px);

          background: var(--c-bg);
          color: var(--c-navy);
          padding: clamp(2.5rem, 8vw, 5.5rem) 0 clamp(3rem, 9vw, 6.5rem);
          overflow-x: hidden;
        }
        .intro *, .intro *::before, .intro *::after { box-sizing: border-box; }

        .intro-wrap {
          width: 100%;
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 4vw, 2rem);
        }

        /* ---------- Heading (centered) ---------- */
        .intro-head {
          max-width: 700px;
          margin: 0 auto clamp(1.75rem, 6vw, 3.5rem);
          text-align: center;
        }
        .intro-title {
          font-size: clamp(1.6rem, 6vw, 3.1rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0 0 clamp(1rem, 3vw, 1.5rem);
        }

        /* animated "Psychology" word */
        .intro-word {
          position: relative;
          display: inline-block;
          background: linear-gradient(
            100deg,
            var(--c-pink),
            var(--c-orange),
            var(--c-purple),
            var(--c-pink)
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation:
            introWordIn .9s cubic-bezier(.2, 1.3, .4, 1) both,
            introFlow 7s ease-in-out .9s infinite;
        }
        @keyframes introWordIn {
          from { opacity: 0; transform: translateY(14px) scale(.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes introFlow {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        .intro-text {
          color: var(--c-navy-soft);
          font-size: clamp(.88rem, 2.6vw, 1.08rem);
          line-height: 1.7;
          margin: 0 0 .85rem;
          overflow-wrap: anywhere;
        }
        .intro-text strong {
          color: var(--c-navy);
          font-weight: 700;
        }

        /* ---------- Lead line ("two key areas") ---------- */
        .intro-lead {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .5rem;
          margin-top: clamp(1.75rem, 6vw, 3rem);
        }
        .intro-lead-row {
          display: flex;
          align-items: center;
          gap: clamp(.75rem, 2.5vw, 1.25rem);
          width: 100%;
        }
        .intro-lead-row::before,
        .intro-lead-row::after {
          content: "";
          flex: 1;
          height: 2px;
          border-radius: 999px;
        }
        .intro-lead-row::before {
          background: linear-gradient(90deg, transparent, var(--c-pink), var(--c-orange));
        }
        .intro-lead-row::after {
          background: linear-gradient(90deg, var(--c-orange), var(--c-pink), transparent);
        }
        .intro-lead-title {
          margin: 0;
          font-family: "Playfair Display", Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(1.2rem, 4.2vw, 2rem);
          line-height: 1.3;
          letter-spacing: -0.005em;
          color: var(--c-navy);
          text-align: center;
          max-width: 24ch;
        }
        .intro-lead-title span {
          background: linear-gradient(100deg, var(--c-pink), var(--c-orange), var(--c-purple), var(--c-pink));
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: introFlow 7s ease-in-out infinite;
        }
        .intro-lead-arrow {
          width: clamp(20px, 4vw, 26px);
          height: clamp(20px, 4vw, 26px);
          color: var(--c-pink);
          animation: introBounce 1.8s ease-in-out infinite;
        }
        @keyframes introBounce {
          0%, 100% { transform: translateY(0); opacity: .6; }
          50%      { transform: translateY(6px); opacity: 1; }
        }

        /* ---------- Cards ---------- */
        .intro-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1.1rem, 3vw, 1.75rem);
        }
        @media (min-width: 768px) {
          .intro-grid { grid-template-columns: 1fr 1fr; }
        }

        .intro-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: clamp(16px, 2vw, 20px);
          background: #fff;
          border: 1px solid var(--c-line);
          box-shadow: 0 10px 30px rgba(20, 39, 78, .06);
          transition: transform .35s ease, box-shadow .35s ease;
        }
        .intro-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(20, 39, 78, .12);
        }
        .intro-card.career {
          --a1: var(--c-pink);
          --a2: var(--c-orange);
          --glow: 255, 77, 109;
          --tint: #fff1f3;
        }
        .intro-card.everyday {
          --a1: var(--c-green);
          --a2: var(--c-blue);
          --glow: 47, 182, 124;
          --tint: #ecf9f3;
        }

        .intro-media {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--tint);
        }
        .intro-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform .6s ease;
        }
        .intro-card:hover .intro-img { transform: scale(1.05); }
        .intro-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1rem;
          text-align: center;
          color: var(--c-navy-soft);
          font-size: .9rem;
        }

        /* tinted body gives the glass buttons something to blur */
        .intro-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: clamp(1.15rem, 3vw, 1.75rem) clamp(1.1rem, 3vw, 1.75rem) clamp(1.3rem, 3.5vw, 2rem);
          background: linear-gradient(180deg, #fff 0%, var(--tint) 100%);
        }
        .intro-card h3 {
          font-size: clamp(1.1rem, 2.2vw, 1.3rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.3;
          margin: 0 0 .6rem;
        }
        .intro-card p {
          color: var(--c-navy-soft);
          font-size: clamp(.88rem, 1.8vw, .97rem);
          line-height: 1.65;
          margin: 0 0 clamp(1.1rem, 3vw, 1.6rem);
          flex: 1;
        }

        /* ---------- Glass button ---------- */
        .intro-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          align-self: flex-start;        /* never stretches: stays only as wide as its content */
          max-width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--btn-gap);
          padding: var(--btn-pad) var(--btn-pad) var(--btn-pad) var(--btn-pad-left);
          border-radius: 999px;
          font-size: var(--btn-font);
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

        /* two colour orbs drifting slowly behind the glass */
        .intro-btn::before,
        .intro-btn::after {
          content: "";
          position: absolute;
          z-index: -1;
          width: var(--orb);
          height: var(--orb);
          border-radius: 50%;
          filter: blur(12px);
          opacity: .75;
          transition: scale .8s cubic-bezier(.22, 1, .36, 1), opacity .4s ease;
        }
        .intro-btn::before {
          background: var(--a1);
          left: 6%;
          top: -25%;
          animation: introOrbA 8s ease-in-out infinite;
        }
        .intro-btn::after {
          background: var(--a2);
          right: 12%;
          bottom: -35%;
          animation: introOrbB 9s ease-in-out infinite;
        }
        @keyframes introOrbA {
          0%, 100% { translate: 0 0; }
          50%      { translate: 100px 10px; }
        }
        @keyframes introOrbB {
          0%, 100% { translate: 0 0; }
          50%      { translate: -90px -8px; }
        }

        .intro-btn-text {
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        /* glass arrow bubble */
        .intro-btn-arrow {
          position: relative;
          z-index: 1;
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--btn-arrow);
          height: var(--btn-arrow);
          border-radius: 50%;
          overflow: hidden;
          color: var(--a1);
          background: rgba(255, 255, 255, .65);
          border: 1.5px solid rgba(255, 255, 255, .95);
          box-shadow: 0 4px 10px rgba(var(--glow), .25), inset 0 1px 0 #fff;
          transition: transform .45s cubic-bezier(.22, 1, .36, 1);
        }
        /* old arrow slides out right, a new one slides in from left */
        .intro-btn-arrow svg {
          position: absolute;
          width: clamp(13px, .6vw + 10px, 16px);
          height: clamp(13px, .6vw + 10px, 16px);
          transition: transform .45s cubic-bezier(.22, 1, .36, 1);
        }
        .intro-btn-arrow svg:nth-child(2) { transform: translateX(-28px); }

        .intro-btn:hover {
          transform: translateY(-3px);
          color: #fff;
          box-shadow:
            0 16px 32px rgba(var(--glow), .38),
            inset 0 1.5px 0 rgba(255, 255, 255, .95),
            inset 0 -8px 16px rgba(255, 255, 255, .15);
        }
        .intro-btn:hover::before,
        .intro-btn:hover::after { scale: 5.5; opacity: .95; }
        .intro-btn:hover .intro-btn-text { text-shadow: 0 1px 6px rgba(20, 39, 78, .3); }
        .intro-btn:hover .intro-btn-arrow { transform: scale(1.08); }
        .intro-btn:hover .intro-btn-arrow svg:nth-child(1) { transform: translateX(28px); }
        .intro-btn:hover .intro-btn-arrow svg:nth-child(2) { transform: translateX(0); }
        .intro-btn:focus-visible {
          outline: 3px solid var(--c-navy);
          outline-offset: 3px;
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */

        /* Large desktops / TVs */
        @media (min-width: 1440px) {
          .intro-wrap { max-width: 1200px; }
          .intro-head { max-width: 780px; }
          .intro-grid { gap: 2.25rem; }
          .intro-body { padding: 2rem 2rem 2.25rem; }
          .intro-card h3 { font-size: 1.45rem; }
          .intro-card p { font-size: 1.03rem; }
        }

        /* Tablets portrait: single column, centred, not stretched edge to edge */
        @media (max-width: 767px) {
          .intro-grid {
            max-width: 560px;
            margin: 0 auto;
          }
          .intro-media { aspect-ratio: 16 / 10; }
        }

        /* Small tablets in two columns: tighter card body so text and button fit */
        @media (min-width: 768px) and (max-width: 900px) {
          .intro-body { padding: 1.25rem 1.1rem 1.4rem; }
        }

        /* Phones: the lines beside the lead text become short accents */
        @media (max-width: 560px) {
          .intro-lead-row { justify-content: center; }
          .intro-lead-row::before,
          .intro-lead-row::after { flex: 0 0 18px; }
        }

        /* Very small phones */
        @media (max-width: 360px) {
          .intro-lead-row::before,
          .intro-lead-row::after { display: none; }
          .intro-btn { padding-left: .85rem; }
        }

        /* Touch devices: no sticky hover lift on cards */
        @media (hover: none) {
          .intro-card:hover { transform: none; box-shadow: 0 10px 30px rgba(20, 39, 78, .06); }
          .intro-card:hover .intro-img { transform: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro *, .intro *::before, .intro *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="intro-wrap">
        <div className="intro-head">
          <h2 className="intro-title">
            <span className="intro-word">Psychology</span> is more than a subject
          </h2>

          <p className="intro-text">
            Psychology isn't limited to textbooks, degrees or therapy rooms.
          </p>
          <p className="intro-text">
            It influences the way we learn, make decisions, choose careers, build relationships,
            communicate with one another and understand ourselves.
          </p>
          <p className="intro-text">
            Through my YouTube channel <strong>{SITE.youtubeName}</strong>
            {SITE.instagramHandle ? (
              <>
                {" "}
                and my Instagram (<strong>{SITE.instagramHandle}</strong>)
              </>
            ) : null}
            , I explore psychology from professional and everyday perspectives, making information
            practical, understandable and relevant to real life.
          </p>
          <div className="intro-lead">
            <div className="intro-lead-row">
              <p className="intro-lead-title">
                My content currently brings together <span>two key areas.</span>
              </p>
            </div>
            <svg
              className="intro-lead-arrow"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="intro-grid">
          {/* ---------- Career Guidance ---------- */}
          <article className="intro-card career">
            <div className="intro-media">
              <CardImage
                src={CARD_IMAGES.career}
                alt="Psychology and career guidance"
                label="Career Guidance"
              />
            </div>
            <div className="intro-body">
              <h3>Psychology &amp; Career Guidance</h3>
              <p>
                Helping psychology students and aspiring professionals understand their
                specialization options, multiple earning potential, develop relevant skills and make
                informed decisions about their career journey.
              </p>
              <Link className="intro-btn" to="/content#youtube">
                <span className="intro-btn-text">Explore Career Guidance</span>
                <span className="intro-btn-arrow">
                  <ArrowIcon />
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          </article>

          {/* ---------- Everyday Psychology ---------- */}
          <article className="intro-card everyday">
            <div className="intro-media">
              <CardImage
                src={CARD_IMAGES.everyday}
                alt="Everyday psychology"
                label="Everyday Psychology"
              />
            </div>
            <div className="intro-body">
              <h3>Everyday Psychology</h3>
              <p>
                Exploring parenting, relationships, generational differences and the psychological
                patterns we come across in everyday life.
              </p>
              <Link className="intro-btn" to="/content#instagram">
                <span className="intro-btn-text">Explore Everyday Psychology</span>
                <span className="intro-btn-arrow">
                  <ArrowIcon />
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}