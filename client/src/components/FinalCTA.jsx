import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

/* Keyframes live here (Tailwind can't define them without editing its config):
   - glass-button orbs
   - animated gradient flow for the heading highlight */
const KEYFRAMES = `
  @keyframes bpOrbA { 0%,100% { translate: 0 0; } 50% { translate: 100px 10px; } }
  @keyframes bpOrbB { 0%,100% { translate: 0 0; } 50% { translate: -90px -8px; } }
  @keyframes ctaFlow {
    0%, 100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
`;

function ArrowIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${className}`}>
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

/* Glass button (same design + animation as the "Read the Blog" button).
   Two colour variants: "pink" (primary) and "violet" (secondary). */
const GLASS = {
  pink: {
    shadow:
      "shadow-[0_8px_20px_rgba(255,77,109,0.22),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,77,109,0.12)] hover:shadow-[0_16px_32px_rgba(255,77,109,0.38),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,255,255,0.15)]",
    orbA: "bg-[#ff4d6d]",
    orbB: "bg-[#ffb347]",
    bubble: "text-[#ff4d6d] shadow-[0_4px_10px_rgba(255,77,109,0.25),inset_0_1px_0_#fff]",
  },
  violet: {
    shadow:
      "shadow-[0_8px_20px_rgba(139,111,224,0.22),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(139,111,224,0.12)] hover:shadow-[0_16px_32px_rgba(139,111,224,0.38),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,255,255,0.15)]",
    orbA: "bg-[#8b6fe0]",
    orbB: "bg-[#5aa9e6]",
    bubble: "text-[#7a5bd6] shadow-[0_4px_10px_rgba(139,111,224,0.25),inset_0_1px_0_#fff]",
  },
};

function GlassButton({ to, children, variant = "pink" }) {
  const v = GLASS[variant];

  return (
    <Link
      to={to}
      className={`group relative isolate inline-flex w-auto max-w-full items-center justify-between gap-2.5 overflow-hidden rounded-full border-[1.5px] border-white/90 bg-white/25 bg-[image:linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.15)_60%)] py-[5px] pl-4 pr-[5px] text-[.82rem] font-bold text-[#14274e] no-underline backdrop-blur-[14px] backdrop-saturate-[1.8] transition duration-[450ms] ${EASE} ${v.shadow} hover:-translate-y-[3px] hover:text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none sm:gap-3.5 sm:py-[6px] sm:pl-5 sm:pr-[6px] sm:text-[.92rem] lg:py-[7px] lg:pl-[1.4rem] lg:pr-[7px] lg:text-[.95rem]`}
    >
      {/* two colour orbs drifting behind the glass; they bloom on hover */}
      <span
        aria-hidden="true"
        className={`absolute -top-1/4 left-[6%] -z-10 h-12 w-12 rounded-full ${v.orbA} opacity-75 blur-[12px] transition duration-[800ms] ${EASE} animate-[bpOrbA_8s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none sm:h-16 sm:w-16 sm:blur-[14px]`}
      />
      <span
        aria-hidden="true"
        className={`absolute -bottom-[35%] right-[12%] -z-10 h-12 w-12 rounded-full ${v.orbB} opacity-75 blur-[12px] transition duration-[800ms] ${EASE} animate-[bpOrbB_9s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none sm:h-16 sm:w-16 sm:blur-[14px]`}
      />

      <span className="relative z-[1] whitespace-nowrap group-hover:[text-shadow:0_1px_6px_rgba(20,39,78,0.3)]">
        {children}
      </span>

      {/* arrow bubble: old arrow slides out, new one slides in */}
      <span
        className={`relative z-[1] inline-flex h-7 w-7 flex-none items-center justify-center overflow-hidden rounded-full border-[1.5px] border-white/95 bg-white/65 sm:h-8 sm:w-8 lg:h-[38px] lg:w-[38px] ${v.bubble}`}
      >
        <ArrowIcon className={`absolute transition-transform duration-[450ms] ${EASE} group-hover:translate-x-7`} />
        <ArrowIcon className={`absolute -translate-x-7 transition-transform duration-[450ms] ${EASE} group-hover:translate-x-0`} />
      </span>
    </Link>
  );
}

/* Fades + slides its content up the first time it scrolls into view */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition duration-700 ${EASE} ${
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}

/* Small coral divider used between text groups */
function Divider() {
  return (
    <div className="mx-auto my-5 flex items-center justify-center gap-2 sm:my-7" aria-hidden="true">
      <span className="h-[2px] w-6 rounded-full bg-[#ffd3da] sm:w-8" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d6d] sm:h-2 sm:w-2" />
      <span className="h-[2px] w-6 rounded-full bg-[#ffd3da] sm:w-8" />
    </div>
  );
}

export default function FinalCTA() {
  return (
    <section className="overflow-hidden bg-[#fff3ec] py-12 text-[#14274e] sm:py-20 lg:py-24">
      <style>{KEYFRAMES}</style>

      <div className="mx-auto w-full max-w-[760px] px-4 text-center sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <Reveal>
          <span className="mb-4 inline-block rounded-full border border-[#ffd3da] bg-white px-3 py-1 text-[.68rem] font-bold uppercase tracking-[.14em] text-[#ff4d6d] sm:mb-5 sm:px-4 sm:py-1.5 sm:text-[.8rem] sm:tracking-[.16em]">
            Start here
          </span>

          <h2 className="mb-6 text-[clamp(1.55rem,6.4vw,3rem)] font-bold leading-[1.15] tracking-[-0.025em] sm:mb-9">
            Wherever You Are in Your Journey,{" "}
            {/* Animated gradient text (same as the "Psychology" word in Intro) */}
            <span className="inline-block bg-[linear-gradient(100deg,#ff4d6d,#ff9f43,#8b6fe0,#ff4d6d)] bg-[length:300%_100%] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] animate-[ctaFlow_7s_ease-in-out_infinite] motion-reduce:animate-none">
              You Can Start Here.
            </span>
          </h2>
        </Reveal>

        {/* ---------- Content (your original text) ---------- */}
        <Reveal delay={100}>
          <div className="space-y-2.5 text-[clamp(.9rem,2.6vw,1.1rem)] leading-[1.7] text-[#4a5a7a] sm:space-y-3 sm:leading-[1.8]">
            <p>Maybe you are a psychology student trying to understand what comes next.</p>
            <p>Maybe you are a professional trying to build your work.</p>
            <p>
              Or maybe you are simply curious about the psychology behind the people, relationships
              and experiences around you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <Divider />

          <p className="mx-auto max-w-[56ch] text-[clamp(.94rem,2.7vw,1.15rem)] font-medium leading-[1.7] text-[#14274e] sm:leading-[1.8]">
            Whatever brings you here, I hope you find something that helps you understand a little
            more, think a little deeper and move forward with greater clarity.
          </p>
        </Reveal>

        {/* ---------- Glass buttons ---------- */}
        <Reveal
          delay={260}
          className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-3.5"
        >
          <GlassButton to="/book" variant="pink">
            Book a Session
          </GlassButton>
          <GlassButton to="/contact" variant="violet">
            Get in Touch
          </GlassButton>
        </Reveal>
      </div>
    </section>
  );
}