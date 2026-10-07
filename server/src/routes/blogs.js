import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { readAll, update, newId, slugify } from "../utils/store.js";
import { clean, COLORS } from "../utils/validate.js";

const router = Router();

function parse(body) {
  const color = COLORS.includes(body?.color) ? body.color : "coral";
  const data = {
    title: clean(body?.title, 150),
    excerpt: clean(body?.excerpt, 300),
    category: clean(body?.category, 40) || "Everyday Psychology",
    icon: clean(body?.icon, 8) || "📝",
    color,
    content: clean(body?.content, 50000),
    published: body?.published !== false,
  };
  if (!data.title) return { error: "Title is required." };
  if (!data.content) return { error: "Blog content is required." };
  if (!data.excerpt) data.excerpt = data.content.replace(/\s+/g, " ").slice(0, 160) + "…";
  return { data };
}

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

// PUBLIC: published posts (list view doesn't send the full text)
router.get("/", async (_req, res, next) => {
  try {
    const posts = (await readAll("blogs")).filter((p) => p.published).sort(byNewest);
    res.json(posts.map(({ content, ...rest }) => rest));
  } catch (e) {
    next(e);
  }
});

// ADMIN: everything including drafts (must be declared before "/:slug")
router.get("/admin/all", requireAdmin, async (_req, res, next) => {
  try {
    res.json((await readAll("blogs")).sort(byNewest));
  } catch (e) {
    next(e);
  }
});

// PUBLIC: one post
router.get("/:slug", async (req, res, next) => {
  try {
    const post = (await readAll("blogs")).find((p) => p.slug === req.params.slug && p.published);
    if (!post) return res.status(404).json({ error: "Blog not found." });
    res.json(post);
  } catch (e) {
    next(e);
  }
});

// ADMIN ONLY: create
router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { data, error } = parse(req.body);
    if (error) return res.status(400).json({ error });

    const post = await update("blogs", (items) => {
      let slug = slugify(data.title);
      const base = slug;
      let n = 2;
      while (items.some((p) => p.slug === slug)) slug = `${base}-${n++}`;
      const now = new Date().toISOString();
      const item = { id: newId(), slug, ...data, createdAt: now, updatedAt: now };
      items.push(item);
      return item;
    });
    res.status(201).json(post);
  } catch (e) {
    next(e);
  }
});

// ADMIN ONLY: edit
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { data, error } = parse(req.body);
    if (error) return res.status(400).json({ error });

    const post = await update("blogs", (items) => {
      const item = items.find((p) => p.id === req.params.id);
      if (!item) return null;
      Object.assign(item, data, { updatedAt: new Date().toISOString() }); // slug stays stable
      return item;
    });
    if (!post) return res.status(404).json({ error: "Blog not found." });
    res.json(post);
  } catch (e) {
    next(e);
  }
});

// ADMIN ONLY: delete
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const removed = await update("blogs", (items) => {
      const i = items.findIndex((p) => p.id === req.params.id);
      if (i === -1) return false;
      items.splice(i, 1);
      return true;
    });
    if (!removed) return res.status(404).json({ error: "Blog not found." });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
