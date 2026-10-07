import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatDate } from "../api.js";
import { BG } from "../constants.js";

// Blog text is plain text: blank line = new paragraph, a line starting with "## " = heading.
// It is rendered as React text (never as raw HTML), so it can't inject scripts.
function Body({ text }) {
  return text
    .split(/\n{2,}/)
    .map((block, i) =>
      block.startsWith("## ") ? (
        <h2 key={i} className="text-[1.35rem] font-bold mt-8 mb-2">
          {block.slice(3)}
        </h2>
      ) : (
        <p key={i} className="mb-4 whitespace-pre-line text-[1.05rem] leading-[1.8]">
          {block}
        </p>
      )
    );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(null);
    setError("");
    api
      .getBlog(slug)
      .then((p) => {
        setPost(p);
        document.title = `${p.title} — Pragya Prateek`;
      })
      .catch((e) => setError(e.status === 404 ? "This post could not be found." : e.message));
  }, [slug]);

  return (
    <article className="py-12 min-h-[70vh]">
      <div className="w-[92%] max-w-[760px] mx-auto">
        <Link to="/blog" className="text-coral-deep font-quicksand font-bold text-[.9rem]">
          ← All posts
        </Link>

        {error && <p className="mt-8 text-ink-soft">{error}</p>}
        {!error && !post && <p className="mt-8 text-ink-soft">Loading…</p>}

        {post && (
          <>
            <div className={`${BG[post.color] || "bg-coral"} rounded-xl2 h-[150px] grid place-items-center text-[3.5rem] mt-5`}>
              {post.icon}
            </div>
            <div className="mt-6 flex items-center gap-3 text-[.85rem] text-ink-soft">
              <span className="chip">{post.category}</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <h1 className="text-[clamp(1.8rem,5vw,2.6rem)] font-bold mt-3 mb-6">{post.title}</h1>
            <Body text={post.content} />

            <div className="bg-white rounded-xl2 p-7 text-center shadow-soft mt-10">
              <h3 className="text-[1.2rem] font-bold mb-1">Want to talk this through?</h3>
              <p className="text-ink-soft mb-4">Book a one-on-one session, online, from anywhere.</p>
              <Link to="/book" className="btn btn-primary">
                Book a Session →
              </Link>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
