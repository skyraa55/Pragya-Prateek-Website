import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { readAll, update, newId } from "../utils/store.js";
import { clean, isHttpUrl, COLORS } from "../utils/validate.js";

const router = Router();

function parse(body) {
  const link = clean(body?.link, 500);
  const data = {
    title: clean(body?.title, 120),
    tag: clean(body?.tag, 30) || "Course",
    icon: clean(body?.icon, 8) || "🎓",
    color: COLORS.includes(body?.color) ? body.color : "coral",
    desc: clean(body?.desc, 500),
    price: clean(body?.price, 30),
    link: link && isHttpUrl(link) ? link : "",
  };
  if (!data.title) return { error: "Course title is required." };
  if (!data.desc) return { error: "Course description is required." };
  if (link && !data.link) return { error: "Enroll link must start with http:// or https://" };
  return { data };
}

// PUBLIC: list courses (oldest first, so the order she adds them is the order shown)
router.get("/", async (_req, res, next) => {
  try {
    res.json(await readAll("courses"));
  } catch (e) {
    next(e);
  }
});

// ADMIN ONLY: create
router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { data, error } = parse(req.body);
    if (error) return res.status(400).json({ error });
    const course = await update("courses", (items) => {
      const item = { id: newId(), ...data, createdAt: new Date().toISOString() };
      items.push(item);
      return item;
    });
    res.status(201).json(course);
  } catch (e) {
    next(e);
  }
});

// ADMIN ONLY: edit
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { data, error } = parse(req.body);
    if (error) return res.status(400).json({ error });
    const course = await update("courses", (items) => {
      const item = items.find((c) => c.id === req.params.id);
      if (!item) return null;
      Object.assign(item, data);
      return item;
    });
    if (!course) return res.status(404).json({ error: "Course not found." });
    res.json(course);
  } catch (e) {
    next(e);
  }
});

// ADMIN ONLY: delete
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const removed = await update("courses", (items) => {
      const i = items.findIndex((c) => c.id === req.params.id);
      if (i === -1) return false;
      items.splice(i, 1);
      return true;
    });
    if (!removed) return res.status(404).json({ error: "Course not found." });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
