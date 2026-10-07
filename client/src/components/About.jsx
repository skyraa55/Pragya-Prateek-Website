import PhotoSlot from "./PhotoSlot.jsx";

const degrees = [
  "Master's in Social Work in Counselling; with a focus on Mental Health",
  "Master's in Psychology",
  "Diploma in Expressive Arts Therapies",
];
const studentQuestions = [
  "What can I actually do with or after my psychology degree?",
  "Which career path should I explore?",
  "Do I need another degree or specialisation?",
  "What skills should I develop?",
  "How can I create multiple earning options in this field?",
  "How do I build a meaningful career in psychology?",
];

export default function About() {
  return (
    <section className="pt-10 pb-6 overflow-hidden" id="about">
      <div className="w-[92%] max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
        <div className="relative grid place-items-center">
          <span className="blob !bg-gradient-to-br !from-sage !to-sun !opacity-85" />
          <PhotoSlot
            src="/pragya-about.jpg"
            alt="Pragya Prateek"
            className="!max-w-full aspect-square !rounded-[44%_40%_42%_46%/42%_46%_40%_44%]"
            hint={<>Add a candid / working photo here<br />(public/pragya-about.jpg)</>}
          />
        </div>

        <div>
          <span className="eyebrow">About / Who Am I?</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-2">Psychology, for me, is more than a profession.</h2>
          <p className="text-ink-soft text-[1.05rem] max-w-[58ch]">
            I am Pragya Prateek, a mental health educator and content creator with a simple goal:
            to make psychology easier to understand, more practical and more relevant to everyday life.
          </p>
          <p className="text-ink-soft text-[1.05rem] max-w-[58ch] mt-3">
            My journey in psychology has taken me through academic learning, professional
            experience, content creation and continuous exploration of how psychological knowledge
            can be applied beyond traditional settings.
          </p>
          <p className="text-ink-soft text-[1.05rem] max-w-[58ch] mt-3">
            Over time, I found myself particularly drawn to two questions:
          </p>
          <ol className="mt-3 flex flex-col gap-2 max-w-[58ch]">
            <li className="flex gap-3 items-start">
              <span className="feat-ic bg-coral font-quicksand font-bold">1</span>
              <span className="text-ink-soft">How can psychology students make better-informed career decisions to become successful in this field?</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="feat-ic bg-sage font-quicksand font-bold">2</span>
              <span className="text-ink-soft">How can psychological knowledge help us better understand the everyday experiences that shape our relationships, families, parenthood and personal space?</span>
            </li>
          </ol>
          <p className="text-ink-soft mt-3">These questions continue to shape the work I do today.</p>
        </div>
      </div>

      <div className="w-[92%] max-w-[1120px] mx-auto mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional background */}
        <div className="contact-card">
          <h3 className="text-[1.3rem] font-bold mb-3">My Professional Background</h3>
          <p className="font-quicksand font-semibold mb-2">My academic background includes:</p>
          <ul className="flex flex-col gap-2 mb-4">
            {degrees.map((d) => (
              <li key={d} className="flex gap-2 items-start text-ink-soft">
                <span className="text-coral-deep">🎓</span> {d}
              </li>
            ))}
          </ul>
          <p className="text-ink-soft">
            Alongside my formal education, I have continued to develop my skills through
            professional projects, workshops, content creation and independent learning.
          </p>
          <p className="text-ink-soft mt-3">
            My work and areas of experience include mental health education, student guidance,
            mental-wellbeing content, parenting, everyday relationships, expressive arts and
            professional content development.
          </p>
        </div>

        {/* My approach */}
        <div className="contact-card bg-gradient-to-br from-[#eef4ff] to-[#fbf0ff] border-0">
          <h3 className="text-[1.3rem] font-bold mb-3">My Approach</h3>
          <p className="text-ink-soft">
            I don't believe psychology should be made unnecessarily complicated to sound professional.
          </p>
          <p className="text-ink-soft mt-3">
            At the same time, simplifying psychology shouldn't mean oversimplifying it.
          </p>
          <p className="text-ink-soft mt-3">
            My approach is to bring together psychological knowledge, practical examples and
            real-world context so that the information is both accessible and responsible.
          </p>
          <p className="text-ink-soft mt-3">
            Whether I am discussing a psychology career or an everyday
            relationship/parenting/generational concern, the aim remains the same:
          </p>
          <p className="font-quicksand font-bold text-[1.15rem] text-coral-deep mt-3">
            Understand first. Think critically. Then decide what works for you.
          </p>
        </div>

        {/* Why I created these spaces */}
        <div className="contact-card lg:col-span-2">
          <h3 className="text-[1.3rem] font-bold mb-3">Why I Created These Spaces?</h3>
          <p className="text-ink-soft max-w-[80ch]">
            Psychology can be relevant to so many different parts of our lives but the questions
            we ask can be very different depending on where we are in our journey.
          </p>
          <p className="font-quicksand font-semibold mt-4 mb-2">As a psychology student, you may be wondering:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-5">
            {studentQuestions.map((q) => (
              <li key={q} className="flex gap-2 items-start text-ink-soft">
                <span className="text-coral-deep">•</span> {q}
              </li>
            ))}
          </ul>
          <p className="text-ink-soft max-w-[80ch]">
            I created the YouTube channel <em>The Art of Mindful Thinking</em> to make these
            questions easier to answer. It is focused on psychology students, aspiring
            professionals and career guidance by covering psychology career paths, education,
            emerging areas, professional skills, earning options and practical steps for building
            a career in the field.
          </p>
          <p className="text-ink-soft max-w-[80ch] mt-3">
            But psychology doesn't stop with our education or profession. It also shapes the way
            we communicate, parent, build relationships and understand people from different
            generations. That is why I have also created a dedicated Instagram space with a
            different focus for exploring parenting, relationships, generational differences and
            the psychology behind the everyday situations we experience.
          </p>
          <p className="text-ink-soft max-w-[80ch] mt-3">
            While the two platforms have different focuses, they come from the same belief:
          </p>
          <blockquote className="border-l-4 border-coral pl-4 my-4 font-quicksand font-bold text-[1.15rem] max-w-[70ch]">
            “Psychology becomes truly meaningful when we can connect what we learn with how we actually live.”
          </blockquote>
          <p className="text-ink-soft max-w-[80ch]">
            Whether you are trying to find your direction as a psychology student or simply trying
            to understand the people and relationships around you a little better, I hope these
            spaces help you understand, reflect and make more informed choices.
          </p>
        </div>
      </div>
    </section>
  );
}
