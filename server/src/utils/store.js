// Tiny JSON-file "database". Perfect for one owner + a few dozen posts/courses.
// Writes are serialized and atomic (write temp file, then rename) so data never gets corrupted.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "data");

let queue = Promise.resolve();

export async function readAll(name) {
  try {
    const raw = await fs.readFile(path.join(dir, `${name}.json`), "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

// Run a read-modify-write cycle one at a time so two requests can't overwrite each other.
export function update(name, mutator) {
  const run = queue.then(async () => {
    const items = await readAll(name);
    const result = await mutator(items);
    const file = path.join(dir, `${name}.json`);
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(items, null, 2));
    await fs.rename(tmp, file);
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function slugify(text) {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "post"
  );
}
