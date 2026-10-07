import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { BLOG_CATEGORIES } from "../siteConfig.js";
import BlogCard from "./BlogCard.jsx";

export default function BlogPreview() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getBlogs().then((p) => setPosts(p.slice(0, 3))).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-cream to-[#fff5ee]" id="blog">
      <div className="w-[92%] max-w-[1120px] mx-auto">
        <div className="text-center max-w-[62ch] mx-auto mb-10">
          <span className="eyebrow">Blogs</span>
          <h2 className="text-[clamp(1.7rem,5vw,2.6rem)] font-bold mb-1">Mental Health, Careers &amp; Everyday Life</h2>
          <p className="text-ink-soft text-[1.05rem] mt-2 mx-auto">
            Sometimes you need more than a short video or social media post. The blog is a space
            for longer, detailed conversations around psychology, from building a career in the
            field to understanding the psychological experiences we encounter in everyday life.
          </p>
        </div>

        <h3 className="text-center text-[1.3rem] font-bold mb-5">Explore by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {BLOG_CATEGORIES.map((c, i) => (
            <Link key={c.name} to={`/blog?cat=${encodeURIComponent(c.name)}`} className="service-card block">
              <span className={`service-ic ${c.color}`}>{c.icon}</span>
              <h4 className="font-quicksand text-[1.1rem] font-bold mb-1.5">{i + 1}) {c.name}</h4>
              <p className="text-[.92rem] text-ink-soft">{c.desc}</p>
            </Link>
          ))}
        </div>

        {error && <p className="text-center text-ink-soft">{error}</p>}
        {!error && !posts && <p className="text-center text-ink-soft">Loading posts…</p>}
        {posts && posts.length === 0 && <p className="text-center text-ink-soft">New posts are coming soon. 🌿</p>}

        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => <BlogCard key={p.id} post={p} />)}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/blog" className="btn btn-line">Read the Blog →</Link>
        </div>
      </div>
    </section>
  );
}
