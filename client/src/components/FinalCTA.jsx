import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#eef4ff] to-[#fbf0ff]">
      <div className="w-[92%] max-w-[760px] mx-auto text-center">
        <h2 className="text-[clamp(1.7rem,5vw,2.4rem)] font-bold mb-4">Wherever You Are in Your Journey, You Can Start Here.</h2>
        <p className="text-ink-soft text-[1.05rem]">Maybe you are a psychology student trying to understand what comes next.</p>
        <p className="text-ink-soft text-[1.05rem] mt-2">Maybe you are a professional trying to build your work.</p>
        <p className="text-ink-soft text-[1.05rem] mt-2">
          Or maybe you are simply curious about the psychology behind the people, relationships and experiences around you.
        </p>
        <p className="text-ink-soft text-[1.05rem] mt-4">
          Whatever brings you here, I hope you find something that helps you understand a little
          more, think a little deeper and move forward with greater clarity.
        </p>
        <div className="flex gap-3 justify-center flex-wrap mt-7">
          <Link className="btn btn-primary" to="/book">Book a Session →</Link>
          <Link className="btn btn-ghost" to="/contact">Get in Touch</Link>
        </div>
      </div>
    </section>
  );
}
