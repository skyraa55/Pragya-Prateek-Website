import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/auth.js";
import mailRoutes from "./routes/mail.js";
import blogRoutes from "./routes/blogs.js";
import courseRoutes from "./routes/courses.js";
import settingsRoutes from "./routes/settings.js";
import paymentRoutes, { webhookHandler } from "./routes/payments.js";

// Refuse to start with an unsafe/missing admin setup.
const missing = ["JWT_SECRET", "ADMIN_EMAIL"].filter((k) => !process.env[k]);
if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) missing.push("ADMIN_PASSWORD");
if (missing.length) {
  console.error(`❌ Missing required .env values: ${missing.join(", ")}\n   Copy server/.env.example to server/.env and fill it in.`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1); // correct client IPs behind Render/Railway/Nginx (for rate limiting)
// Razorpay Checkout loads a script + iframe from razorpay.com, so the default CSP is widened for exactly those hosts.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "https://checkout.razorpay.com"],
        "frame-src": ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
        "connect-src": ["'self'", "https://api.razorpay.com", "https://lumberjack.razorpay.com", "https://checkout.razorpay.com"],
        "img-src": ["'self'", "data:", "https:"],
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // lets UPI / bank pop-ups talk back
  })
);
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((s) => s.trim()),
  })
);
// Webhook needs the RAW body (its signature covers the exact bytes), so it is registered before express.json().
app.post("/api/payments/webhook", express.raw({ type: "*/*", limit: "100kb" }), webhookHandler);
app.use(express.json({ limit: "200kb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api", mailRoutes); // POST /api/bookings, /api/contact
app.use("/api/blogs", blogRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/payments", paymentRoutes);

// Optional: if the frontend has been built (client/dist), serve it from this same server.
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "client", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid request." });
  res.status(500).json({ error: "Something went wrong on our side. Please try again." });
});

app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
