import { useEffect, useState } from "react";
import { api } from "../api.js";
import BlogCard from "../components/BlogCard.jsx";

export default function BlogList() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    document.title = "Blog — Pragya Prateek";
    api.getBlogs().then(setPosts).catch((e) => setError(e.message));
  }, []);

  const categories = posts ? ["All", ...new Set(posts.map((p) => p.category))] : [];
  const shown = posts ? posts.filter((p) => cat === "All" || p.category === cat) : [];

  return (
    <section className="py-14 min-h-[70vh]">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[60ch] mx-auto mb-8">
          <span className="eyebrow">Blog</span>
          <h1 className="text-[clamp(1.9rem,5vw,2.8rem)] font-bold">Reads for a mindful life</h1>
        </div>

        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`chip cursor-pointer border-0 ${cat === c ? "!bg-ink !text-white" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-center text-ink-soft">{error}</p>}
        {!error && !posts && <p className="text-center text-ink-soft">Loading posts…</p>}
        {posts && shown.length === 0 && <p className="text-center text-ink-soft">No posts yet.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
