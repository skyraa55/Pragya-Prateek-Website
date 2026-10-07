import { Link } from "react-router-dom";
import { useSite } from "../useSite.js";

const buildServices = (guidanceHref) => [
  {
    bg: "bg-coral",
    icon: "🎓",
    title: "One-to-One Psychology Career Guidance Sessions",
    tagline: "Sometimes General Information Isn't Enough.",
    paras: [
      "There is plenty of information available online but your situation is unique.",
      "A 1:1 session gives us the opportunity to look at your background, your goals, your questions and your current situation and work towards greater clarity about your next steps.",
      "If you are a psychology student, recent graduate or someone considering a career in psychology in future, personalised guidance can help you understand your options and identify the next steps that make sense for your goals.",
    ],
    listTitle: "Guidance can include:",
    items: [
      "Understanding career pathways in psychology",
      "Exploring specialisations and emerging fields",
      "Choosing further education",
      "Identifying relevant skills",
      "Understanding professional opportunities",
      "Planning your next steps after degree",
      "Creating a practical career roadmap",
    ],
    buttons: [{ label: "Find Your Next Step →", to: "/book", primary: true }],
  },
  {
    bg: "bg-lav",
    icon: "🧩",
    title: "Workshops & Programs",
    tagline: "Learning Psychology Through Experience",
    paras: [
      "Workshops can create a different kind of learning experience: one that is interactive, practical and easier to connect with real life.",
      "I design and facilitate psychology-based workshops and learning experiences around relevant personal, educational and professional-development themes.",
    ],
    listTitle: "These can be developed for:",
    items: ["Educational institutions", "Student groups", "Organisations", "Communities", "Professional groups", "Other relevant audiences"],
    buttons: [
      { label: "Explore Workshops →", to: "/workshops" },
      { label: "Discuss Your Workshop →", to: "/book", primary: true },
    ],
  },
  {
    bg: "bg-sage",
    icon: "🌱",
    title: "Professional Growth Guidance",
    tagline: "Want to Start and Grow Your Work in Mental Health Space?",
    paras: [
      "Having the qualification is one part of building a professional career.",
      "Understanding how to communicate your expertise, create useful educational content and build a professional presence digitally is another.",
      "I offer practical guidance for psychology or mental-health freshers or professionals who want to explore these areas step by step.",
    ],
    listTitle: "This may include guidance around:",
    items: [
      "Educational content creation",
      "YouTube and Instagram presence",
      "Personal branding",
      "Communicating psychology online",
      "Building a content strategy",
      "Developing your professional presence",
      "Understanding how to start and structure your online work",
    ],
    buttons: [
      guidanceHref
        ? { label: "Explore Professional Guidance →", href: guidanceHref, external: true }
        : { label: "Explore Professional Guidance →", to: "/professional-guidance" },
      { label: "Start Your Growth Plan →", to: "/book", primary: true },
    ],
  },
];

function Btn({ b }) {
  const cls = `btn ${b.primary ? "btn-primary" : "btn-line"} !px-5 !py-2.5 !text-[.9rem]`;
  if (b.to) return <Link className={cls} to={b.to}>{b.label}</Link>;
  return (
    <a className={cls} href={b.href} {...(b.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {b.label}
    </a>
  );
}

export default function Services() {
  const SITE = useSite();
  const services = buildServices(SITE.professionalGuidanceDocUrl);
  return (
    <section className="py-16 bg-gradient-to-b from-cream to-[#fff5ee]" id="services">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[62ch] mx-auto mb-10">
          <span className="eyebrow">Services</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Ways We Can Work Together!</h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Whether you are trying to understand your psychology career, looking for personalised
            guidance, planning a workshop or exploring ways to build your professional or digital
            presence, there are different ways we can work together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={s.title} className="service-card flex flex-col">
              <span className={`service-ic ${s.bg}`}>{s.icon}</span>
              <h3 className="text-[1.15rem] font-bold">
                {i + 1}) {s.title}
              </h3>
              <p className="font-quicksand font-bold text-coral-deep text-[.95rem] mt-1 mb-3">{s.tagline}</p>
              {s.paras.map((p) => (
                <p key={p} className="text-[.92rem] text-ink-soft mb-2.5">{p}</p>
              ))}
              <p className="font-quicksand font-semibold text-[.92rem] mt-2 mb-1.5">{s.listTitle}</p>
              <ul className="flex flex-col gap-1 mb-5 flex-1">
                {s.items.map((it) => (
                  <li key={it} className="text-[.9rem] text-ink-soft flex gap-2 items-start">
                    <span className="text-coral-deep">✓</span> {it}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2.5">
                {s.buttons.map((b) => <Btn key={b.label} b={b} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
