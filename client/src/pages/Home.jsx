import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Services from "../components/Services.jsx";
import Courses from "../components/Courses.jsx";
import BlogPreview from "../components/BlogPreview.jsx";
import Book from "../components/Book.jsx";
import Contact from "../components/Contact.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Courses />
      <BlogPreview />
      <Book />
      <Contact />
    </>
  );
}
