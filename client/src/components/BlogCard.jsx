import { Link } from "react-router-dom";
import { BG } from "../constants.js";
import { formatDate } from "../api.js";

export default function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="course-card group">
      <div className={`course-top ${BG[post.color] || "bg-coral"}`}>
        <span className="course-tag">{post.category}</span>
        <span className="text-[2.4rem]">{post.icon}</span>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <span className="text-[.78rem] text-ink-soft">{formatDate(post.createdAt)}</span>
        <h3 className="text-[1.15rem] font-bold group-hover:text-coral-deep transition-colors">
          {post.title}
        </h3>
        <p className="text-[.9rem] text-ink-soft flex-1">{post.excerpt}</p>
        <span className="font-quicksand font-bold text-coral-deep text-[.9rem] mt-1">
          Read more →
        </span>
      </div>
    </Link>
  );
}
