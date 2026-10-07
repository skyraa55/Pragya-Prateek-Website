import { Link } from "react-router-dom";
import { SITE } from "../siteConfig.js";
import PhotoSlot from "./PhotoSlot.jsx";

const Cloud = ({ className }) => (
  <svg className={`cloud ${className}`} viewBox="0 0 200 90">
    <path d="M40 80c-22 0-40-15-40-33S18 14 40 14c4-8 14-14 26-14 15 0 28 10 31 24 18 1 33 15 33 33 0 18-16 33-36 33H40z" />
  </svg>
);

export default function Hero() {
  return (
    <section className="relative pt-10 overflow-hidden bg-gradient-to-b from-sky1 via-sky2 to-cream" id="home">
      <Cloud className="w-[120px] top-[14%] left-[4%] animate-float" />
      <Cloud className="w-[90px] top-[8%] right-[12%] animate-float-rev" />
      <Cloud className="w-[70px] bottom-[26%] left-[44%] opacity-70 animate-float-slow" />

      <div className="w-[92%] max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center pb-20 relative z-[2]">
        <div>
          <span className="eyebrow">Mental Health Educator • Psychology Content Creator • Well-Being Workshop Designer</span>
          <h1 className="text-[clamp(2.3rem,7vw,4rem)] font-bold my-1 mb-3">
            Pragya <span className="text-coral-deep">Prateek</span>
          </h1>
          <p className="font-quicksand font-bold text-[1.25rem] text-ink mb-3">
            Making Psychology Space Easier to Understand and Easier to Apply.
          </p>
          <p className="text-ink-soft text-[1.08rem] max-w-[52ch] mb-6">
            From building a career in psychology to understanding the relationships, parenting
            experiences and everyday behaviours that shape our lives, I create psychology-based
            content, guidance and learning experiences that connect psychology with real life.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link className="btn btn-primary" to="/services">Explore My Work →</Link>
            <Link className="btn btn-ghost" to="/work-with-me">Work With Me</Link>
          </div>
        </div>

        <div className="relative grid place-items-center order-first md:order-none mb-4 md:mb-0">
          <span className="blob" />
          <PhotoSlot
            src="/pragya.jpg"
            alt={SITE.name}
            hint={<>Add your portrait here<br />(save it as public/pragya.jpg)</>}
          />
        </div>
      </div>

      <svg className="block w-full h-auto -mb-1.5" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path fill="#fef9f2" d="M0,48 C240,96 480,0 720,32 C960,64 1200,96 1440,40 L1440,90 L0,90 Z" />
      </svg>
    </section>
  );
}
