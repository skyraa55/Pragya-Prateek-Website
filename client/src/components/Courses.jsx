import { Link } from "react-router-dom";
import { BG } from "../constants.js";
import { useCourses } from "../useCourses.js";

const topics = [
  "Psychology Careers",
  "Professional Development",
  "Content Creation",
  "Everyday Psychology",
  "Relationships",
  "Parenting",
  "Earning Ideas in Psychology Field",
  "Other practical psychology-based topics",
];

// Hidden completely until the owner adds at least one course in the admin dashboard.
export default function Courses() {
  const { courses } = useCourses();
  if (!courses || courses.length === 0) return null;

  return (
    <section className="py-16" id="courses">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[62ch] mx-auto mb-8">
          <span className="eyebrow">Courses</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Learn at Your Own Pace</h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Psychology is a field of continuous learning. Through online courses and structured
            learning resources, I aim to make useful mental health career, everyday psychology
            related knowledge and professional guidance more accessible.
          </p>
          <p className="font-quicksand font-semibold mt-4 mb-2">Courses may cover areas related to:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {topics.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          <p className="text-ink-soft mt-4">New courses and learning resources keep on being added here.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.id} className="course-card">
              <div className={`course-top ${BG[c.color] || "bg-coral"}`}>
                <span className="course-tag">{c.tag}</span>
                <span className="text-[2.4rem]">{c.icon}</span>
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="text-[1.15rem] font-bold">{c.title}</h3>
                <p className="text-[.9rem] text-ink-soft flex-1">{c.desc}</p>
                <div className="flex justify-between items-center mt-2.5">
                  <span className="font-quicksand font-bold text-coral-deep">{c.price || "Enquire for price"}</span>
                  {c.link ? (
                    <a className="btn btn-line !px-4 !py-2 !text-[.85rem]" href={c.link} target="_blank" rel="noopener noreferrer">
                      Explore Courses
                    </a>
                  ) : (
                    <Link className="btn btn-line !px-4 !py-2 !text-[.85rem]" to="/book">Enquire</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
