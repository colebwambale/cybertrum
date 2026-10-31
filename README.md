# Sentinel Supply: storefront, customer portal, admin dashboard

Next.js 15 (App Router) · TypeScript · Tailwind · Supabase · installable PWA with Web Push.
Design tokens come from the Figma file (navy `#14243C`, blue `#245AD7`, Inter).

## Run it

```bash
npm install
cp .env.example .env.local     # fill in as you go; the UI runs without any keys
npm run dev
```

Without Supabase keys you get the full UI on sample data (`src/lib/mock-data.ts`).
Route guards, checkout, payments and push switch on once keys are set.

## Set up the backend (about 15 minutes)

1. Create a Supabase project. Copy the URL, anon key and service-role key into `.env.local`.
2. SQL editor: run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`.
3. Sign up through `/login`, then in the SQL editor promote yourself:
   `update profiles set role = 'super_admin' where id = '<your auth user id>';`
4. **Payments (Flutterwave):** set `FLW_SECRET_KEY` and `FLW_SECRET_HASH`. In the Flutterwave dashboard point the webhook to
   `https://<your-domain>/api/payments/webhook` using the same secret hash. Use test mode first.
   Pesapal is stubbed in `src/lib/payments/pesapal.ts`; add `PAYMENT_PROVIDER=pesapal` once implemented.
5. **Push:** `npm run vapid`, then put the public key in `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and the private key in `VAPID_PRIVATE_KEY`.
6. **Email / SMS:** add `RESEND_API_KEY` (verify your sending domain) and, optionally, Africa's Talking credentials.

## What's wired vs. what's left

| Area | Status |
|---|---|
| Design tokens, responsive shells (storefront, account, admin), sidebar/drawer nav | Done |
| Cart (local), checkout form, `/api/checkout` (server-priced, VAT, order + payment rows) | Done |
| Flutterwave hosted checkout (card + MTN/Airtel mobile money) and verified webhook | Done, test it in sandbox |
| Order → paid: stock decrement, email, push (`mark_order_paid`) | Done |
| PWA: manifest, icons, service worker with offline page | Done (registers in production builds only) |
| Web Push: opt-in toggle, subscribe API, `notifyUser` / `notifyStaff` | Done |
| Postgres schema + RLS, roles (`customer`, `staff`, `admin`, `super_admin`) | Done |
| Pages reading real data from Supabase | **To do.** Pages use mock data; swap in queries (`TODO` comments mark each spot) |
| Product CRUD, inventory adjustments, quote builder, support tickets, reports | **To do** |
| Pesapal provider | **To do** |
| PDF invoices/quotes (`@react-pdf/renderer`), URA EFRIS e-invoicing | **To do** |

## Notes

- Test push and install on a **production build** (`npm run build && npm start`), served over HTTPS (or localhost).
  On iPhone, web push only works after "Add to Home Screen".
- Prices are always recomputed on the server in `/api/checkout`; never trust cart prices from the browser.
- The webhook re-verifies each transaction with Flutterwave before marking anything paid.
- Run `mark_order_paid` only via the service role (execute is revoked from regular users).
- If you outgrow the hand-written `public/sw.js`, move to Serwist for precaching and update flows.
