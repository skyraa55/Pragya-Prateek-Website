export default function Hero() {
  return (
    <section
      className="relative pt-10 overflow-hidden bg-gradient-to-b from-sky1 via-sky2 to-cream"
      id="home"
    >
      <svg className="cloud w-[120px] top-[14%] left-[4%] animate-float" viewBox="0 0 200 90">
        <path d="M40 80c-22 0-40-15-40-33S18 14 40 14c4-8 14-14 26-14 15 0 28 10 31 24 18 1 33 15 33 33 0 18-16 33-36 33H40z" />
      </svg>
      <svg className="cloud w-[90px] top-[8%] right-[12%] animate-float-rev" viewBox="0 0 200 90">
        <path d="M40 80c-22 0-40-15-40-33S18 14 40 14c4-8 14-14 26-14 15 0 28 10 31 24 18 1 33 15 33 33 0 18-16 33-36 33H40z" />
      </svg>
      <svg className="cloud w-[70px] bottom-[26%] left-[44%] opacity-70 animate-float-slow" viewBox="0 0 200 90">
        <path d="M40 80c-22 0-40-15-40-33S18 14 40 14c4-8 14-14 26-14 15 0 28 10 31 24 18 1 33 15 33 33 0 18-16 33-36 33H40z" />
      </svg>

      <div className="w-[92%] max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center pb-20 relative z-[2]">
        <div>
          <span className="eyebrow">Psychologist • Educator • Mindful Living</span>
          <h1 className="text-[clamp(2.3rem,7vw,4rem)] font-bold my-1 mb-3">
            The Art of <span className="text-coral-deep relative">Mindful Thinking</span>
          </h1>
          <p className="text-ink-soft text-[1.12rem] max-w-[50ch] mb-6">
            Hello, beautiful souls! I'm Pragya Prateek. I help students, parents and curious
            minds understand psychology, make confident career choices in the field, and build a
            calmer, more intentional life.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a className="btn btn-primary" href="#book">
              Book a Session →
            </a>
            <a
              className="btn btn-ghost"
              href="https://youtube.com/@pragya_prateek_psychologist"
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ Watch on YouTube
            </a>
          </div>
          <div className="flex gap-2 flex-wrap mt-6">
            <span className="chip">🎓 Psychology Careers</span>
            <span className="chip">🧠 Human Behaviour</span>
            <span className="chip">❤️ Relationships & Parenting</span>
            <span className="chip">✨ Personal Growth</span>
          </div>
        </div>

        <div className="relative grid place-items-center order-first md:order-none mb-4 md:mb-0">
          <span className="blob" />
          {/* ▼▼ REPLACE PHOTO: swap this div's children for <img src="/pragya.jpg" alt="Pragya Prateek" /> ▼▼ */}
          <div className="photo-slot">
            <div>
              <div className="text-[2rem] mb-1">📷</div>
              <small className="font-quicksand font-semibold text-[.8rem] leading-snug">
                Add your portrait here
                <br />
                (square/4:5 works best)
              </small>
            </div>
          </div>
        </div>
      </div>

      <svg className="block w-full h-auto -mb-1.5" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path fill="#fef9f2" d="M0,48 C240,96 480,0 720,32 C960,64 1200,96 1440,40 L1440,90 L0,90 Z" />
      </svg>
    </section>
  );
}
