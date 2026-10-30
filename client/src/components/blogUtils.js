import { GraduationCap, Baby, HeartHandshake, Users, Brain, Sparkles } from "lucide-react";
import { BLOG_CATEGORIES } from "../siteConfig.js";

const ICONS = { GraduationCap, Baby, HeartHandshake, Users, Brain };

/* accent index + icon for a category (same icons as the "Explore by category" cards) */
export function categoryMeta(name) {
  const i = BLOG_CATEGORIES.findIndex((c) => c.name === name);
  const cat = i >= 0 ? BLOG_CATEGORIES[i] : null;
  return { index: i < 0 ? 0 : i, Icon: (cat && ICONS[cat.iconName]) || Sparkles };
}

/* plain text from the admin page: blank line = paragraph, "## " = heading */
export function textToBlocks(text = "") {
  return String(text)
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => (b.startsWith("## ") ? { t: "h", x: b.slice(3) } : { t: "p", x: b }));
}

export function getBlocks(post) {
  return post.blocks || textToBlocks(post.content);
}

export function readMinutes(post) {
  const text = post.blocks
    ? post.blocks.map((b) => `${b.h || ""} ${b.x}`).join(" ")
    : post.content || "";
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}