import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero-wrap relative bg-[#fef9f2] overflow-hidden" id="home">
      {/* ===== Full-width banner: the content always sits ON the image ===== */}
      <div className="hero-banner relative w-full overflow-hidden bg-gradient-to-r from-[#fff6ee] via-[#fff3ea] to-[#fdeee8]">
        {/* soft pink waves on the left */}
        <div className="absolute -left-28 top-[8%] w-[340px] h-[340px] rounded-full bg-[#ffdcdf]/70 blur-xl pointer-events-none" />
        <div className="absolute left-[4%] -bottom-44 w-[560px] h-[340px] rounded-[50%] bg-[#ffe3e3]/70 blur-2xl pointer-events-none" />

        {/* ---------- Illustration (always behind the text) ---------- */}
        <img
          src="/hero.png"
          alt="Illustration of a calm woman sitting cross-legged with a warm cup, a sleeping cat and plants"
          className="hero-art"
          loading="eager"
          draggable="false"
        />

        {/* soft cream wash so the text stays readable on small screens */}
        <div className="hero-wash" aria-hidden="true" />

        {/* ---------- Text, overlaid on the image ---------- */}
        <div className="hero-text">
          <span className="eyebrow hero-eyebrow inline-block self-start bg-white/75 backdrop-blur rounded-full leading-snug shadow-sm">
            Mental Health Educator • Psychology Content Creator • Well-Being Workshop Designer
          </span>

          <h1 className="hero-title font-bold text-ink">
            Pragya{" "}
            <span className="hero-name-accent">Prateek</span>
          </h1>

          <p className="hero-tagline font-quicksand font-bold text-ink">
            Making Psychology Space Easier to Understand and Easier to Apply.
          </p>

          <p className="hero-desc text-ink-soft">
            From building a career in psychology to understanding the relationships, parenting
            experiences and everyday behaviours that shape our lives, I create psychology-based
            content, guidance and learning experiences that connect psychology with real life.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link
              className="btn hero-btn hero-btn-primary"
              to="/services"
            >
              Explore My Work <span className="hero-arrow">→</span>
            </Link>
            <Link
              className="btn hero-btn hero-btn-ghost"
              to="/work-with-me"
            >
              Work With Me
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@500;600;700;800&family=Quicksand:wght@600;700&display=swap');

        /* ---------- Fonts ---------- */
        .hero-banner .hero-title   { font-family: 'Fredoka', 'Quicksand', system-ui, sans-serif; font-weight: 600; letter-spacing: -.01em; }
        .hero-banner .hero-tagline { font-family: 'Nunito', 'Quicksand', system-ui, sans-serif; font-weight: 800; }
        .hero-banner .hero-desc    { font-family: 'Nunito', system-ui, sans-serif; font-weight: 500; }
        .hero-banner .hero-eyebrow { font-family: 'Quicksand', 'Nunito', system-ui, sans-serif; font-weight: 700; text-transform: none; letter-spacing: .02em; }
        .hero-banner .hero-btn     { font-family: 'Nunito', system-ui, sans-serif; font-weight: 800; }

        /* ---------- Base (phones): image fills the banner, text on top of it ---------- */
        .hero-banner { min-height: 620px; display: flex; align-items: flex-start; }
        .hero-art {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: 58% center; z-index: 1;
        }
        .hero-wash {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(to right,
            rgba(255,247,240,.96) 0%, rgba(255,247,240,.86) 55%, rgba(255,247,240,.35) 100%);
        }
        .hero-text {
          position: relative; z-index: 3; width: 92%;
          padding: 28px 20px 32px; display: flex; flex-direction: column;
        }
        .hero-eyebrow { font-size: .62rem; padding: 5px 11px; margin-bottom: 14px; letter-spacing: .01em; }
        .hero-title   { font-size: clamp(2.1rem, 9vw, 3rem); line-height: 1.05; margin-bottom: 14px; }
        .hero-tagline { font-size: 1.1rem; line-height: 1.35; margin-bottom: 10px; max-width: 34ch; }
        .hero-desc    { font-size: .92rem; line-height: 1.65; margin-bottom: 20px; max-width: 50ch; }
        .hero-btn     { font-size: .95rem; padding: 12px 22px; }

        /* ---------- Tablets ---------- */
        @media (min-width: 640px) {
          .hero-banner { min-height: 560px; }
          .hero-art { object-position: 70% center; }
          .hero-wash {
            background: linear-gradient(to right,
              rgba(255,247,240,.95) 0%, rgba(255,247,240,.8) 45%, rgba(255,247,240,0) 80%);
          }
          .hero-text { width: 62%; padding: 36px 32px 36px 36px; }
          .hero-title { font-size: clamp(2.4rem, 6vw, 3.4rem); }
          .hero-tagline { font-size: 1.2rem; }
          .hero-desc { font-size: 1rem; }
        }

        /* ---------- Desktop: image pinned right at full height, text on the left ---------- */
        @media (min-width: 1024px) {
          .hero-banner { height: clamp(560px, 44vw, 900px); min-height: 0; align-items: flex-start; }
          .hero-art {
            inset: auto; top: 0; right: 0; width: auto; height: 100%; max-width: none;
            object-fit: fill;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 22%);
                    mask-image: linear-gradient(to right, transparent 0%, #000 22%);
          }
          .hero-wash { display: none; }
          .hero-text { width: 47%; padding: 3vw 0 0 2.5vw; }
          .hero-eyebrow { font-size: .72rem; padding: 6px 14px; margin-bottom: 16px; }
          .hero-title   { font-size: clamp(2.8rem, 5.2vw, 5rem); margin-bottom: 16px; }
          .hero-tagline { font-size: clamp(1.2rem, 1.9vw, 1.8rem); margin-bottom: 12px; }
          .hero-desc    { font-size: clamp(1rem, 1.35vw, 1.3rem); line-height: 1.6; margin-bottom: 24px; }
          .hero-btn     { font-size: 1.1rem; padding: 14px 28px; }
        }

        /* ---------- Text animations ---------- */
        @keyframes heroUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-text > * { opacity: 0; animation: heroUp .85s cubic-bezier(.2,.7,.2,1) forwards; }
        .hero-text > *:nth-child(1) { animation-delay: .10s; }
        .hero-text > *:nth-child(2) { animation-delay: .25s; }
        .hero-text > *:nth-child(3) { animation-delay: .42s; }
        .hero-text > *:nth-child(4) { animation-delay: .58s; }
        .hero-text > *:nth-child(5) { animation-delay: .75s; }

        /* "Prateek": static brand gradient, no animation */
        .hero-name-accent {
          display: inline-block; white-space: nowrap;
          color: #f0305a;
          background: linear-gradient(90deg, #f0305a 0%, #ff5a4f 55%, #ff8a3c 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ---------- Buttons: glassmorphism ---------- */
        .hero-banner .hero-btn {
          display: inline-flex; align-items: center; gap: 8px;
          border-radius: 999px; font-weight: 800; letter-spacing: .01em;
          text-decoration: none; position: relative;
          -webkit-backdrop-filter: blur(12px) saturate(170%);
                  backdrop-filter: blur(12px) saturate(170%);
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease;
        }
        .hero-banner .hero-btn-primary {
          color: #fff;
          background: linear-gradient(135deg, rgba(255,61,110,.82), rgba(255,122,69,.78));
          border: 1px solid rgba(255,255,255,.6);
          box-shadow:
            0 12px 28px -12px rgba(255,61,110,.65),
            inset 0 1px 0 rgba(255,255,255,.65),
            inset 0 -1px 0 rgba(255,255,255,.12);
          text-shadow: 0 1px 2px rgba(160,20,60,.25);
        }
        .hero-banner .hero-btn-primary:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, rgba(255,61,110,.95), rgba(255,122,69,.9));
          box-shadow:
            0 18px 34px -12px rgba(255,61,110,.7),
            inset 0 1px 0 rgba(255,255,255,.75);
        }
        .hero-banner .hero-btn-ghost {
          color: #d62a56;
          background: rgba(255,255,255,.42);
          border: 1px solid rgba(255,255,255,.85);
          box-shadow:
            0 10px 26px -14px rgba(120,60,80,.45),
            inset 0 1px 0 rgba(255,255,255,.9);
        }
        .hero-banner .hero-btn-ghost:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,.68);
          box-shadow:
            0 16px 30px -14px rgba(120,60,80,.5),
            inset 0 1px 0 #fff;
        }
        .hero-banner .hero-arrow { display: inline-block; transition: transform .25s ease; }
        .hero-banner .hero-btn:hover .hero-arrow { transform: translateX(5px); }

        @media (prefers-reduced-motion: reduce) {
          .hero-text > * { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </section>
  );
}