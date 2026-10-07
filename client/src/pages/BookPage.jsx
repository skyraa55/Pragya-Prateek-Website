import Book from "../components/Book.jsx";
import { usePageTitle } from "../usePageTitle.js";

export default function BookPage() {
  usePageTitle("Book a Session");
  return (
    <div className="min-h-[70vh]">
      <Book />
    </div>
  );
}
