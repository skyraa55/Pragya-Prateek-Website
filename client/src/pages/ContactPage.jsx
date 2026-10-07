import Contact from "../components/Contact.jsx";
import { usePageTitle } from "../usePageTitle.js";

export default function ContactPage() {
  usePageTitle("Contact");
  return (
    <div className="min-h-[70vh]">
      <Contact />
    </div>
  );
}
