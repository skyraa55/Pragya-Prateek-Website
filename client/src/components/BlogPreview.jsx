import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import BlogCard from "./BlogCard.jsx";

// Latest 3 posts on the home page.
export default function BlogPreview() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getBlogs().then((p) => setPosts(p.slice(0, 3))).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-cream to-[#fff5ee]" id="blog">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[60ch] mx-auto mb-10">
          <span className="eyebrow">From the Blog</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Thoughts on the mindful mind</h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Short, practical reads on psychology, careers, parenting and everyday wellbeing.
          </p>
        </div>

        {error && <p className="text-center text-ink-soft">{error}</p>}
        {!error && !posts && <p className="text-center text-ink-soft">Loading posts…</p>}
        {posts && posts.length === 0 && (
          <p className="text-center text-ink-soft">New posts are coming soon. 🌿</p>
        )}

        {posts && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/blog" className="btn btn-line">
                View all posts →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
