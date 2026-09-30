import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Max 10 login attempts / 15 min per IP — blocks password guessing.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in a few minutes." },
});

let passwordHash;
const getHash = () => {
  if (!passwordHash) {
    passwordHash =
      process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(process.env.ADMIN_PASSWORD || "", 10);
  }
  return passwordHash;
};

router.post("/login", loginLimiter, (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  const emailOk = email === String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  // Always run the bcrypt compare so response time doesn't reveal whether the email was right.
  const passOk = bcrypt.compareSync(password, getHash());

  if (!emailOk || !passOk || !process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, email });
});

// Lets the frontend check whether a stored token is still valid.
router.get("/me", requireAdmin, (req, res) => res.json({ email: req.admin.email }));

export default router;
