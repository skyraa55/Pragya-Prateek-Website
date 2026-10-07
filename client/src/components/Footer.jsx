import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useSite } from "../useSite.js";
import { useCourses } from "../useCourses.js";

const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

/* Brand icons as inline SVG (lucide-react no longer ships brand logos) */
function YoutubeIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.83v1.57h.05c.53-1 1.84-2.07 3.79-2.07 4.05 0 4.8 2.67 4.8 6.13v5.87h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4V9.75Z" />
    </svg>
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
      { threshold: 0.1 }
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

/* Link with a small coral line that grows in on hover */
function FootLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group flex items-center py-[5px] text-[.92rem] text-[#4a5a7a] no-underline transition-colors duration-300 hover:text-[#ff4d6d]"
    >
      <span
        aria-hidden="true"
        className={`h-[2px] w-0 rounded-full bg-[#ff4d6d] transition-all duration-300 ${EASE} group-hover:mr-2 group-hover:w-3 motion-reduce:transition-none`}
      />
      {children}
    </Link>
  );
}

function ColumnTitle({ children }) {
  return (
    <h5 className="mb-3 text-[.78rem] font-bold uppercase tracking-[.16em] text-[#14274e]">
      {children}
    </h5>
  );
}

function SocialButton({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-[#eadfd6] bg-white text-[#14274e] transition duration-300 hover:-translate-y-1 hover:border-[#ff4d6d] hover:bg-[#ff4d6d] hover:text-white hover:shadow-[0_8px_18px_rgba(255,77,109,0.3)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const SITE = useSite();
  const year = new Date().getFullYear();
  const { courses } = useCourses();
  const hasCourses = !!courses && courses.length > 0;

  /* Explore links, split into two columns automatically
     (Courses appears only when there are courses, same as before) */
  const exploreLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "Who Am I" },
    { to: "/services", label: "Services" },
    { to: "/work-with-me", label: "Work With Me" },
    ...(hasCourses ? [{ to: "/courses", label: "Courses" }] : []),
    { to: "/blog", label: "Blogs" },
    { to: "/content", label: "Content" },
    { to: "/contact", label: "Contact" },
  ];
  const half = Math.ceil(exploreLinks.length / 2);
  const exploreCols = [exploreLinks.slice(0, half), exploreLinks.slice(half)];

  return (
    <footer className="overflow-hidden bg-[#fff3ec] pt-10 text-[#14274e] sm:pt-14">
      {/* full-width panel */}
      <div className="relative w-full overflow-hidden rounded-t-[28px] bg-[linear-gradient(135deg,#ffd9e0_0%,#ffe9d6_45%,#dff1fb_100%)] px-3 pt-4 sm:rounded-t-[40px] sm:px-6 sm:pt-8 lg:px-10">
        {/* soft colour blobs, same pastel mood as the site */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#ff9f43]/25 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-1/3 h-56 w-56 rounded-full bg-[#8b6fe0]/20 blur-3xl"
        />

        {/* ---------- Floating white card ---------- */}
        <Reveal className="relative z-10">
          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(255,77,109,0.14)] sm:p-10 lg:px-14 lg:py-12">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
              {/* Brand */}
              <div className="lg:col-span-4">
                <Link to="/" className="mb-5 inline-block no-underline" aria-label="Home">
                  <img
                    src="/mental-health-logo.png"
                    alt="Pragya Prateek logo"
                    className="h-16 w-auto object-contain sm:h-20"
                  />
                </Link>

                <p className="mb-6 max-w-[38ch] text-[.92rem] leading-[1.7] text-[#4a5a7a]">
                  {SITE.roles}
                </p>

                <div className="flex items-center gap-2.5">
                  {SITE.youtubeUrl && (
                    <SocialButton href={SITE.youtubeUrl} label="YouTube">
                      <YoutubeIcon className="h-[18px] w-[18px]" />
                    </SocialButton>
                  )}
                  {SITE.instagramUrl && (
                    <SocialButton href={SITE.instagramUrl} label="Instagram">
                      <InstagramIcon className="h-[18px] w-[18px]" />
                    </SocialButton>
                  )}
                  {SITE.linkedinUrl && (
                    <SocialButton href={SITE.linkedinUrl} label="LinkedIn">
                      <LinkedinIcon className="h-[18px] w-[18px]" />
                    </SocialButton>
                  )}
                </div>
              </div>

              {/* Explore: split into two columns */}
              <div className="lg:col-span-4">
                <ColumnTitle>Explore</ColumnTitle>
                <div className="grid grid-cols-2 gap-x-6">
                  {exploreCols.map((col, ci) => (
                    <div key={ci}>
                      {col.map((l) => (
                        <FootLink key={l.label} to={l.to}>
                          {l.label}
                        </FootLink>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas of Work */}
              <div className="sm:col-span-2 lg:col-span-4">
                <ColumnTitle>Areas of Work</ColumnTitle>
                <FootLink to="/services">Psychology Career Guidance</FootLink>
                <FootLink to="/workshops">Workshops &amp; Programs</FootLink>
                <FootLink to="/services">Professional Growth Guidance</FootLink>
                <FootLink to="/work-with-me">Educational Content</FootLink>
                <FootLink to="/blog">Everyday Psychology</FootLink>
              </div>
            </div>

            {/* divider + bottom row */}
            <div className="mt-9 border-t border-[#eadfd6] pt-5">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <p className="text-[.85rem] text-[#4a5a7a]">
                  © {year} Pragya Prateek. All rights reserved.
                </p>

                <a
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group inline-flex items-center gap-2 rounded-full border border-[#eadfd6] bg-white py-1.5 pl-4 pr-1.5 text-[.85rem] font-bold text-[#14274e] no-underline transition duration-300 hover:border-[#ff4d6d] hover:text-[#ff4d6d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none"
                >
                  Back to top
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#14274e] text-white transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#ff4d6d] motion-reduce:transition-none">
                    <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </span>
                </a>
              </div>

              <p className="mt-4 max-w-[110ch] text-[.76rem] leading-[1.7] text-[#8a95ad]">
                The information shared through this website and associated content is intended for
                educational and informational purposes and should not be considered a substitute
                for professional medical or psychological treatment where such treatment is
                required.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ---------- Giant faded name peeking out below the card ---------- */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative -mt-3 h-[clamp(3.6rem,10.5vw,8.6rem)] select-none overflow-hidden text-center sm:-mt-5"
        >
          <span className="block whitespace-nowrap bg-[linear-gradient(180deg,rgba(255,77,109,0.38)_0%,rgba(255,77,109,0)_85%)] bg-clip-text text-[clamp(3.2rem,13vw,10.5rem)] font-bold leading-[1] tracking-[-0.04em] text-transparent">
            Pragya Prateek
          </span>
        </div>
      </div>
    </footer>
  );
}