# Pragya Prateek — Full-stack website (React + Node.js)

```
pragya-prateek-fullstack/
├── client/   → React + Tailwind frontend (your original site + blog + admin page)
└── server/   → Node.js + Express backend (emails, blogs, courses, owner login)
```

## What's new

| Feature | How it works |
|---|---|
| **Book a Session** | The form on the site posts to `POST /api/bookings`. The backend emails **Pragya** all the customer details (name, email, phone, topic, date, time, message). Hitting *Reply* answers the customer directly. The customer also gets an automatic confirmation copy (can be turned off). |
| **Contact form** | Same idea, via `POST /api/contact`. |
| **Blog** | 5 sample psychology posts are included. Home page shows the latest 3; `/blog` lists all; `/blog/<slug>` is a full post. |
| **Owner-only publishing** | Only Pragya can add / edit / delete blogs and courses, from a private page at **`/admin`**. |
| **Courses** | Now loaded from the backend. Your 3 original courses are pre-loaded; Pragya can add more, edit or delete them from `/admin`. |

### How "only the client can add" is enforced
The **backend** enforces it, not just the hidden page. Every create / edit / delete request needs a login token
that is only issued when the correct `ADMIN_EMAIL` + `ADMIN_PASSWORD` (set in `server/.env`) are entered.
Anyone else calling those endpoints gets `401 Unauthorized`. Customers never see any "add" buttons, and the
`/admin` page isn't linked anywhere on the public site (Pragya just bookmarks it).

---

## 1. Setup (about 5 minutes)

Requires **Node.js 18+**.

```bash
# from the project root
npm run install:all

# create the server settings file
cp server/.env.example server/.env
```

Open **`server/.env`** and fill in:

1. `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Pragya's login for `/admin`. Use a strong password.
2. `JWT_SECRET` — any long random text. Generate one with:
   `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
3. **Email settings** (see below) and `OWNER_EMAIL` (where booking emails go).

### Email setup with Gmail
1. On the Gmail account that will *send* the emails, turn on **2-Step Verification**.
2. Go to <https://myaccount.google.com/apppasswords> and create an **App password**.
3. Put it in `SMTP_PASS` (16 characters, no spaces) and the Gmail address in `SMTP_USER`.
4. Set `OWNER_EMAIL` to the address that should receive bookings (can be the same one).

Not using Gmail? Any SMTP provider works (Brevo, Zoho, Outlook, SendGrid…): change `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`.

> If you leave the SMTP values empty, the server still runs and simply **prints the emails in the terminal**
> instead of sending them — handy for testing.

## 2. Run it

```bash
npm run dev
```

- Website → <http://localhost:5173>
- API → <http://localhost:5000> (the frontend forwards `/api` calls to it automatically)
- Owner page → <http://localhost:5173/admin>

## 3. Using the owner page (`/admin`)

Log in, then choose **Blog posts** or **Courses**:

- **Write a new blog** — title, category, emoji, card colour, optional summary, and the text.
  Blank line = new paragraph; a line starting with `## ` = a heading. Untick *Publish* to save a draft.
- **Add a new course** — title, label, emoji, colour, description, price, and an optional *Enroll link*
  (leave it empty and the Enroll button opens the booking form).
- Every item in the list has **Edit** and **Delete**.

The 5 sample blogs are just placeholders — delete or replace them from `/admin`, or edit `server/data/blogs.json`.

## 4. Going live

**Simplest — one server for everything:**
```bash
npm run build     # builds the React app into client/dist
npm start         # Node serves both the website and the API
```
Set the same `.env` values on your host. Point the domain to that one Node app (Render, Railway, a VPS, etc.).
Set `CLIENT_ORIGIN` to your real site URL, e.g. `https://pragyaprateek.com`.

**Or split:** host `client/` on Netlify/Vercel and `server/` elsewhere. Then set `VITE_API_URL=https://your-backend-url`
in `client/.env` before building, and add your site URL to `CLIENT_ORIGIN` on the server. (For Netlify/Vercel add a
"redirect all to index.html" rule so `/blog` and `/admin` work on refresh.)

### ⚠️ Important about data storage
Blogs and courses are saved in `server/data/*.json` files (no database to install). That is perfect for a personal site,
**but** some free hosts (e.g. Render free tier, Heroku) wipe files on every redeploy/restart. Either:
- use a host with a persistent disk / a VPS, **or**
- ask me to switch storage to MongoDB / PostgreSQL (only `server/src/utils/store.js` and the routes need to change).

Back up `server/data/` from time to time.

## Security notes (already built in)
- Login is rate-limited (10 tries / 15 min per IP); passwords are compared with bcrypt; sessions expire after 7 days.
- Booking/contact forms are rate-limited (8 / hour per IP) and have a hidden spam-trap field.
- All customer text is HTML-escaped in emails; blog text is rendered as plain text (no script injection).
- Never commit `server/.env` (it's in `.gitignore`).

## API reference
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/bookings`, `/api/contact` | public (sends email) |
| GET | `/api/blogs`, `/api/blogs/:slug`, `/api/courses` | public |
| POST | `/api/auth/login` | public (returns token) |
| GET | `/api/blogs/admin/all` | **owner only** (includes drafts) |
| POST / PUT / DELETE | `/api/blogs`, `/api/blogs/:id`, `/api/courses`, `/api/courses/:id` | **owner only** |
