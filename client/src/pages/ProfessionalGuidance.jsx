import { useEffect } from "react";
import { Link } from "react-router-dom";

const topics = [
  { icon: "✍️", title: "Educational content creation" },
  { icon: "▶", title: "YouTube and Instagram presence" },
  { icon: "🏷️", title: "Personal branding" },
  { icon: "🗣️", title: "Communicating psychology online" },
  { icon: "🗺️", title: "Building a content strategy" },
  { icon: "💼", title: "Developing your professional presence" },
  { icon: "🌱", title: "Understanding how to start and structure your online work" },
];

export default function ProfessionalGuidance() {
  useEffect(() => { document.title = "Professional Growth Guidance — Pragya Prateek"; }, []);
  return (
    <section className="py-14 min-h-[70vh]">
      <div className="w-[92%] max-w-[900px] mx-auto">
        <Link to="/services" className="text-coral-deep font-quicksand font-bold text-[.9rem]">← Back to Services</Link>
        <div className="text-center max-w-[62ch] mx-auto my-8">
          <span className="eyebrow">Professional Growth Guidance</span>
          <h1 className="text-[clamp(1.9rem,5vw,2.8rem)] font-bold">Want to Start and Grow Your Work in Mental Health Space?</h1>
          <p className="text-ink-soft text-[1.05rem] mt-3">
            Having the qualification is one part of building a professional career. Understanding
            how to communicate your expertise, create useful educational content and build a
            professional presence digitally is another. I offer practical guidance for psychology
            or mental-health freshers or professionals who want to explore these areas step by step.
          </p>
        </div>

        <h2 className="text-[1.4rem] font-bold mb-4">This may include guidance around:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {topics.map((t) => (
            <div key={t.title} className="contact-card flex gap-3 items-center">
              <span className="feat-ic bg-coral">{t.icon}</span>
              <b className="font-quicksand">{t.title}</b>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/book" className="btn btn-primary">Start Your Growth Plan →</Link>
        </div>
      </div>
    </section>
  );
}
