import { useEffect, useRef, useState } from "react";

/* ---------- Theme (same brand palette) ---------- */
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
  tintBlue: "#e8f5fd",
  tintGreen: "#ecf9f3",
  tintPurple: "#f1edfc",
  sky: "#3d9bd8",
};

/* ---------- Content ---------- */
const degrees = [
  { level: "Master's", t: "Master's in Social Work in Counselling; with a focus on Mental Health", tint: C.tintPink, color: C.pink },
  { level: "Master's", t: "Master's in Psychology", tint: C.tintYellow, color: C.orange },
  { level: "Diploma", t: "Diploma in Expressive Arts Therapies", tint: C.tintPurple, color: C.purple },
];

const experience = [
  "Mental health education",
  "Student guidance",
  "Mental-wellbeing content",
  "Parenting",
  "Everyday relationships",
  "Expressive arts",
  "Professional content development",
];

/* The two questions: each is split into plain text + a highlighted key phrase */
const aboutQuestions = [
  {
    tag: "For psychology students",
    tint: C.tintPink,
    color: C.pink,
    mark: "ab-mark-pink",
    icon: "cap",
    parts: [
      { t: "How can psychology students make " },
      { t: "better-informed career decisions", hl: true },
      { t: " to become successful in this field?" },
    ],
  },
  {
    tag: "For everyday life",
    tint: C.tintBlue,
    color: C.sky,
    mark: "ab-mark-blue",
    icon: "heart",
    parts: [
      { t: "How can psychological knowledge help us better understand the " },
      { t: "everyday experiences", hl: true },
      { t: " that shape our relationships, families, parenthood and personal space?" },
    ],
  },
];

const studentQuestions = [
  "What can I actually do with or after my psychology degree?",
  "Which career path should I explore?",
  "Do I need another degree or specialisation?",
  "What skills should I develop?",
  "How can I create multiple earning options in this field?",
  "How do I build a meaningful career in psychology?",
];
const qTints = [C.tintPink, C.tintYellow, C.tintBlue, C.tintGreen, C.tintPurple, C.tintPink];

