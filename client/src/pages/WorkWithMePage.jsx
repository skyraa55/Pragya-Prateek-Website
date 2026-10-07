import WorkWithMe from "../components/WorkWithMe.jsx";
import { usePageTitle } from "../usePageTitle.js";

export default function WorkWithMePage() {
  usePageTitle("Work With Me");
  return (
    <div className="min-h-[70vh]">
      <WorkWithMe />
    </div>
  );
}
