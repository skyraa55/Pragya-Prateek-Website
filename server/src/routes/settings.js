import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { readAll, update } from "../utils/store.js";
import { clean, isHttpUrl } from "../utils/validate.js";
import { razorpayConfigured } from "../utils/payments.js";

const router = Router();

export const DEFAULT_SETTINGS = {
  instagramHandle: "",
  instagramUrl: "",
  linkedinUrl: "",
  professionalGuidanceDocUrl: "",
  workshopPhotos: [],
  workshopThemes: "",
  workshopSampleDesign: "",
  careerFee: "",
  careerLink: "",
  workshopFee: "",
  workshopLink: "",
  growthFee: "",
  growthLink: "",
};

const URL_FIELDS = ["instagramUrl", "linkedinUrl", "professionalGuidanceDocUrl", "careerLink", "workshopLink", "growthLink"];

export async function getSettings() {
  const stored = await readAll("settings");
  return { ...DEFAULT_SETTINGS, ...(Array.isArray(stored) ? {} : stored) };
}

// "₹1,499" / "Rs 999" / "499.50" -> "1499" / "999" / "499.5". Empty = this service is free (no payment step).
function parseFee(v) {
  const raw = clean(v, 30);
  if (!raw) return { value: "" };
  const num = parseFloat(raw.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(num) || num < 1 || num > 500000) return { error: "Fees must be a number of rupees between 1 and 500000 (leave empty for a free service)." };
  return { value: String(Math.round(num * 100) / 100) };
}

function parse(body = {}) {
  const data = {
    instagramHandle: clean(body.instagramHandle, 60),
    instagramUrl: clean(body.instagramUrl, 300),
    linkedinUrl: clean(body.linkedinUrl, 300),
    professionalGuidanceDocUrl: clean(body.professionalGuidanceDocUrl, 500),
    workshopThemes: clean(body.workshopThemes, 4000),
    workshopSampleDesign: clean(body.workshopSampleDesign, 4000),
    careerFee: "",
    careerLink: clean(body.careerLink, 500),
    workshopFee: "",
    workshopLink: clean(body.workshopLink, 500),
    growthFee: "",
    growthLink: clean(body.growthLink, 500),
  };

  for (const f of ["careerFee", "workshopFee", "growthFee"]) {
    const r = parseFee(body[f]);
    if (r.error) return { error: r.error };
    data[f] = r.value;
  }

  // "@handle" is enough — build the Instagram link automatically.
  if (data.instagramHandle) {
    data.instagramHandle = "@" + data.instagramHandle.replace(/^@+/, "").replace(/\s+/g, "");
    if (!data.instagramUrl) data.instagramUrl = `https://instagram.com/${data.instagramHandle.slice(1)}`;
  }

  for (const f of URL_FIELDS) {
    if (data[f] && !isHttpUrl(data[f])) return { error: `"${f}" must be a full link starting with https://` };
  }

  // One image link per line (https://… or a /path inside the website's public folder).
  const photos = (Array.isArray(body.workshopPhotos) ? body.workshopPhotos : String(body.workshopPhotos || "").split("\n"))
    .map((p) => clean(p, 500))
    .filter(Boolean)
    .slice(0, 12);
  if (photos.some((p) => !(isHttpUrl(p) || p.startsWith("/"))))
    return { error: "Each workshop photo must be a full https:// link (one per line)." };
  data.workshopPhotos = photos;

  return { data };
}

// PUBLIC: everything here is meant to be shown on the website (social links, workshop text, payment links).
router.get("/", async (_req, res, next) => {
  try {
    res.json({ ...(await getSettings()), paymentsEnabled: razorpayConfigured() });
  } catch (e) {
    next(e);
  }
});

// ADMIN ONLY
router.put("/", requireAdmin, async (req, res, next) => {
  try {
    const { data, error } = parse(req.body);
    if (error) return res.status(400).json({ error });
    await update("settings", (obj) => {
      Object.keys(obj).forEach((k) => delete obj[k]);
      Object.assign(obj, data);
    });
    res.json({ ...(await getSettings()), paymentsEnabled: razorpayConfigured() });
  } catch (e) {
    next(e);
  }
});

export default router;