/* ---------- Icons ---------- */
const Svg = ({ children, className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const CapIcon = (p) => (
  <Svg {...p}>
    <path d="M2 9l10-5 10 5-10 5L2 9z" />
    <path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5" />
    <path d="M22 9v6" />
  </Svg>
);
const EyeIcon = (p) => (
  <Svg {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </Svg>
);
const CheckIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.7 2.7L16 9.5" />
  </Svg>
);
const PlayIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="4" />
    <path d="M10.5 9.5v5l4-2.5-4-2.5z" />
  </Svg>
);
const HeartIcon = (p) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </Svg>
);
const BookIcon = (p) => (
  <Svg {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z" />
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
  </Svg>
);
const Chevron = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`ab-rv ab-${dir} ${show ? "ab-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

const Grad = ({ children }) => <span className="ab-word">{children}</span>;

const Label = ({ children, light = false }) => (
  <p className="text-[.95rem] font-semibold" style={{ color: light ? "#ffd3dc" : "#e23a5c" }}>
    {children}
  </p>
);

const IconTile = ({ children, tint, color, size = 48 }) => (
  <span className="ab-icon grid place-items-center shrink-0 rounded-[14px]" style={{ width: size, height: size, background: tint, color }}>
    {children}
  </span>
);

/* ---------- Page ---------- */
export default function About() {
  const steps = [
    { t: "Understand first.", icon: EyeIcon, tint: C.tintPink, color: C.pink },
    { t: "Think critically.", icon: SearchIcon, tint: C.tintYellow, color: C.orange },
    { t: "Then decide what works for you.", icon: CheckIcon, tint: C.tintPurple, color: C.purple },
  ];

  return (
    <section id="about" className="about-root" style={{ background: C.bg, color: C.navy }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&display=swap');
        .about-root{font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}
        .about-root *,.about-root *::before,.about-root *::after{box-sizing:border-box}
        .about-root h2,.about-root h3,.about-root h4,.about-root p,.about-root ul,.about-root blockquote,.about-root figure{margin:0;padding:0}
        .about-root ul{list-style:none}
        .about-root a,.about-root em,.about-root strong{text-decoration:none}

        .ab-wrap{width:92%;max-width:1040px;margin:0 auto}
        .ab-section{margin-top:clamp(4.5rem,9vw,7.5rem)}
        .ab-h1{font-size:clamp(2.1rem,5vw,3.6rem);font-weight:700;line-height:1.14;letter-spacing:-.025em}
        .ab-h2{font-size:clamp(1.7rem,3.6vw,2.6rem);font-weight:700;line-height:1.18;letter-spacing:-.02em}
        .ab-body{font-size:1.02rem;line-height:1.8}
        .ab-balance{text-wrap:balance}

        /* gradient word: pops in, then colour keeps flowing */
        .ab-word{
          display:inline-block;
          background:linear-gradient(100deg,${C.pink},${C.orange},${C.purple},${C.pink});
          background-size:300% 100%;
          -webkit-background-clip:text;background-clip:text;
          -webkit-text-fill-color:transparent;color:transparent;
          animation:abWordIn .9s cubic-bezier(.2,1.3,.4,1) .3s both, abFlow 7s ease-in-out 1.2s infinite;
        }
        @keyframes abWordIn{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:none}}
        @keyframes abFlow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

        /* scroll reveal */
        .ab-rv{opacity:0;transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
        .ab-up{transform:translateY(26px)}
        .ab-left{transform:translateX(-30px)}
        .ab-right{transform:translateX(30px)}
        .ab-zoom{transform:scale(.95)}
        .ab-fade{transform:none}
        .ab-in{opacity:1;transform:none}

        /* hero title: one fade-up, gradient word has its own pop */
        .ab-title{opacity:0;transform:translateY(20px);animation:abLine .8s cubic-bezier(.22,1,.36,1) .1s forwards}
        .ab-hero-h{font-size:clamp(1.9rem,3.1vw,2.6rem);font-weight:700;line-height:1.2;letter-spacing:-.025em}
        .ab-hero-p{font-size:1.125rem;line-height:1.85;max-width:52ch}
        .ab-hero-p em{font-style:italic;font-weight:500;color:${C.navy}}

        /* hero lines */
        .ab-line{display:block;opacity:0;transform:translateY(20px);animation:abLine .8s cubic-bezier(.22,1,.36,1) forwards}
        @keyframes abLine{to{opacity:1;transform:none}}

        /* hero backdrop */
        .ab-hero-bg{background:
          radial-gradient(60% 50% at 15% 0%, ${C.tintPink} 0%, transparent 70%),
          radial-gradient(55% 45% at 90% 10%, ${C.tintPurple} 0%, transparent 70%)}

        /* photo + floating tags */
        .ab-photo{transition:transform .8s cubic-bezier(.22,1,.36,1)}
        .ab-photo:hover{transform:scale(1.02)}
        .ab-float{animation:abFloat 6s ease-in-out infinite}
        .ab-float.b{animation-delay:-3s}
        @keyframes abFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}

        /* cards */
        .ab-card{transition:transform .35s ease,box-shadow .35s ease}
        .ab-card:hover{transform:translateY(-5px);box-shadow:0 18px 40px -18px rgba(20,39,78,.22)}
        .ab-icon{transition:transform .45s cubic-bezier(.3,1.5,.5,1)}
        .ab-card:hover .ab-icon{transform:scale(1.1) rotate(-6deg)}

        /* ---------- Two questions section ---------- */
        .ab-q{position:relative;overflow:hidden;height:100%}
        .ab-q-a{border-radius:34px 34px 34px 8px}
        .ab-q-b{border-radius:34px 34px 8px 34px}
        .ab-q-mark{
          position:absolute;line-height:.8;font-weight:800;pointer-events:none;user-select:none;
          font-family:Georgia,'Times New Roman',serif;
        }
        .ab-q-a .ab-q-mark{right:-.4rem;top:-1.2rem;font-size:11rem;color:${C.pink};opacity:.13;transform:rotate(10deg)}
        .ab-q-b .ab-q-mark{left:-.2rem;bottom:-3rem;font-size:13rem;color:${C.sky};opacity:.15;transform:rotate(-12deg)}
        .ab-q-text{position:relative;font-size:clamp(1.15rem,1.9vw,1.4rem);line-height:1.55;font-weight:600;letter-spacing:-.01em}
        .ab-hl{font-weight:700}
        .ab-mark-pink{color:#d6284b}
        .ab-mark-blue{color:#1f78b4}
        .ab-tag{display:inline-flex;align-items:center;gap:.5rem;padding:.4rem .85rem .4rem .45rem;border-radius:999px;background:#fff;font-size:.85rem;font-weight:600}
        .ab-tag-ico{display:grid;place-items:center;width:26px;height:26px;border-radius:50%}
        .ab-thread{display:none}
        @media (min-width:768px){
          .ab-stagger{margin-top:3.25rem}
          .ab-thread{display:block;width:100%;height:auto;max-width:760px;margin:0 auto}
          .ab-thread-m{display:none}
        }
        .ab-thread-m{width:2px;height:40px;margin:0 auto;background:repeating-linear-gradient(to bottom,${C.line} 0 6px,transparent 6px 11px)}

        /* ---------- Professional background section ---------- */
        .ab-pb-panel{border-radius:clamp(28px,4vw,44px);background:${C.tintPurple};padding:clamp(1.75rem,5vw,4.25rem)}
        .about-root .ab-pb-note{margin-top:2rem;font-size:1.12rem;line-height:1.85;color:${C.soft};max-width:40ch}
        .about-root .ab-pb-h{font-size:.98rem;font-weight:600;color:${C.soft}}

        .about-root .ab-degs{margin-top:1.1rem;display:flex;flex-direction:column;gap:1rem}
        .ab-deg4{position:relative;display:flex;align-items:center;min-height:92px;background:#fff;border-radius:20px;padding:1.2rem 1.5rem 1.2rem 5.4rem;
          box-shadow:0 14px 30px -22px rgba(20,39,78,.45);transition:box-shadow .4s ease,transform .4s ease}
        .ab-deg4:hover{transform:translateY(-3px);box-shadow:0 20px 36px -22px rgba(20,39,78,.5)}
        .ab-deg4 p{font-size:clamp(1rem,1.5vw,1.12rem);font-weight:600;line-height:1.45}
        .ab-deg4-lv{font-weight:800}
        /* bookmark ribbon: unrolls from the top once when the card appears */
        .ab-deg4-rib{position:absolute;left:1.5rem;top:0;width:46px;height:68px;display:flex;justify-content:center;padding-top:.8rem;color:#fff;
          clip-path:polygon(0 0,100% 0,100% 100%,50% 80%,0 100%);
          transform:scaleY(0);transform-origin:top;
          transition:transform .9s cubic-bezier(.22,1,.36,1) .35s,height .4s ease}
        .ab-rv.ab-in > .ab-deg4 .ab-deg4-rib{transform:scaleY(1)}
        .ab-deg4:hover .ab-deg4-rib{height:80px}

        .ab-exp-wrap{margin-top:clamp(2.5rem,6vw,4rem);padding-top:clamp(2rem,4vw,2.75rem);border-top:1px solid rgba(20,39,78,.1);text-align:center}
        .about-root .ab-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem;margin-top:1.4rem}
        .ab-tag2{display:inline-flex;align-items:center;gap:.55rem;background:#fff;border:1.5px solid transparent;border-radius:999px;padding:.55rem 1.1rem .55rem .95rem;font-size:.95rem;font-weight:500;opacity:0;
          box-shadow:0 8px 18px -14px rgba(20,39,78,.5);transition:border-color .3s ease,transform .3s ease}
        .ab-tag2::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--c);flex-shrink:0}
        .ab-exp-wrap.ab-in .ab-tag2{opacity:1;animation:abChip .7s cubic-bezier(.22,1,.36,1) backwards;animation-delay:var(--d,0ms)}
        @keyframes abChip{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .ab-tag2:hover{border-color:var(--c);transform:translateY(-2px)}

        /* ---------- My approach section ---------- */
        .ab-ap-panel{border-radius:clamp(28px,4vw,44px);background:${C.navy};color:${C.bg};padding:clamp(2rem,6vw,4.5rem)}
        .ab-ap-grid{display:grid;grid-template-columns:1.15fr 1fr;gap:clamp(2rem,5vw,4rem);align-items:center;margin-top:clamp(2.5rem,5vw,3.75rem)}
        .about-root .ab-ap-big{font-size:clamp(1.4rem,2.6vw,2rem);font-weight:700;line-height:1.3;letter-spacing:-.015em}
        .about-root .ab-ap-sub{font-size:1.1rem;line-height:1.75;opacity:.78;max-width:42ch}

        /* balance: the marker swings between the two extremes, then settles in the middle */
        .ab-bal{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:26px;padding:2.4rem 1.75rem 1.9rem}
        .ab-bal-track{position:relative;height:6px;border-radius:6px;background:rgba(255,255,255,.16);margin:0 .75rem}
        .ab-bal-zone{position:absolute;left:34%;width:32%;top:0;bottom:0;border-radius:6px;background:linear-gradient(90deg,${C.pink},${C.orange})}
        .ab-bal-dot{position:absolute;top:50%;left:50%;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;background:#fff;box-shadow:0 0 0 6px rgba(255,77,109,.28),0 6px 16px rgba(0,0,0,.3)}
        .ab-bal-wrap.ab-in .ab-bal-dot{animation:abSwing 3.2s cubic-bezier(.45,.05,.3,1) .5s backwards}
        @keyframes abSwing{0%{left:2%}30%{left:98%}58%{left:14%}80%{left:64%}100%{left:50%}}
        .ab-bal-labels{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:.75rem;margin-top:1.6rem;font-size:.85rem;line-height:1.4;opacity:.75}
        .ab-bal-labels span:first-child{text-align:left}
        .ab-bal-labels span:last-child{text-align:right}
        .ab-bal-mid{text-align:center;font-weight:700;color:#fff;opacity:1}

        /* the blend */
        .ab-ap-mix{margin-top:clamp(3rem,6vw,4.5rem);padding-top:clamp(2.5rem,5vw,3.5rem);border-top:1px solid rgba(255,255,255,.12);text-align:center}
        .about-root .ab-ap-mix-t{max-width:56ch;margin:0 auto;font-size:1.1rem;line-height:1.8;opacity:.88}
        .ab-eq{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.8rem;margin-top:1.9rem}
        .ab-eq-chip{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:.6rem 1.2rem;font-size:.95rem;font-weight:600}
        .ab-eq-op{font-size:1.4rem;font-weight:600;opacity:.6;line-height:1}
        .ab-eq-res{border-radius:999px;padding:.7rem 1.5rem;font-size:.98rem;font-weight:700;color:#fff;background:linear-gradient(120deg,${C.pink},${C.orange})}
        .ab-ap-mix.ab-in .ab-eq > *{animation:abPop .7s cubic-bezier(.22,1,.36,1) backwards;animation-delay:var(--d,0ms)}
        .ab-ap-mix.ab-in .ab-eq-res{animation:abPop .7s cubic-bezier(.22,1,.36,1) backwards var(--d,0ms),abGlow 3.4s ease-in-out 2s infinite}
        @keyframes abPop{from{opacity:0;transform:translateY(10px) scale(.95)}to{opacity:1;transform:none}}
        @keyframes abGlow{0%,100%{box-shadow:0 0 0 0 rgba(255,77,109,0)}50%{box-shadow:0 0 0 9px rgba(255,77,109,.16)}}

        /* the aim: three steps along one line */
        .ab-ap-aim{margin-top:clamp(3rem,6vw,4.5rem);padding-top:clamp(2.5rem,5vw,3.5rem);border-top:1px solid rgba(255,255,255,.12);text-align:center}
        .about-root .ab-ap-aim-t{max-width:52ch;margin:0 auto;font-size:1.1rem;line-height:1.8;opacity:.88}
        .ab-flow{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2.5rem}
        .ab-flow-line{position:absolute;top:28px;left:16.66%;right:16.66%;height:2px;background:rgba(255,255,255,.14);border-radius:2px;overflow:hidden}
        .ab-flow-fill{display:block;width:100%;height:100%;background:linear-gradient(90deg,${C.pink},${C.orange},${C.purple});transform:scaleX(0);transform-origin:left;transition:transform 1.6s cubic-bezier(.65,0,.35,1) .5s}
        .ab-flow.ab-in .ab-flow-fill{transform:scaleX(1)}
        .ab-step{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:1.1rem;text-align:center;padding:0 .5rem}
        .ab-step-node{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;box-shadow:0 0 0 8px ${C.navy},0 0 0 9px rgba(255,255,255,.14)}
        .ab-flow.ab-in .ab-step-node{animation:abNode .7s cubic-bezier(.3,1.5,.5,1) backwards;animation-delay:var(--d,0ms)}
        @keyframes abNode{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}
        .about-root .ab-step-t{font-size:1.08rem;font-weight:600;line-height:1.4;max-width:16ch}
        @media (max-width:767px){
          .ab-ap-grid{grid-template-columns:1fr}
          .ab-bal-labels{font-size:.78rem}
          .ab-flow{grid-template-columns:1fr;gap:1.6rem;max-width:340px;margin-left:auto;margin-right:auto}
          .ab-flow-line{left:27px;right:auto;top:28px;bottom:28px;width:2px;height:auto}
          .ab-flow-fill{transform:scaleY(0);transform-origin:top}
          .ab-flow.ab-in .ab-flow-fill{transform:scaleY(1)}
          .ab-step{flex-direction:row;text-align:left;gap:1.2rem;padding:0}
          .about-root .ab-step-t{max-width:none}
        }

        /* ---------- Why I created these spaces ---------- */
        .about-root .ab-why-intro{max-width:58ch;color:${C.soft}}
        .ab-why-block{margin-top:clamp(3.5rem,7vw,5.5rem)}
        .about-root .ab-why-lead{font-size:1.15rem;font-weight:700}
        /* student questions panel */
        .ab-qp{display:grid;grid-template-columns:1fr;gap:clamp(1.75rem,4vw,2.5rem);align-items:center;text-align:left;background:${C.tintYellow};border-radius:clamp(28px,4vw,44px);padding:clamp(1.75rem,5vw,4rem)}
        @media (min-width:900px){.ab-qp{grid-template-columns:5fr 7fr;gap:clamp(2.5rem,5vw,4.5rem)}}
        .ab-qp-mark{
          display:inline-block;font-family:Georgia,'Times New Roman',serif;font-weight:800;font-size:clamp(6rem,14vw,9.5rem);line-height:.85;margin-bottom:1.25rem;padding-right:.1em;
          background:linear-gradient(100deg,${C.pink},${C.orange},${C.purple},${C.pink});background-size:300% 100%;
          -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
          animation:abFlow 7s ease-in-out infinite}
        .ab-qp-lead{font-size:clamp(1.5rem,2.6vw,2rem);font-weight:700;line-height:1.3;letter-spacing:-.015em;max-width:18ch}
        .about-root .ab-qp-list{display:flex;flex-direction:column;gap:.8rem}
        .ab-qp-row{display:flex;align-items:center;gap:1rem;background:#fff;border-radius:18px;padding:.95rem 1.3rem .95rem .95rem;font-size:1.02rem;font-weight:600;line-height:1.45;
          box-shadow:0 10px 24px -18px rgba(20,39,78,.4);opacity:0;transition:transform .3s ease,box-shadow .3s ease}
        .ab-rv.ab-in .ab-qp-row{opacity:1;animation:abRow .8s cubic-bezier(.22,1,.36,1) backwards;animation-delay:var(--d,0ms)}
        @keyframes abRow{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
        .ab-qp-row:hover{transform:translateY(-2px);box-shadow:0 16px 28px -18px rgba(20,39,78,.5)}
        .ab-qp-q{display:grid;place-items:center;flex-shrink:0;width:38px;height:38px;border-radius:50%;background:var(--t);color:var(--c);font-family:Georgia,'Times New Roman',serif;font-size:1.2rem;font-weight:800;transition:background .3s ease,color .3s ease}
        .ab-qp-row:hover .ab-qp-q{background:var(--c);color:#fff}

        .ab-why-spaces{display:grid;grid-template-columns:1fr;gap:1.5rem;margin-top:clamp(4rem,8vw,6rem)}
        @media (min-width:900px){.ab-why-spaces{grid-template-columns:1fr 1fr;gap:1.75rem}}
        .ab-pl{height:100%;border-radius:32px;padding:clamp(1.75rem,3.5vw,2.75rem);display:flex;flex-direction:column;gap:1.6rem}
        .ab-pl-top{display:flex;align-items:center;gap:1rem}
        .ab-pl-ico{display:grid;place-items:center;flex-shrink:0;width:56px;height:56px;border-radius:50%;background:#fff}
        .about-root .ab-pl-kind{font-size:.88rem;font-weight:600;color:${C.soft}}
        .about-root .ab-pl-t{font-size:clamp(1.2rem,2vw,1.5rem);font-weight:700;line-height:1.25;letter-spacing:-.015em;margin-top:.2rem}
        .about-root .ab-pl-p{font-size:1.02rem;line-height:1.85}
        .about-root .ab-pl-p strong{font-weight:700}
        .about-root .ab-pl-chips{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:auto;padding-top:.4rem}
        .ab-pchip{background:#fff;border-radius:999px;padding:.45rem 1rem;font-size:.88rem;font-weight:600;opacity:0}
        .ab-rv.ab-in .ab-pchip{opacity:1;animation:abChip .7s cubic-bezier(.22,1,.36,1) backwards;animation-delay:var(--d,0ms)}

        .ab-why-meet{margin-top:clamp(1.25rem,3vw,2rem);text-align:center}
        .ab-thread2{display:none}
        @media (min-width:900px){.ab-thread2{display:block;width:100%;height:auto}.ab-why-meet .ab-thread-m{display:none}}
        @media (min-width:768px) and (max-width:899px){.ab-why-meet .ab-thread-m{display:block}}
        .about-root .ab-why-belief{margin-top:.9rem;font-size:1.03rem;font-weight:600;color:${C.soft};max-width:46ch;margin-left:auto;margin-right:auto}
        .ab-why-quote-wrap{margin-top:1.5rem}
        .about-root .ab-why-quote{border-radius:32px;padding:clamp(2.75rem,6vw,4.5rem) clamp(1.5rem,5vw,3.5rem);text-align:center;color:#fff;background:linear-gradient(120deg,${C.pink},${C.orange})}
        .about-root .ab-why-quote p{margin:0 auto;max-width:30ch;font-size:clamp(1.35rem,2.7vw,2.1rem);font-weight:700;line-height:1.3;letter-spacing:-.01em}
        .ab-why-close-wrap{margin-top:clamp(3rem,6vw,4.5rem);text-align:center}
        .about-root .ab-why-close{margin:0 auto;max-width:58ch;font-size:1.12rem;line-height:1.9;font-weight:500}

        /* step connectors nudge */
        .ab-nudge{animation:abNudge 1.8s ease-in-out infinite}
        @keyframes abNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
        @media (max-width:767px){.ab-nudge{animation-name:abNudgeY}@keyframes abNudgeY{0%,100%{transform:rotate(90deg) translateX(0)}50%{transform:rotate(90deg) translateX(5px)}}}

        @media (hover:none){.ab-card:hover{transform:none;box-shadow:none}.ab-photo:hover{transform:none}}
        @media (prefers-reduced-motion:reduce){
          .about-root *,.about-root *::before,.about-root *::after{animation:none!important;transition:none!important}
          .ab-rv,.ab-line,.ab-title,.ab-word{opacity:1!important;transform:none!important}
        }
      `}</style>

      {/* ================= 1. HERO ================= */}
      <div className="ab-hero-bg">
        <div className="ab-wrap" style={{ maxWidth: 1120, paddingTop: "clamp(3rem,7vw,5.5rem)", paddingBottom: "clamp(0rem,2vw,1rem)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
            {/* PHOTO (left) */}
            <Reveal dir="left" delay={150} className="lg:col-span-4">
              <div className="mx-auto lg:mx-0 w-[82%] max-w-[360px] lg:w-full lg:max-w-[400px]">
                <div className="ab-photo rounded-[30px] overflow-hidden bg-white p-2.5 shadow-[0_30px_60px_-30px_rgba(20,39,78,.4)]">
                  <div className="aspect-[4/5] rounded-[22px] overflow-hidden" style={{ background: C.tintPink }}>
                    <img src="/pragya.jpeg" alt="Pragya Prateek" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="font-bold text-[1.2rem] leading-tight">Pragya Prateek</p>
                  <p className="mt-1.5 text-[.95rem] font-medium" style={{ color: C.soft }}>
                    Mental Health Educator &amp; Content Creator
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ABOUT CONTENT (right) */}
            <div className="lg:col-span-8 text-left">
              <h2 className="ab-title ab-hero-h">
                <span className="block">Psychology, for me,</span>
                <span className="block lg:whitespace-nowrap">is more than a&nbsp;<Grad>profession.</Grad></span>
              </h2>

              <div className="mt-10 md:mt-12 flex flex-col gap-6">
                <Reveal delay={350}>
                  <p className="ab-hero-p">
                    I am Pragya Prateek, a <strong className="font-semibold">mental health educator and content creator</strong> with a
                    simple goal: to make psychology <em>easier to understand, more practical and more relevant to everyday life.</em>
                  </p>
                </Reveal>
                <Reveal delay={450}>
                  <p className="ab-hero-p" style={{ color: C.soft }}>
                    My journey in psychology has taken me through academic learning, professional experience, content creation and
                    continuous exploration of how psychological knowledge can be applied <em>beyond traditional settings.</em>
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. TWO QUESTIONS ================= */}
      <div className="ab-wrap ab-section">
        {/* Centered heading */}
        <Reveal>
          <div className="flex justify-center">
            <h3 className="ab-h2 ab-balance text-center" style={{ maxWidth: "22ch" }}>
              Over time, I found myself particularly drawn to two <Grad>questions:</Grad>
            </h3>
          </div>
        </Reveal>

        {/* Two questions, staggered so they read as two different doorways */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 items-start" style={{ marginTop: "clamp(4rem, 8vw, 7rem)" }}>
          {aboutQuestions.map((q, i) => (
            <Reveal key={q.tag} as="li" dir={i === 0 ? "left" : "right"} delay={i * 140} className={i === 1 ? "ab-stagger" : ""}>
              <div
                className={`ab-q ${i === 0 ? "ab-q-a" : "ab-q-b"} p-7 md:p-9 flex flex-col gap-6`}
                style={{ background: q.tint }}
              >
                <span className="ab-q-mark" aria-hidden="true">?</span>

                <span className="ab-tag self-start" style={{ color: C.navy }}>
                  <span className="ab-tag-ico" style={{ background: q.tint, color: q.color }}>
                    {q.icon === "cap" ? <CapIcon className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                  </span>
                  {q.tag}
                </span>

                <p className="ab-q-text">
                  {q.parts.map((p, j) =>
                    p.hl ? (
                      <span key={j} className={`ab-hl ${q.mark}`}>{p.t}</span>
                    ) : (
                      <span key={j}>{p.t}</span>
                    )
                  )}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* Thread: both questions flow into one line of work */}
        <Reveal delay={150} className="mt-2 md:mt-6">
          <svg className="ab-thread" viewBox="0 0 760 90" fill="none" aria-hidden="true">
            <path d="M190 0 C190 52 380 38 380 82" stroke={C.pink} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 8" />
            <path d="M570 0 C570 52 380 38 380 82" stroke={C.sky} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 8" />
            <circle cx="380" cy="84" r="5" fill={C.navy} />
          </svg>
          <div className="ab-thread-m" aria-hidden="true" />
          <div className="mt-3 flex justify-center">
            <p className="text-center text-[1.1rem] md:text-[1.2rem] font-semibold ab-balance" style={{ maxWidth: "30ch" }}>
              These questions continue to shape the work I do today.
            </p>
          </div>
        </Reveal>
      </div>

      {/* ================= 3. PROFESSIONAL BACKGROUND ================= */}
      <div className="ab-wrap ab-section">
        <Reveal dir="zoom">
          <div className="ab-pb-panel">
            <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: "clamp(2.5rem,6vw,4.5rem)" }}>
              {/* Left: title + the story in a few lines */}
              <div className="lg:col-span-5">
                <div className="flex flex-col" style={{ gap: "1rem" }}>
                  <Reveal><Label>My Academic Journey</Label></Reveal>
                  <Reveal delay={80}>
                    <h3 className="ab-h2">
                      My Professional <Grad>Background</Grad>
                    </h3>
                  </Reveal>
                </div>
                <Reveal delay={160}>
                  <p className="ab-pb-note">
                    Alongside my formal education, I have continued to develop my skills through professional projects, workshops,
                    content creation and independent learning.
                  </p>
                </Reveal>
              </div>

              {/* Right: degrees as loosely pinned notes */}
              <div className="lg:col-span-7">
                <Reveal>
                  <p className="ab-pb-h">My academic background includes:</p>
                </Reveal>
                <ul className="ab-degs">
                  {degrees.map((d, i) => (
                    <Reveal key={d.t} as="li" delay={i * 140} dir="fade">
                      <div className="ab-deg4" style={{ "--c": d.color }}>
                        <span className="ab-deg4-rib" style={{ background: d.color }} aria-hidden="true">
                          <CapIcon className="w-5 h-5" />
                        </span>
                        <p>
                          <span className="ab-deg4-lv" style={{ color: d.color }}>{d.level}</span>
                          {d.t.slice(d.level.length)}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>

            <Reveal className="ab-exp-wrap">
              <p className="ab-pb-h">My work and areas of experience include:</p>
              <ul className="ab-tags">
                {experience.map((e, i) => (
                  <li
                    key={e}
                    className="ab-tag2"
                    style={{
                      "--c": [C.pink, C.sky, "#2fb585", C.orange, C.purple][i % 5],
                      "--d": `${250 + i * 80}ms`,
                    }}
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Reveal>
      </div>

      {/* ================= 4. MY APPROACH ================= */}
      <div className="ab-wrap ab-section">
        <Reveal dir="zoom">
          <div className="ab-ap-panel">
            {/* Header */}
            <div className="flex flex-col items-center text-center" style={{ gap: "1rem" }}>
              <Label light>How I Work</Label>
              <h3 className="ab-h2">
                My <Grad>Approach</Grad>
              </h3>
            </div>

            {/* Belief + the balance it describes */}
            <div className="ab-ap-grid">
              <Reveal>
                <div className="flex flex-col" style={{ gap: "1.5rem" }}>
                  <p className="ab-ap-big">
                    I don't believe psychology should be made unnecessarily complicated to sound professional.
                  </p>
                  <p className="ab-ap-sub">
                    At the same time, simplifying psychology shouldn't mean oversimplifying it.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={150} className="ab-bal-wrap">
                <div className="ab-bal">
                  <div className="ab-bal-track" aria-hidden="true">
                    <span className="ab-bal-zone" />
                    <span className="ab-bal-dot" />
                  </div>
                  <div className="ab-bal-labels">
                    <span>Unnecessarily complicated</span>
                    <span className="ab-bal-mid">Accessible &amp; responsible</span>
                    <span>Oversimplified</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* How: three things blended into one */}
            <Reveal className="ab-ap-mix">
              <p className="ab-ap-mix-t">
                My approach is to bring together psychological knowledge, practical examples and real-world context so that the
                information is both accessible and responsible.
              </p>
              <div className="ab-eq">
                <span className="ab-eq-chip" style={{ "--d": "250ms" }}>Psychological knowledge</span>
                <span className="ab-eq-op" style={{ "--d": "380ms" }} aria-hidden="true">+</span>
                <span className="ab-eq-chip" style={{ "--d": "510ms" }}>Practical examples</span>
                <span className="ab-eq-op" style={{ "--d": "640ms" }} aria-hidden="true">+</span>
                <span className="ab-eq-chip" style={{ "--d": "770ms" }}>Real-world context</span>
                <span className="ab-eq-op" style={{ "--d": "900ms" }} aria-hidden="true">=</span>
                <span className="ab-eq-res" style={{ "--d": "1030ms" }}>Accessible &amp; responsible</span>
              </div>
            </Reveal>

            {/* The aim: a three-step path */}
            <Reveal className="ab-ap-aim">
              <p className="ab-ap-aim-t">
                Whether I am discussing a psychology career or an everyday relationship/parenting/generational concern, the aim
                remains the same:
              </p>
            </Reveal>

            <Reveal className="ab-flow">
              <span className="ab-flow-line" aria-hidden="true"><span className="ab-flow-fill" /></span>
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.t} className="ab-step" style={{ "--d": `${400 + i * 520}ms` }}>
                    <span className="ab-step-node" style={{ background: s.tint, color: s.color }}>
                      <Icon className="w-6 h-6" />
                    </span>
                    <p className="ab-step-t">{s.t}</p>
                  </div>
                );
              })}
            </Reveal>
          </div>
        </Reveal>
      </div>

      {/* ================= 5. WHY I CREATED THESE SPACES ================= */}
      <div className="ab-wrap ab-section">
        {/* Header */}
        <div className="flex flex-col items-center text-center" style={{ gap: "1.1rem" }}>
          <Reveal><Label>Why I Started</Label></Reveal>
          <Reveal delay={80}>
            <h3 className="ab-h2">
              Why I Created These <Grad>Spaces?</Grad>
            </h3>
          </Reveal>
          <Reveal delay={140}>
            <p className="ab-body ab-why-intro">
              Psychology can be relevant to so many different parts of our lives but the questions we ask can be very different
              depending on where we are in our journey.
            </p>
          </Reveal>
        </div>

        {/* Student questions: one calm panel, lead on the left, questions on the right */}
        <div className="ab-why-block">
          <Reveal dir="zoom">
            <div className="ab-qp">
              <div className="ab-qp-left">
                <span className="ab-qp-mark" aria-hidden="true">?</span>
                <p className="ab-qp-lead">As a psychology student, you may be wondering:</p>
              </div>
              <ul className="ab-qp-list">
                {studentQuestions.map((q, i) => (
                  <li
                    key={q}
                    className="ab-qp-row"
                    style={{
                      "--c": [C.pink, C.orange, C.sky, "#2fb585", C.purple, C.pink][i],
                      "--t": qTints[i],
                      "--d": `${300 + i * 100}ms`,
                    }}
                  >
                    <span className="ab-qp-q" aria-hidden="true">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* The two spaces */}
        <div className="ab-why-spaces">
          <Reveal dir="fade">
            <div className="ab-pl" style={{ background: C.tintPink }}>
              <div className="ab-pl-top">
                <span className="ab-pl-ico" style={{ color: C.pink }}><PlayIcon className="w-7 h-7" /></span>
                <div>
                  <p className="ab-pl-kind">YouTube channel</p>
                  <h4 className="ab-pl-t">The Art of Mindful Thinking</h4>
                </div>
              </div>
              <p className="ab-pl-p">
                I created the YouTube channel <strong>The Art of Mindful Thinking</strong> to make these questions easier to
                answer. It is focused on psychology students, aspiring professionals and career guidance by covering psychology
                career paths, education, emerging areas, professional skills, earning options and practical steps for building a
                career in the field.
              </p>
              <ul className="ab-pl-chips">
                {["Career paths", "Education", "Emerging areas", "Professional skills", "Earning options", "Practical steps"].map((c, i) => (
                  <li key={c} className="ab-pchip" style={{ "--d": `${300 + i * 70}ms` }}>{c}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal dir="fade" delay={140}>
            <div className="ab-pl" style={{ background: C.tintBlue }}>
              <div className="ab-pl-top">
                <span className="ab-pl-ico" style={{ color: C.sky }}><HeartIcon className="w-7 h-7" /></span>
                <div>
                  <p className="ab-pl-kind">Instagram space</p>
                  <h4 className="ab-pl-t">Psychology behind everyday situations</h4>
                </div>
              </div>
              <p className="ab-pl-p">
                But psychology doesn't stop with our education or profession. It also shapes the way we communicate, parent,
                build relationships and understand people from different generations. That is why I have also created a
                dedicated Instagram space with a different focus for exploring parenting, relationships, generational
                differences and the psychology behind the everyday situations we experience.
              </p>
              <ul className="ab-pl-chips">
                {["Parenting", "Relationships", "Generational differences", "Everyday situations"].map((c, i) => (
                  <li key={c} className="ab-pchip" style={{ "--d": `${300 + i * 70}ms` }}>{c}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Both spaces meet in one belief */}
        <Reveal className="ab-why-meet">
          <svg className="ab-thread2" viewBox="0 0 1000 90" fill="none" aria-hidden="true">
            <path d="M250 0 C250 56 500 40 500 84" stroke={C.pink} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 8" />
            <path d="M750 0 C750 56 500 40 500 84" stroke={C.sky} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 8" />
            <circle cx="500" cy="85" r="5" fill={C.navy} />
          </svg>
          <div className="ab-thread-m" aria-hidden="true" />
          <p className="ab-why-belief">While the two platforms have different focuses, they come from the same belief:</p>
        </Reveal>

        <Reveal dir="zoom" className="ab-why-quote-wrap">
          <blockquote className="ab-why-quote">
            <p>Psychology becomes truly meaningful when we can connect what we learn with how we actually live.</p>
          </blockquote>
        </Reveal>

        <Reveal className="ab-why-close-wrap">
          <p className="ab-why-close">
            Whether you are trying to find your direction as a psychology student or simply trying to understand the people and
            relationships around you a little better, I hope these spaces help you understand, reflect and make more informed
            choices.
          </p>
        </Reveal>
      </div>

      <div className="h-16 md:h-24" />
    </section>
  );
}