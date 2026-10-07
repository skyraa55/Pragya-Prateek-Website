import About from "../components/About.jsx";
import { usePageTitle } from "../usePageTitle.js";

export default function AboutPage() {
  usePageTitle("About");
  return (
    <div className="min-h-[70vh]">
      <About />
    </div>
  );
}
