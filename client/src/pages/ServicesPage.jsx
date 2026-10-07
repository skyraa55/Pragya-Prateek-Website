import Services from "../components/Services.jsx";
import { usePageTitle } from "../usePageTitle.js";

export default function ServicesPage() {
  usePageTitle("Services");
  return (
    <div className="min-h-[70vh]">
      <Services />
    </div>
  );
}
