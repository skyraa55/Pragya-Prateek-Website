import Hero from "../components/Hero.jsx";
import Intro from "../components/Intro.jsx";
import BlogPreview from "../components/BlogPreview.jsx";
import FinalCTA from "../components/FinalCTA.jsx";
import { usePageTitle } from "../usePageTitle.js";

export default function Home() {
  usePageTitle("");
  return (
    <>
      <Hero />
      <Intro />
      <BlogPreview />
      <FinalCTA />
    </>
  );
}
