import { Link } from "react-router-dom";

const areas = [
  { bg: "bg-lav", icon: "🧩", title: "Workshops & Programs", desc: "Psychology-based awareness and developmental workshops." },
  { bg: "bg-coral", icon: "✍️", title: "Educational Content", desc: "Mental health-focused content, scripts, blogs, articles and educational projects." },
  { bg: "bg-sage", icon: "💼", title: "Professional Projects", desc: "Projects related to psychology career and professional development." },
  { bg: "bg-sun", icon: "🤝", title: "Content Collaborations", desc: "Relevant collaborations across YouTube, Instagram and other digital platforms." },
  { bg: "bg-coral", icon: "🌱", title: "Professional Guidance", desc: "Guidance for psychology and mental-health professionals exploring content creation, client conversion or digital presence." },
];

export default function WorkWithMe() {
  return (
    <section className="py-16" id="work">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[62ch] mx-auto mb-10">
          <span className="eyebrow">Work With Me</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Have an Idea, Project or Collaboration in Mind?</h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            I am open to working with individuals, educational institutions, organisations,
            mental-health professionals and relevant brands on projects that align with my areas of work.
          </p>
        </div>

        <h3 className="text-center text-[1.3rem] font-bold mb-5">Collaboration Areas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {areas.map((a, i) => (
            <div key={a.title} className="service-card">
              <span className={`service-ic ${a.bg}`}>{a.icon}</span>
              <h4 className="font-quicksand text-[1.1rem] font-bold mb-1.5">{i + 1}) {a.title}</h4>
              <p className="text-[.92rem] text-ink-soft">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-ink-soft mb-4">If you have an idea you would like to discuss, I would love to hear about it.</p>
          <Link className="btn btn-primary" to="/book">Let's Work Together →</Link>
        </div>
      </div>
    </section>
  );
}
