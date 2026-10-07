# Online payments (Razorpay) — setup guide

The website takes the session fee online: visitor fills the booking form → pays in a secure
Razorpay pop-up (UPI / cards / netbanking / wallets) → booking is confirmed and both
the owner and the customer get an email. The owner sees every booking and its payment status in
**Admin → 📅 Bookings & payments**.

## 1. Create the Razorpay account
1. Sign up at https://dashboard.razorpay.com and complete KYC (needed for LIVE payments).
2. While testing, switch the dashboard to **Test Mode** → *Settings → API Keys → Generate Test Key*.
   Keys look like `rzp_test_xxxxx` (Key ID) + a secret.

## 2. Put the keys in `server/.env` (never in the frontend)
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=any-long-random-string
```
Restart the server. In **Admin → Site settings** the banner changes to “Online payment is ON”.

## 3. Add the webhook (safety net — recommended)
Razorpay Dashboard → *Settings → Webhooks → Add*:
- URL: `https://YOUR-API-DOMAIN/api/payments/webhook`
- Active event: `payment.captured`
- Secret: the same string as `RAZORPAY_WEBHOOK_SECRET`

This confirms the booking even if a customer pays and then closes the browser before the page finishes.

## 4. Set the fees
**Admin → ⚙️ Site settings → Session fees** — type each fee in rupees (e.g. `1499`).
A service with an empty fee stays free (no payment step). The amount always comes from the server.

## 5. Go live
Complete KYC → generate **Live** keys → replace the two key values in `.env` → restart.
Do one real ₹1 test booking (set a fee of 1) and check it shows as Paid in the dashboard.

## No keys yet?
Leave the Razorpay values empty — the site keeps working and falls back to the optional
“backup payment link” per service (Admin → Site settings).

## Hosting note
If the frontend and API are on different domains, set `CLIENT_ORIGIN` to the frontend URL and
`VITE_API_URL` (frontend `.env`) to the API URL, as before.
