import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../useSite.js";

const audiences = ["Educational institutions", "Student groups", "Organisations", "Communities", "Professional groups", "Other relevant audiences"];

export default function Workshops() {
  const { workshops: WORKSHOPS } = useSite();
  useEffect(() => { document.title = "Workshops & Programs — Pragya Prateek"; }, []);
  const slots = WORKSHOPS.photos.length ? WORKSHOPS.photos : [null, null, null];

  return (
    <section className="py-14 min-h-[70vh]">
      <div className="w-[92%] max-w-[1000px] mx-auto">
        <Link to="/services" className="text-coral-deep font-quicksand font-bold text-[.9rem]">← Back to Services</Link>
        <div className="text-center max-w-[62ch] mx-auto my-8">
          <span className="eyebrow">Workshops &amp; Programs</span>
          <h1 className="text-[clamp(1.9rem,5vw,2.8rem)] font-bold">Learning Psychology Through Experience</h1>
          <p className="text-ink-soft text-[1.05rem] mt-3">
            Workshops can create a different kind of learning experience: one that is interactive,
            practical and easier to connect with real life. I design and facilitate psychology-based
            workshops and learning experiences around relevant personal, educational and
            professional-development themes.
          </p>
        </div>

        <h2 className="text-[1.4rem] font-bold mb-4">Workshop Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {slots.map((src, i) =>
            src ? (
              <img key={i} src={src} alt={`Workshop ${i + 1}`} className="rounded-xl2 w-full aspect-[4/3] object-cover shadow-soft-sm" />
            ) : (
              <div key={i} className="rounded-xl2 aspect-[4/3] bg-white shadow-soft-sm grid place-items-center text-ink-soft text-center p-4">
                <div><div className="text-[2rem]">📷</div><small className="font-quicksand font-semibold">Workshop photos coming soon</small></div>
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="contact-card">
            <h2 className="text-[1.25rem] font-bold mb-2">Workshop Themes</h2>
            <p className="text-ink-soft whitespace-pre-line">{WORKSHOPS.themes || "Workshop themes and details will be shared here soon."}</p>
          </div>
          <div className="contact-card">
            <h2 className="text-[1.25rem] font-bold mb-2">Sample Workshop Design</h2>
            <p className="text-ink-soft whitespace-pre-line">{WORKSHOPS.sampleDesign || "A sample workshop design will be shared here soon."}</p>
          </div>
        </div>

        <div className="contact-card mb-10">
          <h2 className="text-[1.25rem] font-bold mb-2">Workshops can be developed for:</h2>
          <div className="flex flex-wrap gap-2">{audiences.map((a) => <span key={a} className="chip">{a}</span>)}</div>
        </div>

        <div className="text-center">
          <Link to="/book" className="btn btn-primary">Discuss Your Workshop →</Link>
        </div>
      </div>
    </section>
  );
}
