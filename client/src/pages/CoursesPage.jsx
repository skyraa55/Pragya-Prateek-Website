import { Link } from "react-router-dom";
import Courses from "../components/Courses.jsx";
import { useCourses } from "../useCourses.js";
import { usePageTitle } from "../usePageTitle.js";

export default function CoursesPage() {
  usePageTitle("Courses");
  const { courses, error } = useCourses();
  const hasCourses = !!courses && courses.length > 0;

  return (
    <div className="min-h-[70vh]">
      {hasCourses ? (
        <Courses />
      ) : (
        <section className="py-24 text-center">
          <div className="w-[92%] max-w-[600px] mx-auto">
            <span className="eyebrow">Courses</span>
            <h1 className="text-[clamp(1.7rem,5vw,2.4rem)] font-bold mb-2">
              {courses === null && !error ? "Loading…" : "Courses are coming soon"}
            </h1>
            {(courses !== null || error) && (
              <>
                <p className="text-ink-soft mb-5">New courses will appear here as soon as they are published.</p>
                <Link to="/" className="btn btn-primary">Back home</Link>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
