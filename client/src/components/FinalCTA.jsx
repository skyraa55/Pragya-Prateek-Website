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
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" className={className}>
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
      "shadow-[0_10px_24px_rgba(255,77,109,0.25),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,77,109,0.12)] hover:shadow-[0_16px_32px_rgba(255,77,109,0.38),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,255,255,0.15)]",
    orbA: "bg-[#ff4d6d]",
    orbB: "bg-[#ffb347]",
    bubble: "text-[#ff4d6d] shadow-[0_4px_10px_rgba(255,77,109,0.25),inset_0_1px_0_#fff]",
  },
  violet: {
    shadow:
      "shadow-[0_10px_24px_rgba(139,111,224,0.25),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(139,111,224,0.12)] hover:shadow-[0_16px_32px_rgba(139,111,224,0.38),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,255,255,0.15)]",
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
      className={`group relative isolate inline-flex w-full items-center justify-between gap-3.5 overflow-hidden rounded-full border-[1.5px] border-white/90 bg-white/25 bg-[image:linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.15)_60%)] py-[7px] pl-5 pr-[7px] text-[.95rem] font-bold text-[#14274e] no-underline backdrop-blur-[14px] backdrop-saturate-[1.8] transition duration-[450ms] ${EASE} ${v.shadow} hover:-translate-y-[3px] hover:text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none sm:w-auto sm:pl-[1.4rem]`}
    >
      {/* two colour orbs drifting behind the glass; they bloom on hover */}
      <span
        aria-hidden="true"
        className={`absolute -top-1/4 left-[6%] -z-10 h-16 w-16 rounded-full ${v.orbA} opacity-75 blur-[14px] transition duration-[800ms] ${EASE} animate-[bpOrbA_8s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none`}
      />
      <span
        aria-hidden="true"
        className={`absolute -bottom-[35%] right-[12%] -z-10 h-16 w-16 rounded-full ${v.orbB} opacity-75 blur-[14px] transition duration-[800ms] ${EASE} animate-[bpOrbB_9s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none`}
      />

      <span className="relative z-[1] group-hover:[text-shadow:0_1px_6px_rgba(20,39,78,0.3)]">
        {children}
      </span>

      {/* arrow bubble: old arrow slides out, new one slides in */}
      <span
        className={`relative z-[1] inline-flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-full border-[1.5px] border-white/95 bg-white/65 sm:h-[38px] sm:w-[38px] ${v.bubble}`}
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
    <div className="mx-auto my-7 flex items-center justify-center gap-2" aria-hidden="true">
      <span className="h-[2px] w-8 rounded-full bg-[#ffd3da]" />
      <span className="h-2 w-2 rounded-full bg-[#ff4d6d]" />
      <span className="h-[2px] w-8 rounded-full bg-[#ffd3da]" />
    </div>
  );
}

export default function FinalCTA() {
  return (
    <section className="overflow-hidden bg-[#fff3ec] py-16 text-[#14274e] sm:py-24">
      <style>{KEYFRAMES}</style>

      <div className="mx-auto w-[92%] max-w-[760px] text-center">
        {/* ---------- Heading ---------- */}
        <Reveal>
          <span className="mb-5 inline-block rounded-full border border-[#ffd3da] bg-white px-4 py-1.5 text-[.8rem] font-bold uppercase tracking-[.16em] text-[#ff4d6d]">
            Start here
          </span>

          <h2 className="mb-9 text-[clamp(1.9rem,5.2vw,3rem)] font-bold leading-[1.15] tracking-[-0.025em]">
            Wherever You Are in Your Journey,{" "}
            {/* Animated gradient text (same as the "Psychology" word in Intro) */}
            <span className="inline-block bg-[linear-gradient(100deg,#ff4d6d,#ff9f43,#8b6fe0,#ff4d6d)] bg-[length:300%_100%] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] animate-[ctaFlow_7s_ease-in-out_infinite] motion-reduce:animate-none">
              You Can Start Here.
            </span>
          </h2>
        </Reveal>

        {/* ---------- Content (your original text) ---------- */}
        <Reveal delay={100}>
          <div className="space-y-3 text-[clamp(1rem,2.4vw,1.1rem)] leading-[1.8] text-[#4a5a7a]">
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

          <p className="mx-auto max-w-[56ch] text-[clamp(1.02rem,2.5vw,1.15rem)] font-medium leading-[1.8] text-[#14274e]">
            Whatever brings you here, I hope you find something that helps you understand a little
            more, think a little deeper and move forward with greater clarity.
          </p>
        </Reveal>

        {/* ---------- Glass buttons ---------- */}
        <Reveal delay={260} className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
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