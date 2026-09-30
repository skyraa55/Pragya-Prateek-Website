import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-[#dfe4f0] pt-12 pb-6">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="brand text-white font-bold text-xl flex items-center gap-[.55rem] mb-3">
              <span className="w-[34px] h-[34px] rounded-xl bg-gradient-to-br from-coral to-sun grid place-items-center text-white text-[1.1rem]">
                ✿
              </span>{" "}
              Pragya Prateek
            </div>
            <p className="text-[#aab3c9] text-[.92rem] max-w-[36ch]">
              Psychologist & educator helping you understand the mind, choose a career in
              psychology, and live more mindfully.
            </p>
          </div>

          <div>
            <h5 className="font-quicksand font-bold text-white mb-3">Explore</h5>
            <Link className="foot-link" to="/#about">
              What I Do
            </Link>
            <Link className="foot-link" to="/#services">
              Services
            </Link>
            <Link className="foot-link" to="/#courses">
              Courses
            </Link>
            <Link className="foot-link" to="/blog">
              Blog
            </Link>
            <Link className="foot-link" to="/#book">
              Book a Session
            </Link>
          </div>

          <div>
            <h5 className="font-quicksand font-bold text-white mb-3">Connect</h5>
            <a
              className="foot-link"
              href="https://youtube.com/@pragya_prateek_psychologist"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
            <Link className="foot-link" to="/#contact">
              Contact
            </Link>
            <a className="foot-link" href="#">
              Instagram
            </a>
            <a className="foot-link" href="#">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 text-center text-[#8b93a9] text-[.85rem]">
          © {year} Pragya Prateek · The Art of Mindful Thinking. Made with care. 🌿
        </div>
      </div>
    </footer>
  );
}
