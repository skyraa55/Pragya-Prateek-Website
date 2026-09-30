import { useEffect, useState } from "react";
import { api } from "../api.js";
import { BG } from "../constants.js";

export default function Courses() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCourses().then(setCourses).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="py-16" id="courses">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[60ch] mx-auto mb-10">
          <span className="eyebrow">My Courses</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Learn at your own pace</h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Structured, easy-to-follow programs built from years of guiding psychology students and
            curious minds.
          </p>
        </div>

        {error && <p className="text-center text-ink-soft">{error}</p>}
        {!error && !courses && <p className="text-center text-ink-soft">Loading courses…</p>}
        {courses && courses.length === 0 && (
          <p className="text-center text-ink-soft">New courses are coming soon. 🌱</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((c) => (
            <div key={c.id} className="course-card">
              <div className={`course-top ${BG[c.color] || "bg-coral"}`}>
                <span className="course-tag">{c.tag}</span>
                <span className="text-[2.4rem]">{c.icon}</span>
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="text-[1.15rem] font-bold">{c.title}</h3>
                <p className="text-[.9rem] text-ink-soft flex-1">{c.desc}</p>
                <div className="flex justify-between items-center mt-2.5">
                  <span className="font-quicksand font-bold text-coral-deep">
                    {c.price || "Enquire for price"}
                  </span>
                  {c.link ? (
                    <a
                      className="btn btn-line !px-4 !py-2 !text-[.85rem]"
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enroll
                    </a>
                  ) : (
                    <a className="btn btn-line !px-4 !py-2 !text-[.85rem]" href="#book">
                      Enroll
                    </a>
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
