import { Link } from "react-router-dom";
import { useSite } from "../useSite.js";
import { useCourses } from "../useCourses.js";

export default function Footer() {
  const SITE = useSite();
  const year = new Date().getFullYear();
  const { courses } = useCourses();
  const hasCourses = !!courses && courses.length > 0;

  return (
    <footer className="bg-ink text-[#dfe4f0] pt-12 pb-6">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="brand text-white font-bold text-xl flex items-center gap-[.55rem] mb-3">
              <span className="w-[34px] h-[34px] rounded-xl bg-gradient-to-br from-coral to-sun grid place-items-center text-white text-[1.1rem]">
                ✿
              </span>{" "}
              Pragya Prateek
            </div>
            <p className="text-[#aab3c9] text-[.92rem] max-w-[36ch]">{SITE.roles}</p>
          </div>

          <div>
            <h5 className="font-quicksand font-bold text-white mb-3">Explore</h5>
            <Link className="foot-link" to="/">Home</Link>
            <Link className="foot-link" to="/about">Who Am I</Link>
            <Link className="foot-link" to="/services">Services</Link>
            <Link className="foot-link" to="/work-with-me">Work With Me</Link>
            {hasCourses && <Link className="foot-link" to="/courses">Courses</Link>}
            <Link className="foot-link" to="/blog">Blogs</Link>
            <Link className="foot-link" to="/content">Content</Link>
            <Link className="foot-link" to="/contact">Contact</Link>
          </div>

          <div>
            <h5 className="font-quicksand font-bold text-white mb-3">Areas of Work</h5>
            <Link className="foot-link" to="/services">Psychology Career Guidance</Link>
            <Link className="foot-link" to="/workshops">Workshops &amp; Programs</Link>
            <Link className="foot-link" to="/services">Professional Growth Guidance</Link>
            <Link className="foot-link" to="/work-with-me">Educational Content</Link>
            <Link className="foot-link" to="/blog">Everyday Psychology</Link>
          </div>

          <div>
            <h5 className="font-quicksand font-bold text-white mb-3">Connect</h5>
            <a className="foot-link" href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</a>
            {SITE.instagramUrl && (
              <a className="foot-link" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
            )}
            {SITE.linkedinUrl && (
              <a className="foot-link" href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 text-center text-[#8b93a9] text-[.85rem]">
          <p>© {year} Pragya Prateek. All rights reserved.</p>
          <p className="mt-2 max-w-[90ch] mx-auto text-[.8rem]">
            The information shared through this website and associated content is intended for
            educational and informational purposes and should not be considered a substitute for
            professional medical or psychological treatment where such treatment is required.
          </p>
        </div>
      </div>
    </footer>
  );
}
