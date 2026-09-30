const services = [
  {
    bg: "bg-coral",
    icon: "🎓",
    title: "Career Guidance",
    desc: "1:1 mentoring on psychology degrees, specializations, eligibility and real career options.",
  },
  {
    bg: "bg-sage",
    icon: "🗣️",
    title: "Counselling & Support",
    desc: "A safe, judgement-free space to talk through stress, transitions and everyday challenges.",
  },
  {
    bg: "bg-lav",
    icon: "👨‍👩‍👧",
    title: "Parenting & Relationships",
    desc: "Understanding children and teens, and building calmer, stronger family bonds.",
  },
  {
    bg: "bg-sun",
    icon: "✨",
    title: "Personal Growth",
    desc: "Self-awareness, emotional wellbeing and mindful habits for a more intentional life.",
  },
];

export default function Services() {
  return (
    <section className="py-16 bg-gradient-to-b from-cream to-[#fff5ee]" id="services">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[60ch] mx-auto mb-10">
          <span className="eyebrow">Services Offered</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">
            How I can support you
          </h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Whether you're choosing a path in psychology or simply want to feel more grounded —
            there's something here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <div key={s.title} className="service-card">
              <span className={`service-ic ${s.bg}`}>{s.icon}</span>
              <h3 className="text-[1.15rem] font-bold mb-1.5">{s.title}</h3>
              <p className="text-[.92rem] text-ink-soft">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
