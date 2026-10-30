import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  CONTENT (from client)                                              */
/* ------------------------------------------------------------------ */

const PHOTOS = [
  "/workshops/one.jpeg",
  "/workshops/two.JPG",
  "/workshops/three.JPG",
  "/workshops/four.JPG",
  "/workshops/five.JPG",
];

const THEMES = [
  {
    tone: "green",
    title: "Student Well-being & Personal Development",
    text: "Exam stress, emotional well-being, self-awareness, confidence and social skills.",
  },
  {
    tone: "pink",
    title: "Parenting & Parent–Teen Relationships",
    text: "Understanding teenage behaviour, parent-child communication, screen habits and building trust.",
  },
  {
    tone: "blue",
    title: "Workplace Well-being",
    text: "Stress management, work-life balance, emotional well-being and healthier workplace relationships.",
  },
  {
    tone: "purple",
    title: "Expressive Arts & Mindful Reflection",
    text: "Guided writing, creative expression and mindfulness-based activities for reflection and self-awareness.",
  },
];

const AUDIENCES = [
  "Educational institutions",
  "Student groups",
  "Organisations",
  "Communities",
  "Professional groups",
  "Other relevant audiences",
];

const SAMPLE_META = [
  { label: "Target audience", value: "School & college students" },
  { label: "Duration", value: "90 minutes" },
  { label: "Format", value: "Interactive group workshop" },
  { label: "Approach", value: "Psychoeducation, reflection & activities" },
];

const OBJECTIVES = [
  "Identify common sources and signs of exam-related stress.",
  "Recognise how thoughts, emotions, physical responses and behaviours can influence one another.",
  "Distinguish between factors within their control and those outside it.",
  "Practise simple techniques for managing moments of pressure.",
  "Develop a personalised plan for responding to exam stress.",
];

const SESSION_TONES = ["pink", "orange", "purple", "blue", "green", "pink"];

const SESSIONS = [
  {
    title: "Opening & Engagement",
    minutes: 10,
    purpose: "Create a comfortable, participatory environment.",
    activity: "“What Does Exam Stress Look Like?”",
    description:
      "The facilitator invites students to reflect on how they typically respond when exams approach. Responses might include overthinking, procrastination, irritability, disrupted sleep or studying for long hours without feeling prepared.",
    prompts: [
      "What changes for you when an exam is approaching?",
      "How do you usually know that you’re feeling stressed?",
    ],
    outcome:
      "Students begin recognising that stress can show up differently for different people.",
  },
  {
    title: "Understanding Stress",
    minutes: 15,
    purpose: "Connect psychological concepts with familiar situations.",
    activity: "The Exam-Stress Cycle",
    description:
      "The facilitator presents a relatable example: a student sees a difficult chapter, thinks “I’ll never finish the syllabus,” feels anxious and avoids studying. As time passes, the unfinished work creates even more anxiety. Participants identify the thought, emotion and behaviour in the example, then consider how the cycle might be interrupted.",
    prompts: [
      "Does every stressful thought accurately reflect the situation?",
      "How might avoidance affect stress in the longer term?",
    ],
    outcome:
      "Students understand how interpretations and behaviours can contribute to maintaining stress.",
  },
  {
    title: "Recognising Personal Stress Patterns",
    minutes: 15,
    purpose: "Encourage self-awareness without forcing personal disclosure.",
    activity: "My Stress Signals",
    description:
      "Students complete a reflection worksheet with four areas. They then identify one early warning sign they would like to notice sooner.",
    list: [
      "Thoughts: What do I tell myself when I feel under pressure?",
      "Emotions: What feelings do I notice?",
      "Physical signals: What changes do I notice in my body?",
      "Behaviours: What do I tend to do next?",
    ],
    outcome: "Each participant develops a clearer picture of their own stress responses.",
  },
  {
    title: "The Control & Influence Exercise",
    minutes: 15,
    purpose: "Redirect attention towards practical, manageable actions.",
    activity: "Within My Control / Outside My Control",
    description:
      "Students sort common exam-related concerns into two categories. Examples include the time available before an exam, their preparation routine, the difficulty of a particular question, other students’ marks and the expectations of others. The facilitator then helps students identify where they can take action, seek support or adjust their response.",
    outcome:
      "Students identify manageable next steps instead of spending all their energy worrying about uncertain outcomes.",
  },
  {
    title: "Practising Practical Strategies",
    minutes: 20,
    purpose: "Give students strategies they can practise beyond the session.",
    activity: "Try, Reflect & Adapt",
    description: "The facilitator introduces three practical approaches:",
    list: [
      "Grounding and paced breathing: a brief, guided exercise to help students pause and redirect their attention when they feel overwhelmed.",
      "Realistic study planning: students take a broad task, such as “complete the syllabus,” and break it into smaller, specific and manageable actions.",
      "Responding to unhelpful self-talk: students practise replacing absolute statements such as “I always fail” with more balanced, realistic statements such as “I’m struggling with this topic, so I’ll identify what I need to revise first.”",
    ],
    outcome: "Students practise strategies rather than merely hearing about them.",
  },
  {
    title: "Personal Action Plan & Closing",
    minutes: 15,
    purpose: "Translate learning into action.",
    activity: "My Exam-Stress Action Plan",
    description: "Each student completes a short plan:",
    list: [
      "One stress signal I want to recognise.",
      "One strategy I will try when I feel overwhelmed.",
      "One realistic study action I can take.",
      "One person I can approach if I need support.",
    ],
    after:
      "The facilitator closes with a recap and invites voluntary reflections on one useful takeaway.",
    outcome: "Every participant leaves with a practical, individualised next step.",
  },
];

