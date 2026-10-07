import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToHash from "./components/ScrollToHash.jsx";
import Home from "./pages/Home.jsx";
import BlogList from "./pages/BlogList.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Admin from "./pages/Admin.jsx";
import Workshops from "./pages/Workshops.jsx";
import ProfessionalGuidance from "./pages/ProfessionalGuidance.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import WorkWithMePage from "./pages/WorkWithMePage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import ContentPage from "./pages/ContentPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import BookPage from "./pages/BookPage.jsx";

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/work-with-me" element={<WorkWithMePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/professional-guidance" element={<ProfessionalGuidance />} />
        {/* Private page for the site owner — not linked anywhere on the public site */}
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <section className="py-24 text-center">
              <h1 className="text-3xl font-bold mb-2">Page not found</h1>
              <a className="btn btn-primary mt-4" href="/">Back home</a>
            </section>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
