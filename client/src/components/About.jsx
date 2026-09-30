const features = [
  {
    bg: "bg-coral",
    icon: "🎓",
    title: "Career Clarity",
    desc: "Specializations, eligibility, courses, jobs & scope explained simply.",
  },
  {
    bg: "bg-sage",
    icon: "❤️",
    title: "Relationships",
    desc: "Parenting, communication and healthier human connections.",
  },
  {
    bg: "bg-lav",
    icon: "🧠",
    title: "Understanding You",
    desc: "Insight into your own thoughts, emotions and behaviour.",
  },
  {
    bg: "bg-sun",
    icon: "🌱",
    title: "Mindful Growth",
    desc: "Practical tools to feel calmer and live with intention.",
  },
];

export default function About() {
  return (
    <section className="pt-14 pb-4" id="about">
      <div className="w-[92%] max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
        <div className="relative grid place-items-center">
          <span className="blob !bg-gradient-to-br !from-sage !to-sun !opacity-85" />
          {/* ▼▼ REPLACE PHOTO (about section) ▼▼ */}
          <div className="photo-slot !max-w-full aspect-square !rounded-[44%_40%_42%_46%/42%_46%_40%_44%]">
            <div>
              <div className="text-[2rem] mb-1">📷</div>
              <small className="font-quicksand font-semibold text-[.8rem] leading-snug">
                Add a candid /<br />
                working photo here
              </small>
            </div>
          </div>
        </div>

        <div>
          <span className="eyebrow">What I Do</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">
            A friendly guide to the human mind
          </h2>
          <p className="text-ink-soft text-[1.05rem] max-w-[56ch]">
            Through my channel <em>The Art of Mindful Thinking</em>, I explore psychology,
            mental health and personal growth in a warm, down-to-earth way. My biggest mission
            is helping people who love psychology understand the field deeply — so they can
            make informed career and life decisions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-[.7rem] items-start">
                <span className={`feat-ic ${f.bg}`}>{f.icon}</span>
                <div>
                  <h4 className="font-quicksand text-base font-bold">{f.title}</h4>
                  <p className="text-[.9rem] text-ink-soft m-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