const DELIVERABLES = [
  { title: "Facilitator guide", text: "Session objectives, timings, instructions and transition notes." },
  { title: "Presentation outline", text: "Suggested slide sequence and key teaching points." },
  { title: "Participant worksheets", text: "Stress signals, the exam-stress cycle and the personal action plan." },
  { title: "Activity instructions", text: "Materials, steps, reflection prompts and debrief questions." },
  { title: "Learning-outcome alignment", text: "A clear connection between the workshop objectives, activities and intended outcomes." },
  { title: "Feedback form", text: "Brief questions to gather participants’ feedback and identify areas for improvement." },
];

const NAV = [
  { href: "#gallery", label: "Gallery" },
  { href: "#themes", label: "Themes" },
  { href: "#sample", label: "Sample workshop" },
  { href: "#flow", label: "Workshop flow" },
  { href: "#materials", label: "Materials" },
];

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

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

/* Same glass button as the Intro section */
function GlassLink({ to, tone = "pink", children }) {
  return (
    <Link className={`ws-btn tone-${tone}`} to={to}>
      <span className="ws-btn-text">{children}</span>
      <span className="ws-btn-arrow">
        <ArrowIcon />
        <ArrowIcon />
      </span>
    </Link>
  );
}

function SectionHead({ id, title, sub }) {
  return (
    <header className="ws-sec-head">
      <h2 id={id} className="ws-h2">{title}</h2>
      {sub && <p className="ws-text">{sub}</p>}
    </header>
  );
}

