import ContentSection from "../components/ContentSection.jsx";
import { usePageTitle } from "../usePageTitle.js";

export default function ContentPage() {
  usePageTitle("Content");
  return (
    <div className="min-h-[70vh]">
      <ContentSection />
    </div>
  );
}
