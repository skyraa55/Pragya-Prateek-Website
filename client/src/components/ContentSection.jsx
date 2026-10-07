import { useSite } from "../useSite.js";

export default function ContentSection() {
  const SITE = useSite();
  return (
    <section className="py-16" id="content">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[60ch] mx-auto mb-10">
          <span className="eyebrow">Content</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Find Me Online</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
          <div className="service-card" id="youtube">
            <span className="service-ic bg-coral">▶</span>
            <h3 className="text-[1.2rem] font-bold mb-1">YouTube — {SITE.youtubeName}</h3>
            <p className="font-quicksand font-bold text-coral-deep text-[.95rem] mb-2">
              A dedicated space for psychology students and aspiring psychology professionals.
            </p>
            <p className="text-[.95rem] text-ink-soft mb-4">
              On YouTube, I cover psychology career options, education pathways, emerging fields,
              professional skills, earning ideas and practical career guidance.
            </p>
            <a className="btn btn-primary !px-5 !py-2.5 !text-[.9rem]" href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer">
              Watch on YouTube →
            </a>
          </div>

          <div className="service-card" id="instagram">
            <span className="service-ic bg-lav">◎</span>
            <h3 className="text-[1.2rem] font-bold mb-1">
              Instagram{SITE.instagramHandle ? ` — ${SITE.instagramHandle}` : ""}
            </h3>
            <p className="font-quicksand font-bold text-coral-deep text-[.95rem] mb-2">A more everyday side of psychology.</p>
            <p className="text-[.95rem] text-ink-soft mb-2">
              On Instagram, I explore parenting, relationships, generational differences and the
              psychological patterns we observe in everyday life.
            </p>
            <p className="text-[.95rem] text-ink-soft mb-4">
              The goal isn't to turn every experience into a diagnosis but to encourage curiosity,
              reflection and a better understanding of human behaviour.
            </p>
            {SITE.instagramUrl && (
              <a className="btn btn-primary !px-5 !py-2.5 !text-[.9rem]" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
                Follow on Instagram →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