function Session({ s, index, tone, defaultOpen }) {
  return (
    <details open={defaultOpen} className={`ws-session tone-${tone}`}>
      <summary>
        <span className="ws-session-num">{index + 1}</span>
        <span className="ws-session-main">
          <span className="ws-session-title">{s.title}</span>
          <span className="ws-session-activity">{s.activity}</span>
        </span>
        <span className="ws-chip ws-chip-time">{s.minutes} min</span>
        <span className="ws-session-chev" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </summary>

      <div className="ws-session-body">
        <p>
          <strong>Purpose: </strong>
          {s.purpose}
        </p>

        <p>{s.description}</p>

        {s.list && (
          <ul className="ws-bullets">
            {s.list.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}

        {s.after && <p>{s.after}</p>}

        {s.prompts && (
          <div>
            <p className="ws-mini-title">Facilitator prompts</p>
            <ul className="ws-bullets">
              {s.prompts.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        )}

        <p className="ws-outcome">
          <strong>Expected outcome: </strong>
          {s.outcome}
        </p>
      </div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Workshops() {
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});

  useEffect(() => {
    document.title = "Workshops & Programs — Pragya Prateek";
  }, []);

  // keep the viewer in sync with whatever the lightbox is showing
  useEffect(() => {
    if (lightbox !== null) setActive(lightbox);
  }, [lightbox]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % PHOTOS.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const go = (dir) => setActive((i) => (i + dir + PHOTOS.length) % PHOTOS.length);

  const totalMinutes = SESSIONS.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <section className="ws">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&display=swap");

        /* =========================================================
           THEME COLORS (same as the Intro section)
           ========================================================= */
        .ws {
          --c-pink: #ff4d6d;
          --c-orange: #ff9f43;
          --c-purple: #8b6fe0;
          --c-blue: #4dabf7;
          --c-green: #2fb67c;
          --c-navy: #14274e;
          --c-navy-soft: #4a5a7a;
          --c-bg: #fffaf5;
          --c-line: #eadfd6;

          --btn-font: clamp(.78rem, 1.4vw + .55rem, .93rem);
          --btn-arrow: clamp(28px, 2vw + 20px, 38px);
          --btn-pad: clamp(.25rem, .5vw + .12rem, .45rem);
          --btn-pad-left: clamp(.9rem, 1.2vw + .6rem, 1.3rem);
          --btn-gap: clamp(.5rem, 1vw + .2rem, .9rem);
          --orb: clamp(44px, 4vw + 28px, 64px);

          background: var(--c-bg);
          color: var(--c-navy);
          padding: clamp(2rem, 6vw, 4rem) 0 clamp(3rem, 9vw, 6rem);
          overflow-x: hidden;
          min-height: 70vh;
        }
        .ws *, .ws *::before, .ws *::after { box-sizing: border-box; }

        .tone-pink   { --a1: var(--c-pink);   --a2: var(--c-orange); --glow: 255, 77, 109;  --tint: #fff1f3; }
        .tone-orange { --a1: var(--c-orange); --a2: var(--c-pink);   --glow: 255, 159, 67;  --tint: #fff4e8; }
        .tone-purple { --a1: var(--c-purple); --a2: var(--c-pink);   --glow: 139, 111, 224; --tint: #f3effd; }
        .tone-blue   { --a1: var(--c-blue);   --a2: var(--c-purple); --glow: 77, 171, 247;  --tint: #eaf5fe; }
        .tone-green  { --a1: var(--c-green);  --a2: var(--c-blue);   --glow: 47, 182, 124;  --tint: #ecf9f3; }

        .ws-wrap {
          width: 100%;
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 4vw, 2rem);
        }

        .ws-back {
          display: inline-block;
          font-weight: 700;
          font-size: .9rem;
          color: var(--c-navy-soft);
          text-decoration: none;
          transition: color .25s ease;
        }
        .ws-back:hover { color: var(--c-pink); }
        .ws-back:focus-visible { outline: 3px solid var(--c-navy); outline-offset: 3px; border-radius: 6px; }

        /* ---------- Text ---------- */
        .ws-text {
          color: var(--c-navy-soft);
          font-size: clamp(.9rem, 2.6vw, 1.05rem);
          line-height: 1.7;
          margin: 0 0 .85rem;
          overflow-wrap: anywhere;
        }
        .ws-word {
          display: inline-block;
          background: linear-gradient(100deg, var(--c-pink), var(--c-orange), var(--c-purple), var(--c-pink));
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: wsFlow 7s ease-in-out infinite;
        }
        @keyframes wsFlow {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        /* ---------- Hero ---------- */
        .ws-hero {
          max-width: 720px;
          margin: clamp(1.5rem, 5vw, 2.5rem) auto clamp(1.5rem, 4vw, 2.25rem);
          text-align: center;
        }
        .ws-title {
          font-size: clamp(1.8rem, 6vw, 3.1rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0 0 clamp(1rem, 3vw, 1.5rem);
        }

        /* quick links to jump around the page */
        .ws-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: .6rem;
          margin-bottom: clamp(2.5rem, 7vw, 4rem);
        }
        .ws-nav a {
          padding: .5rem 1rem;
          border-radius: 999px;
          font-size: .88rem;
          font-weight: 700;
          color: var(--c-navy);
          text-decoration: none;
          background: rgba(255, 255, 255, .8);
          border: 1.5px solid var(--c-line);
          transition: border-color .25s ease, color .25s ease;
        }
        .ws-nav a:hover { color: var(--c-pink); border-color: var(--c-pink); }
        .ws-nav a:focus-visible { outline: 3px solid var(--c-navy); outline-offset: 3px; }

        /* ---------- Section ---------- */
        .ws-block {
          margin-bottom: clamp(3.5rem, 9vw, 6rem);
          scroll-margin-top: 1.5rem;
        }
        .ws-sec-head {
          max-width: 640px;
          margin: 0 auto clamp(1.5rem, 4vw, 2.25rem);
          text-align: center;
          scroll-margin-top: 1.5rem;
        }
        .ws-h2 {
          font-size: clamp(1.5rem, 4.4vw, 2.3rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.015em;
          margin: 0 0 .7rem;
        }
        .ws-sec-head .ws-text { margin-bottom: 0; }

        /* ---------- Cards ---------- */
        .ws-card {
          background: #fff;
          border: 1px solid var(--c-line);
          border-radius: clamp(16px, 2vw, 20px);
          box-shadow: 0 10px 30px rgba(20, 39, 78, .06);
          padding: clamp(1.25rem, 3vw, 1.85rem);
        }
        .ws-card-tint { background: linear-gradient(180deg, #fff 0%, var(--tint) 100%); }
        .ws-card h3 {
          font-size: clamp(1.05rem, 2.2vw, 1.25rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.3;
          margin: 0 0 .6rem;
        }
        .ws-card p {
          color: var(--c-navy-soft);
          font-size: clamp(.9rem, 1.8vw, .97rem);
          line-height: 1.7;
          margin: 0 0 .8rem;
        }
        .ws-card p:last-child { margin-bottom: 0; }

        .ws-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1.1rem, 3vw, 1.75rem);
        }
        @media (min-width: 768px) {
          .ws-grid-2 { grid-template-columns: 1fr 1fr; }
        }

        /* ---------- Gallery (viewer + thumbnails) ---------- */
        .ws-stage {
          position: relative;
          padding: clamp(.6rem, 2vw, 1rem);
          background: linear-gradient(180deg, #fff 0%, var(--c-bg) 100%);
          border: 1px solid var(--c-line);
          border-radius: clamp(18px, 2.5vw, 26px);
          box-shadow: 0 14px 40px rgba(20, 39, 78, .08);
        }
        .ws-stage-main {
          display: grid;
          place-items: center;
          width: 100%;
          height: clamp(260px, 62vw, 600px);
          padding: 0;
          border: 0;
          border-radius: clamp(12px, 2vw, 18px);
          background: #fff4ec;
          cursor: zoom-in;
          overflow: hidden;
        }
        .ws-stage-main img {
          width: 100%;
          height: 100%;
          object-fit: contain;   /* the whole collage always stays visible */
          display: block;
          animation: wsFade .4s ease;
        }
        @keyframes wsFade { from { opacity: 0; } to { opacity: 1; } }
        .ws-stage-main:focus-visible { outline: 3px solid var(--c-navy); outline-offset: 3px; }
        .ws-stage-missing {
          cursor: default;
          color: var(--c-navy-soft);
          font-size: .95rem;
        }

        .ws-stage-btn {
          position: absolute;
          top: 50%;
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          margin-top: -21px;
          border: 1.5px solid rgba(255, 255, 255, .95);
          border-radius: 50%;
          background: rgba(255, 255, 255, .85);
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          color: var(--c-navy);
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(20, 39, 78, .18);
          transition: transform .3s ease, color .3s ease;
        }
        .ws-stage-btn:hover { transform: scale(1.08); color: var(--c-pink); }
        .ws-stage-btn:focus-visible { outline: 3px solid var(--c-navy); outline-offset: 3px; }
        .ws-stage-prev { left: clamp(1rem, 3vw, 1.6rem); }
        .ws-stage-next { right: clamp(1rem, 3vw, 1.6rem); }
        .ws-stage-count {
          position: absolute;
          right: clamp(1rem, 3vw, 1.6rem);
          bottom: clamp(1rem, 3vw, 1.6rem);
          padding: .25rem .7rem;
          border-radius: 999px;
          font-size: .78rem;
          font-weight: 700;
          color: var(--c-navy);
          background: rgba(255, 255, 255, .9);
          box-shadow: 0 4px 10px rgba(20, 39, 78, .15);
        }

        .ws-thumbs {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: clamp(.4rem, 1.5vw, .8rem);
          margin-top: clamp(.7rem, 2vw, 1rem);
        }
        .ws-thumb {
          padding: 0;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          border: 2px solid transparent;
          border-radius: clamp(10px, 1.5vw, 14px);
          background: #fff4ec;
          box-shadow: 0 6px 16px rgba(20, 39, 78, .08);
          cursor: pointer;
          opacity: .6;
          transition: opacity .3s ease, border-color .3s ease, transform .3s ease;
        }
        .ws-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .ws-thumb:hover { opacity: 1; transform: translateY(-2px); }
        .ws-thumb.is-active { opacity: 1; border-color: var(--c-pink); }
        .ws-thumb:focus-visible { outline: 3px solid var(--c-navy); outline-offset: 2px; }

        @media (max-width: 560px) {
          .ws-stage-btn { width: 36px; height: 36px; margin-top: -18px; font-size: 1.25rem; }
        }

        /* ---------- Themes ---------- */
        .ws-note {
          color: var(--c-navy-soft);
          font-size: clamp(.9rem, 1.8vw, .97rem);
          line-height: 1.7;
          max-width: 68ch;
          margin: clamp(1.25rem, 3vw, 1.75rem) auto 0;
          text-align: center;
        }
        .ws-audience {
          margin-top: clamp(1.5rem, 4vw, 2.25rem);
          text-align: center;
        }
        .ws-audience p {
          margin: 0 0 .9rem;
          font-weight: 700;
        }
        .ws-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: .6rem;
        }
        .ws-chip {
          display: inline-block;
          padding: .4rem .9rem;
          border-radius: 999px;
          font-size: .85rem;
          font-weight: 700;
          color: var(--c-navy);
          background: #fff;
          border: 1.5px solid var(--c-line);
        }

        /* ---------- Sample workshop ---------- */
        .ws-sample {
          border-radius: clamp(18px, 2.5vw, 26px);
          border: 1px solid var(--c-line);
          background: linear-gradient(180deg, #fff 0%, #fff1f3 100%);
          box-shadow: 0 14px 40px rgba(20, 39, 78, .08);
          padding: clamp(1.5rem, 4vw, 2.75rem);
          margin-bottom: clamp(1.1rem, 3vw, 1.75rem);
          text-align: center;
        }
        .ws-sample-tag {
          display: block;
          font-family: "Playfair Display", Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(1.05rem, 2.8vw, 1.35rem);
          color: var(--c-pink);
          margin-bottom: .5rem;
        }
        .ws-sample h2 {
          font-size: clamp(1.8rem, 5.5vw, 2.8rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0 0 .5rem;
          scroll-margin-top: 1.5rem;
        }
        .ws-sample-sub {
          font-size: clamp(1rem, 2.4vw, 1.2rem);
          font-weight: 700;
          color: var(--c-navy-soft);
          margin: 0 0 1rem;
        }
        .ws-sample .ws-text { max-width: 64ch; margin-left: auto; margin-right: auto; }
        .ws-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: .75rem;
          margin: clamp(1.25rem, 3vw, 1.75rem) 0 0;
          text-align: left;
        }
        @media (min-width: 768px) {
          .ws-meta { grid-template-columns: repeat(4, 1fr); }
        }
        .ws-meta > div {
          padding: .9rem 1rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, .85);
          border: 1px solid var(--c-line);
        }
        .ws-meta dt { color: var(--c-navy-soft); font-size: .82rem; margin-bottom: .25rem; }
        .ws-meta dd { margin: 0; font-weight: 700; line-height: 1.35; font-size: .95rem; }

        .ws-checks { list-style: none; margin: 0; padding: 0; display: grid; gap: .85rem; }
        .ws-checks li {
          display: flex;
          gap: .75rem;
          color: var(--c-navy-soft);
          font-size: clamp(.9rem, 1.8vw, .97rem);
          line-height: 1.6;
        }
        .ws-checks li::before {
          content: "";
          flex: none;
          width: 20px;
          height: 20px;
          margin-top: 2px;
          border-radius: 50%;
          background:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 12.5l4 4 8-9'/></svg>") center / 70% no-repeat,
            linear-gradient(135deg, var(--c-green), var(--c-blue));
        }

        /* ---------- Time bar ---------- */
        .ws-timebar { display: flex; gap: 4px; margin-bottom: clamp(1.1rem, 3vw, 1.75rem); }
        .ws-timebar > div { min-width: 0; flex-basis: 0; }
        .ws-timebar-fill {
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--a1), var(--a2));
        }
        .ws-timebar-label {
          margin-top: .35rem;
          text-align: center;
          font-size: .75rem;
          font-weight: 700;
          color: var(--c-navy-soft);
        }

        /* ---------- Sessions (accordion) ---------- */
        .ws-sessions { display: grid; gap: clamp(.8rem, 2vw, 1.1rem); }
        .ws-session {
          overflow: hidden;
          background: #fff;
          border: 1px solid var(--c-line);
          border-radius: clamp(16px, 2vw, 20px);
          box-shadow: 0 10px 30px rgba(20, 39, 78, .06);
          transition: box-shadow .35s ease;
        }
        .ws-session[open] { box-shadow: 0 16px 40px rgba(var(--glow), .16); }
        .ws-session summary {
          display: flex;
          align-items: center;
          gap: clamp(.7rem, 2vw, 1rem);
          padding: clamp(.9rem, 2.5vw, 1.25rem);
          cursor: pointer;
          list-style: none;
        }
        .ws-session summary::-webkit-details-marker { display: none; }
        .ws-session summary:focus-visible { outline: 3px solid var(--c-navy); outline-offset: -3px; }
        .ws-session-num {
          flex: none;
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, var(--a1), var(--a2));
          box-shadow: 0 6px 14px rgba(var(--glow), .35);
        }
        .ws-session-main { flex: 1; min-width: 0; display: block; }
        .ws-session-title {
          display: block;
          font-weight: 700;
          font-size: clamp(.98rem, 2vw, 1.1rem);
          line-height: 1.3;
        }
        .ws-session-activity {
          display: block;
          color: var(--c-navy-soft);
          font-size: .88rem;
          margin-top: 2px;
        }
        .ws-chip-time {
          flex: none;
          background: var(--tint);
          border-color: transparent;
          padding: .3rem .8rem;
        }
        .ws-session-chev {
          flex: none;
          width: 22px;
          height: 22px;
          color: var(--a1);
          transition: transform .35s ease;
        }
        .ws-session-chev svg { width: 100%; height: 100%; display: block; }
        .ws-session[open] .ws-session-chev { transform: rotate(180deg); }

        .ws-session-body {
          display: grid;
          gap: .9rem;
          padding: .5rem clamp(1rem, 3vw, 1.5rem) clamp(1.1rem, 3vw, 1.6rem);
          color: var(--c-navy-soft);
          font-size: clamp(.9rem, 1.8vw, .97rem);
          line-height: 1.7;
          background: linear-gradient(180deg, #fff 0%, var(--tint) 100%);
        }
        @media (min-width: 768px) {
          .ws-session-body { padding-left: 4.6rem; }
        }
        .ws-session-body p { margin: 0; }
        .ws-session-body strong,
        .ws-mini-title { color: var(--c-navy); font-weight: 700; }
        .ws-mini-title { margin: 0 0 .35rem !important; }
        .ws-bullets { margin: 0; padding-left: 1.2rem; display: grid; gap: .4rem; }
        .ws-bullets li::marker { color: var(--a1); }
        .ws-outcome {
          padding: .9rem 1.1rem !important;
          border-radius: 14px;
          background: rgba(255, 255, 255, .85);
        }

        /* ---------- Deliverables: one card, divided list ---------- */
        .ws-deliv {
          display: grid;
          grid-template-columns: 1fr;
          padding: 0 !important;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .ws-deliv { grid-template-columns: 1fr 1fr; }
        }
        .ws-deliv-item {
          padding: clamp(1.1rem, 3vw, 1.6rem) clamp(1.25rem, 3vw, 1.85rem);
          border-bottom: 1px solid var(--c-line);
        }
        .ws-deliv-item h3 { font-size: clamp(1rem, 2vw, 1.1rem); margin: 0 0 .35rem; }
        .ws-deliv-item p { margin: 0; }
        @media (min-width: 768px) {
          .ws-deliv-item:nth-child(odd) { border-right: 1px solid var(--c-line); }
          .ws-deliv-item:nth-last-child(-n+2) { border-bottom: 0; }
        }
        @media (max-width: 767px) {
          .ws-deliv-item:last-child { border-bottom: 0; }
        }

        /* ---------- CTA ---------- */
        .ws-cta {
          text-align: center;
          border-radius: clamp(18px, 2.5vw, 26px);
          border: 1px solid var(--c-line);
          background: linear-gradient(180deg, #fff 0%, #fff4e8 100%);
          box-shadow: 0 14px 40px rgba(20, 39, 78, .08);
          padding: clamp(2rem, 5vw, 3.5rem) clamp(1.1rem, 4vw, 2.5rem);
        }
        .ws-cta h2 {
          font-size: clamp(1.5rem, 4.4vw, 2.2rem);
          font-weight: 700;
          letter-spacing: -0.015em;
          line-height: 1.2;
          margin: 0 0 .8rem;
        }
        .ws-cta .ws-btn { margin: 0 auto; }

        /* ---------- Glass button (same as Intro) ---------- */
        .ws-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
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
        .ws-btn::before,
        .ws-btn::after {
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
        .ws-btn::before { background: var(--a1); left: 6%; top: -25%; animation: wsOrbA 8s ease-in-out infinite; }
        .ws-btn::after  { background: var(--a2); right: 12%; bottom: -35%; animation: wsOrbB 9s ease-in-out infinite; }
        @keyframes wsOrbA { 0%, 100% { translate: 0 0; } 50% { translate: 100px 10px; } }
        @keyframes wsOrbB { 0%, 100% { translate: 0 0; } 50% { translate: -90px -8px; } }

        .ws-btn-text { position: relative; z-index: 1; min-width: 0; }
        .ws-btn-arrow {
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
        .ws-btn-arrow svg {
          position: absolute;
          width: clamp(13px, .6vw + 10px, 16px);
          height: clamp(13px, .6vw + 10px, 16px);
          transition: transform .45s cubic-bezier(.22, 1, .36, 1);
        }
        .ws-btn-arrow svg:nth-child(2) { transform: translateX(-28px); }
        .ws-btn:hover {
          transform: translateY(-3px);
          color: #fff;
          box-shadow:
            0 16px 32px rgba(var(--glow), .38),
            inset 0 1.5px 0 rgba(255, 255, 255, .95),
            inset 0 -8px 16px rgba(255, 255, 255, .15);
        }
        .ws-btn:hover::before,
        .ws-btn:hover::after { scale: 5.5; opacity: .95; }
        .ws-btn:hover .ws-btn-text { text-shadow: 0 1px 6px rgba(20, 39, 78, .3); }
        .ws-btn:hover .ws-btn-arrow { transform: scale(1.08); }
        .ws-btn:hover .ws-btn-arrow svg:nth-child(1) { transform: translateX(28px); }
        .ws-btn:hover .ws-btn-arrow svg:nth-child(2) { transform: translateX(0); }
        .ws-btn:focus-visible { outline: 3px solid var(--c-navy); outline-offset: 3px; }

        /* ---------- Lightbox ---------- */
        .ws-lb {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: grid;
          place-items: center;
          padding: 1rem;
          background: rgba(20, 39, 78, .88);
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
        }
        .ws-lb img {
          max-width: 100%;
          max-height: 85vh;
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, .45);
        }
        .ws-lb-btn {
          position: absolute;
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 0;
          background: rgba(255, 255, 255, .92);
          color: var(--c-navy);
          font-size: 1.4rem;
          cursor: pointer;
          transition: transform .3s ease;
        }
        .ws-lb-btn:hover { transform: scale(1.08); }
        .ws-lb-btn:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
        .ws-lb-close { top: 1rem; right: 1rem; }
        .ws-lb-prev  { left: .75rem; top: 50%; margin-top: -23px; }
        .ws-lb-next  { right: .75rem; top: 50%; margin-top: -23px; }

        /* ---------- Responsive ---------- */
        @media (max-width: 560px) {
          .ws-session summary { flex-wrap: wrap; }
          .ws-chip-time { order: 3; margin-left: 52px; }
          .ws-session-chev { margin-left: auto; }
          .ws-timebar-label { font-size: .68rem; }
        }
        @media (max-width: 360px) {
          .ws-btn { padding-left: .85rem; }
        }
        @media (min-width: 1440px) {
          .ws-wrap { max-width: 1200px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ws *, .ws *::before, .ws *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="ws-wrap">
        <Link to="/services" className="ws-back">← Back to Services</Link>

        {/* ---------- Hero ---------- */}
        <div className="ws-hero">
          <h1 className="ws-title">
            Learning Psychology Through <span className="ws-word">Experience</span>
          </h1>
          <p className="ws-text">
            Workshops can create a different kind of learning experience: one that is interactive,
            practical and easier to connect with real life.
          </p>
          <p className="ws-text">
            I design and facilitate psychology-based workshops and learning experiences around
            relevant personal, educational and professional-development themes.
          </p>
        </div>

        <nav className="ws-nav" aria-label="On this page">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>{n.label}</a>
          ))}
        </nav>

        {/* ---------- Gallery ---------- */}
        <div className="ws-block">
          <SectionHead
            id="gallery"
            title="Workshop Gallery"
            sub="A few moments from past workshops. Tap a photo to view it full screen."
          />

          <div className="ws-stage">
            {failed[active] ? (
              <div className="ws-stage-main ws-stage-missing">Photo unavailable</div>
            ) : (
              <button
                type="button"
                className="ws-stage-main"
                onClick={() => setLightbox(active)}
                aria-label={`Open workshop photo ${active + 1} full screen`}
              >
                <img
                  key={active}
                  src={PHOTOS[active]}
                  alt={`Workshop session photo ${active + 1}`}
                  onError={() => setFailed((f) => ({ ...f, [active]: true }))}
                />
              </button>
            )}

            <button type="button" className="ws-stage-btn ws-stage-prev" aria-label="Previous photo" onClick={() => go(-1)}>‹</button>
            <button type="button" className="ws-stage-btn ws-stage-next" aria-label="Next photo" onClick={() => go(1)}>›</button>
            <span className="ws-stage-count">{active + 1} / {PHOTOS.length}</span>
          </div>

          <div className="ws-thumbs">
            {PHOTOS.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`ws-thumb${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Show workshop photo ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Themes ---------- */}
        <div className="ws-block">
          <SectionHead
            id="themes"
            title="Workshop Themes"
            sub="Four areas where I can build a workshop around your group."
          />
          <div className="ws-grid-2">
            {THEMES.map((t) => (
              <article key={t.title} className={`ws-card ws-card-tint tone-${t.tone}`}>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
          <p className="ws-note">
            These are examples of workshop themes I can develop around your audience, objectives and
            requirements. Each workshop can be tailored to the context in which it will be delivered.
          </p>

          <div className="ws-audience">
            <p>Workshops can be developed for:</p>
            <div className="ws-pills">
              {AUDIENCES.map((a) => <span key={a} className="ws-chip">{a}</span>)}
            </div>
          </div>
        </div>

        {/* ---------- Sample workshop ---------- */}
        <div className="ws-block" id="sample">
          <div className="ws-sample">
            <span className="ws-sample-tag">Sample workshop design</span>
            <h2>Managing Exam Stress</h2>
            <p className="ws-sample-sub">From Pressure to Preparation</p>
            <p className="ws-text">
              A structured, activity-based workshop designed to help students understand exam stress,
              recognise their personal stress patterns and develop practical ways to respond to
              academic pressure.
            </p>

            <dl className="ws-meta">
              {SAMPLE_META.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="ws-grid-2">
            <div className="ws-card ws-card-tint tone-pink">
              <h3>Workshop Overview</h3>
              <p>
                Exams can bring more than academic pressure. Students may experience fear of
                failure, difficulty concentrating, comparison with peers, expectations from others
                and uncertainty about their performance.
              </p>
              <p>
                This workshop is designed to help students understand these experiences without
                judging themselves, recognise the relationship between thoughts, emotions and
                behaviours, and identify practical strategies they can use during their preparation.
              </p>
              <p>
                Rather than simply telling students to “stay calm” or “think positively,” the
                session gives them opportunities to reflect, participate and develop a realistic
                personal action plan.
              </p>
            </div>

            <div className="ws-card ws-card-tint tone-green">
              <h3>Learning Objectives</h3>
              <p>By the end of the workshop, participants should be able to:</p>
              <ul className="ws-checks">
                {OBJECTIVES.map((o) => (
                  <li key={o}><span>{o}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- Detailed flow ---------- */}
        <div className="ws-block">
          <SectionHead
            id="flow"
            title="Detailed Workshop Flow"
            sub={`Six sessions, ${totalMinutes} minutes in total. Tap a session to see the activity, prompts and expected outcome.`}
          />

          <div
            className="ws-timebar"
            role="img"
            aria-label={`Time split across sessions: ${SESSIONS.map((s, i) => `session ${i + 1}, ${s.minutes} minutes`).join("; ")}`}
          >
            {SESSIONS.map((s, i) => (
              <div key={s.title} className={`tone-${SESSION_TONES[i]}`} style={{ flexGrow: s.minutes }}>
                <div className="ws-timebar-fill" />
                <div className="ws-timebar-label">{s.minutes}m</div>
              </div>
            ))}
          </div>

          <div className="ws-sessions">
            {SESSIONS.map((s, i) => (
              <Session key={s.title} s={s} index={i} tone={SESSION_TONES[i]} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {/* ---------- Materials ---------- */}
        <div className="ws-block">
          <SectionHead
            id="materials"
            title="Workshop Materials & Deliverables"
            sub="Depending on the institution’s requirements and the agreed project scope, the workshop design package can include:"
          />
          <div className="ws-card ws-deliv">
            {DELIVERABLES.map((d) => (
              <div key={d.title} className="ws-deliv-item">
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Evaluation + Considerations ---------- */}
        <div className="ws-grid-2 ws-block">
          <div className="ws-card ws-card-tint tone-blue">
            <h3>Evaluation &amp; Follow-Through</h3>
            <p>
              The workshop can include a brief opening and closing reflection to assess
              participants’ understanding of exam stress and their confidence in identifying
              practical coping strategies.
            </p>
            <p>
              Feedback can also explore which activities participants found useful and which
              strategies they intend to try. These responses can inform future workshop
              improvements without claiming that a single session will eliminate exam stress.
            </p>
          </div>

          <div className="ws-card ws-card-tint tone-purple">
            <h3>Design Considerations</h3>
            <p>
              The workshop is designed to be participatory, age-appropriate and sensitive to
              different student experiences.
            </p>
            <p>
              Students should be able to participate without being required to disclose personal
              difficulties publicly. Activities can be adapted to the age group, group size,
              available time, language and institutional context.
            </p>
            <p>
              The session is educational rather than a substitute for individual psychological
              assessment or treatment. Students experiencing persistent or severe distress should
              be encouraged to seek appropriate support.
            </p>
          </div>
        </div>

        {/* ---------- CTA ---------- */}
        <div className="ws-cta">
          <h2>
            Need a Workshop Designed for <span className="ws-word">Your Audience?</span>
          </h2>
          <p className="ws-text" style={{ maxWidth: "58ch", margin: "0 auto 1.5rem" }}>
            Whether you already have a topic or need help shaping your ideas, we can discuss your
            audience, objectives and requirements to identify an appropriate design approach.
          </p>
          <GlassLink to="/book" tone="pink">Discuss Your Workshop</GlassLink>
        </div>
      </div>

      {/* ---------- Lightbox ---------- */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Workshop photo viewer"
          className="ws-lb"
          onClick={() => setLightbox(null)}
        >
          <img
            src={PHOTOS[lightbox]}
            alt={`Workshop session photo ${lightbox + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Close photo"
            className="ws-lb-btn ws-lb-close"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            className="ws-lb-btn ws-lb-prev"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + PHOTOS.length) % PHOTOS.length); }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            className="ws-lb-btn ws-lb-next"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % PHOTOS.length); }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}