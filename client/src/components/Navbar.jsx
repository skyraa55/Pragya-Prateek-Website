import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/#home", label: "Home" },
    { to: "/#about", label: "What I Do" },
    { to: "/#services", label: "Services" },
    { to: "/#courses", label: "Courses" },
    { to: "/blog", label: "Blog" },
    { to: "/#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(255,251,245,.82)] border-b border-[rgba(231,224,213,.7)]">
      <div className="w-[92%] max-w-[1120px] mx-auto flex items-center justify-between py-3">
        <Link className="brand font-bold text-xl flex items-center gap-[.55rem]" to="/#home">
          <span className="w-[34px] h-[34px] rounded-xl bg-gradient-to-br from-coral to-sun grid place-items-center text-white text-[1.1rem]">
            ✿
          </span>{" "}
          Pragya Prateek
        </Link>

        <nav
          className={`md:flex md:static md:flex-row md:items-center md:gap-1 md:bg-transparent md:shadow-none md:p-0 md:w-auto
            ${open ? "flex" : "hidden"} fixed top-16 right-[4%] flex-col items-stretch bg-white rounded-[20px] p-2.5 shadow-soft w-[min(240px,80%)] z-50`}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="font-quicksand font-semibold text-ink-soft md:text-ink-soft text-ink px-3.5 py-2 rounded-full transition-colors duration-150 hover:text-ink hover:bg-white hover:shadow-soft-sm block"
            >
              {l.label}
            </Link>
          ))}
          <Link
            className="btn btn-primary ml-0 md:ml-1.5 mt-1 md:mt-0 justify-center"
            to="/#book"
            onClick={() => setOpen(false)}
          >
            Book a Session
          </Link>
        </nav>

        <button
          className="md:hidden bg-white border-0 w-11 h-11 rounded-2xl shadow-soft-sm cursor-pointer text-[1.3rem] text-ink"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
