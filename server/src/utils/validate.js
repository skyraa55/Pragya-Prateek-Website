// Small validation helpers (no extra dependency needed).
export const clean = (v, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;

export const isHttpUrl = (v) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export const COLORS = ["coral", "lav", "sage", "sun"];
