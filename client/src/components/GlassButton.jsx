import { Link } from "react-router-dom";

const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

function ArrowIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${className}`}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Same glass button as Intro.jsx. Colours come from --a1 / --a2 / --glow set by a parent
   (accentStyle), and fall back to pink / orange. */
export default function GlassButton({ to, children, className = "" }) {
  return (
    <>
      <style>{`
        @keyframes gbOrbA { 0%,100% { translate: 0 0; } 50% { translate: 100px 10px; } }
        @keyframes gbOrbB { 0%,100% { translate: 0 0; } 50% { translate: -90px -8px; } }
      `}</style>
      <Link
        to={to}
        className={`group relative isolate inline-flex w-fit max-w-full items-center justify-between gap-3 overflow-hidden rounded-full border-[1.5px] border-white/90 bg-white/25 bg-[image:linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.15)_60%)] py-[5px] pl-5 pr-[5px] text-[.88rem] font-bold text-[#14274e] no-underline shadow-[0_8px_20px_rgba(var(--glow,255,77,109),0.22),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(var(--glow,255,77,109),0.12)] backdrop-blur-[14px] backdrop-saturate-[1.8] transition duration-[450ms] ${EASE} hover:-translate-y-[3px] hover:text-white hover:shadow-[0_16px_32px_rgba(var(--glow,255,77,109),0.38),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,255,255,0.15)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none sm:pl-6 sm:text-[.93rem] ${className}`}
      >
        <span
          aria-hidden="true"
          className={`absolute -top-1/4 left-[6%] -z-10 h-14 w-14 rounded-full bg-[color:var(--a1,#ff4d6d)] opacity-75 blur-[12px] transition duration-[800ms] ${EASE} animate-[gbOrbA_8s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none`}
        />
        <span
          aria-hidden="true"
          className={`absolute -bottom-[35%] right-[12%] -z-10 h-14 w-14 rounded-full bg-[color:var(--a2,#ffb347)] opacity-75 blur-[12px] transition duration-[800ms] ${EASE} animate-[gbOrbB_9s_ease-in-out_infinite] group-hover:scale-[5.5] group-hover:opacity-95 motion-reduce:animate-none`}
        />
        <span className="relative z-[1] whitespace-nowrap group-hover:[text-shadow:0_1px_6px_rgba(20,39,78,0.3)]">
          {children}
        </span>
        <span className="relative z-[1] inline-flex h-8 w-8 flex-none items-center justify-center overflow-hidden rounded-full border-[1.5px] border-white/95 bg-white/65 text-[color:var(--a1,#ff4d6d)] shadow-[0_4px_10px_rgba(var(--glow,255,77,109),0.25),inset_0_1px_0_#fff] sm:h-[38px] sm:w-[38px]">
          <ArrowIcon className={`absolute transition-transform duration-[450ms] ${EASE} group-hover:translate-x-7`} />
          <ArrowIcon className={`absolute -translate-x-7 transition-transform duration-[450ms] ${EASE} group-hover:translate-x-0`} />
        </span>
      </Link>
    </>
  );
}