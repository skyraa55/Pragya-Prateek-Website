import { Link } from "react-router-dom";
import { useSite } from "../useSite.js";

export default function Intro() {
  const SITE = useSite();
  return (
    <section className="pt-6 pb-14" id="intro">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[66ch] mx-auto mb-10">
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-3">Psychology Is More Than a Subject</h2>
          <p className="text-ink-soft text-[1.05rem]">
            Psychology isn't limited to textbooks, degrees or therapy rooms.
          </p>
          <p className="text-ink-soft text-[1.05rem] mt-3">
            It influences the way we learn, make decisions, choose careers, build relationships,
            communicate with one another and understand ourselves.
          </p>
          <p className="text-ink-soft text-[1.05rem] mt-3">
            Through my YouTube channel <em>{SITE.youtubeName}</em>, and my Instagram
            {SITE.instagramHandle ? ` (${SITE.instagramHandle})` : ""}, I explore psychology from
            both professional and everyday perspectives respectively, making information practical,
            understandable and relevant to real life.
          </p>
          <p className="font-quicksand font-bold mt-4">My content currently brings together two key areas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
          <div className="service-card">
            <span className="service-ic bg-coral">🎓</span>
            <h3 className="text-[1.2rem] font-bold mb-1.5">1) Psychology &amp; Career Guidance</h3>
            <p className="text-[.95rem] text-ink-soft mb-4">
              Helping psychology students and aspiring professionals understand their
              specialization options, multiple earning potential, develop relevant skills and make
              informed decisions about their career journey.
            </p>
            <Link className="btn btn-line !px-5 !py-2.5 !text-[.9rem]" to="/content#youtube">Explore Career Guidance →</Link>
          </div>
          <div className="service-card">
            <span className="service-ic bg-sage">💭</span>
            <h3 className="text-[1.2rem] font-bold mb-1.5">2) Everyday Psychology</h3>
            <p className="text-[.95rem] text-ink-soft mb-4">
              Exploring parenting, relationships, generational differences and the psychological
              patterns we come across in everyday life.
            </p>
            <Link className="btn btn-line !px-5 !py-2.5 !text-[.9rem]" to="/content#instagram">Explore Everyday Psychology →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
