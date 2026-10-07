import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCourses } from "../useCourses.js";

/*
  Theme (taken from your design):
  navy text   #14264A   | soft navy   #4A5878
  pink CTA    #F0476B   | pink hover  #E03A5E
  pink tint   #FFE4EA   | sky tint    #E6F3FB
  cream bg    #FFFBF7
*/

const styles = `
@keyframes nav-drop {
  from { opacity: 0; transform: translateY(-14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes nav-pop {
  from { opacity: 0; transform: translateY(-8px) scale(.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes logo-sway {
  0%, 100% { transform: rotate(0deg); }
  50%      { transform: rotate(-7deg) scale(1.06); }
}
@keyframes pill-in {
  0%   { transform: scale(.7); opacity: 0; }
  60%  { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.nav-enter { animation: nav-drop .6s cubic-bezier(.2,.8,.2,1) both; }
.nav-menu-open { animation: nav-pop .25s ease-out both; }
.nav-logo:hover img { animation: logo-sway .8s ease-in-out; }
/* Nav links: soft pill that pops in behind the text */
.nav-link {
  position: relative;
  isolation: isolate;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: color .2s ease, transform .25s ease;
}
.nav-link::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 999px;
  background: #FFE4EA;
  opacity: 0;
  transform: scale(.7);
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .2s ease;
}
.nav-link:hover { transform: translateY(-1px); }
.nav-link:hover::before { opacity: 1; transform: scale(1); }
.nav-link:active { transform: scale(.96); }
.nav-link[aria-current="page"]::before {
  opacity: 1;
  transform: scale(1);
  animation: pill-in .4s ease-out both;
}
.nav-link:focus:not(:focus-visible) { outline: none; }
.nav-link:focus-visible { outline: 2px solid #F0476B; outline-offset: 2px; }

/* CTA button: gradient, light sweep, arrow chip */
.nav-cta {
  position: relative;
  overflow: hidden;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 6px 16px rgba(240,71,107,.28);
  transition: transform .25s ease, box-shadow .25s ease;
}
.nav-cta::after {
  content: "";
  position: absolute;
  top: 0; left: -75%;
  width: 50%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,.45), transparent);
  transform: skewX(-20deg);
}
.nav-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(240,71,107,.38); }
.nav-cta:hover::after { left: 130%; transition: left .7s ease; }
.nav-cta:active { transform: translateY(0) scale(.97); box-shadow: 0 4px 10px rgba(240,71,107,.3); }
.nav-cta:focus-visible { outline: 2px solid #14264A; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  .nav-enter, .nav-menu-open, .nav-logo:hover img, .nav-link[aria-current="page"]::before { animation: none !important; }
  .nav-link, .nav-link::before, .nav-cta, .nav-cta::after { transition: none !important; }
}
`;

function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { courses } = useCourses();
  const { pathname } = useLocation();
  const hasCourses = !!courses && courses.length > 0; // Courses link only appears once a course exists

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/work-with-me", label: "Work With Me" },
    ...(hasCourses ? [{ to: "/courses", label: "Courses" }] : []),
    { to: "/blog", label: "Blogs" },
    { to: "/content", label: "Content" },
    { to: "/contact", label: "Contact" },
  ];

  // Highlight the link whose page we are on (sub-pages like /blog/my-post still highlight "Blogs").
  const isActive = (to) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/"));

  return (
    <>
      <style>{styles}</style>
      <header
        className={`nav-enter sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(255,251,247,.94)] border-[#FFD3DC] shadow-[0_8px_24px_rgba(240,71,107,.10)]"
            : "bg-[rgba(255,251,247,.8)] border-[rgba(255,211,220,.5)]"
        }`}
      >
        <div className="w-[94%] max-w-[1180px] mx-auto flex items-center justify-between py-2.5">
          {/* Logo + brand */}
          <Link
            className="nav-logo flex items-center gap-3"
            to="/"
            onClick={() => setOpen(false)}
          >
            <img
              src="/mental-health-logo.png"
              alt="Pragya Prateek"
              className="h-14 sm:h-16 lg:h-[4.5rem] w-auto object-contain origin-center"
            />
          </Link>

          {/* Links */}
          <nav
            className={`lg:flex lg:static lg:flex-row lg:items-center lg:gap-1 lg:bg-transparent lg:shadow-none lg:p-0 lg:w-auto lg:border-0
              ${open ? "flex nav-menu-open" : "hidden"} fixed top-[5.5rem] right-[4%] flex-col items-stretch bg-white rounded-[22px] p-3 w-[min(250px,80%)] z-50 border border-[#FFD3DC] shadow-[0_16px_40px_rgba(20,38,74,.14)]`}
          >
            {links.map((l) => {
              const active = isActive(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link font-quicksand font-semibold text-[.95rem] px-4 py-2 rounded-full block whitespace-nowrap ${
                    active ? "text-[#F0476B]" : "text-[#14264A] hover:text-[#F0476B]"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="nav-cta group inline-flex items-center justify-center gap-3 mt-2 lg:mt-0 lg:ml-3 whitespace-nowrap rounded-full bg-gradient-to-r from-[#F0476B] to-[#FF6F8E] text-white font-quicksand font-bold text-[.92rem] pl-5 pr-1.5 py-1.5"
            >
              Get in touch
              <span className="grid place-items-center w-8 h-8 rounded-full bg-white/25 transition-all duration-300 group-hover:bg-white group-hover:text-[#F0476B] group-hover:rotate-[-45deg]">
                <ArrowIcon />
              </span>
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden grid place-items-center w-11 h-11 rounded-2xl bg-[#E6F3FB] text-[#14264A] border-0 cursor-pointer transition-all duration-200 hover:bg-[#FFE4EA] hover:text-[#F0476B] active:scale-95"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path
                className="origin-center transition-all duration-300"
                d={open ? "M6 6l12 12" : "M4 7h16"}
              />
              <path
                className="transition-opacity duration-200"
                style={{ opacity: open ? 0 : 1 }}
                d="M4 12h16"
              />
              <path
                className="origin-center transition-all duration-300"
                d={open ? "M18 6L6 18" : "M4 17h16"}
              />
            </svg>
          </button>
        </div>
      </header>
    </>
  );
}