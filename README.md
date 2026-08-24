# MedGuard

MedGuard is a full-stack insurance marketplace: browse and compare health, dental, vision,
life, travel, and critical-illness plans, save favorites, and purchase a plan online. It ships
as two independent apps — a Next.js frontend and an Express REST API — talking over a small
internal HTTP boundary, backed by MongoDB Atlas.

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white">
</p>

## Features

- **Plan catalog** — browse insurance plans by category and tier, with server-rendered pages
  and a client-side plan store for instant filtering.
- **Favorites** — signed-in users can save plans to their profile.
- **Checkout** — purchase a plan through [YooKassa](https://yookassa.ru), with webhook
  notifications re-verified server-to-server against YooKassa's own API before an order is
  marked paid, plus fiscal receipts (54-FZ).
- **Current plan tracking** — the profile page shows the user's active plan, price, and a
  progress bar counting down to renewal.
- **Transactional emails** — a payment-link email when checkout starts and a confirmation email
  once payment is verified, via [Resend](https://resend.com), localized to match the buyer's
  site language.
- **Authentication** — email/password and Google OAuth, backed by short-lived JWTs issued by
  the API.
- **Avatar uploads** — profile photo upload/removal, stored on the API server.
- **Internationalization** — full English and Russian localization via i18next.

## Tech stack

### Frontend — `med-guard/`

| Purpose | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Components/Actions) |
| UI library | [React 19](https://react.dev) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Component primitives | [Base UI](https://base-ui.com) (`@base-ui/react`), scaffolded via the [shadcn](https://ui.shadcn.com) CLI |
| Variant styling | class-variance-authority, tailwind-merge, clsx |
| Icons | [Lucide](https://lucide.dev) |
| Auth | [NextAuth v5](https://authjs.dev) (Google OAuth + credentials), `jose` for JWT handling |
| State management | [Zustand](https://zustand-demo.pmnd.rs) |
| i18n | i18next, react-i18next, i18next-resources-to-backend |
| HTTP client | axios |
| Validation | [Zod](https://zod.dev) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |
| Theming | next-themes |
| Transactional email | [Resend](https://resend.com) + [React Email](https://react.email) (`@react-email/components`) |

### Backend — `server/`

| Purpose | Technology |
|---|---|
| Runtime | Node.js |
| Framework | [Express 5](https://expressjs.com) |
| Language | TypeScript (`tsx` for dev, `tsc` for builds) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose](https://mongoosejs.com) |
| Auth | JWT (`jsonwebtoken`), password hashing with `bcryptjs` |
| File uploads | Multer (avatar images) |
| Validation | Zod |
| Middleware | cors, morgan |

### Payments

Checkout is powered by **YooKassa**: the frontend creates a payment via YooKassa's REST API
(`POST /v3/payments`, with a fiscal receipt attached for 54-FZ compliance) and redirects the
user to the `confirmation_url` it returns. YooKassa's webhook notifications carry no signature
at all, so the webhook route never trusts the notification body directly - it re-fetches the
payment by id from YooKassa's own API (authenticated with the shop's own credentials) and only
marks the order paid based on that authoritative response.

Plan prices are stored and displayed in **USD** everywhere on the site. YooKassa itself only
ever settles in rubles, so the USD price is converted to RUB at a single boundary —
`convertUsdToRub()` in `lib/currency.ts` — right before creating the payment. The rate itself is
fetched live from the [Central Bank of Russia](https://www.cbr-xml-daily.ru)'s daily rates
(cached for an hour) and falls back to the static `USD_TO_RUB_RATE` env var if that lookup
fails, so a hiccup in an external API can never break checkout.

### Emails

Two transactional emails go out via **Resend**, built as [React Email](https://react.email)
components (`lib/resend/emails/`) for cross-client rendering:

- **Payment link** — sent right after a YooKassa payment is created (`lib/actions/payment-actions.ts`),
  with the plan's title, description, price, and the payment link itself.
- **Payment confirmed** — sent from the webhook route once a payment has been re-verified and the
  order marked paid.

Both are localized to whichever language the buyer was browsing in — the webhook has no request
context of its own, so the locale is round-tripped through the YooKassa payment's `metadata`
alongside the order id. Sending is wrapped in try/catch everywhere and never throws: a Resend
outage (or a missing `RESEND_API_KEY`) only skips the email, it never breaks checkout or webhook
processing. Emails send from Resend's `onboarding@resend.dev` sandbox address by default, which
works with no domain verification - point `RESEND_FROM_EMAIL` at your own verified domain for
production.

## Project structure

```
medical Incurance/
├── med-guard/                  Next.js frontend
│   ├── app/                    App Router routes ([locale]-scoped, route groups for
│   │                           marketing / auth / authenticated app pages, API routes)
│   ├── components/             UI components (ui/ primitives, feature folders)
│   ├── lib/                    Server actions, repositories, auth, YooKassa client, i18n data
│   └── i18n/                   English & Russian translation resources
└── server/                     Express REST API
    ├── src/controllers/        Route handlers (auth, orders, plans)
    ├── src/models/             Mongoose schemas (User, Order, InsurancePlan, Counter)
    ├── src/routes/             Express routers
    └── src/middleware/         Auth, internal-secret, and upload middleware
```

## Getting started

### Prerequisites

- Node.js 20+
- A MongoDB Atlas connection string
- A YooKassa test shop (for real payment testing) and, optionally, Google OAuth credentials

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, INTERNAL_API_SECRET, etc.
npm run dev            # http://localhost:4000
```

### 2. Frontend

```bash
cd med-guard
npm install
cp .env.example .env.local   # fill in API_BASE_URL, APP_URL, AUTH_SECRET,
                              # AUTH_GOOGLE_ID/SECRET, YOOKASSA_AUTH,
                              # USD_TO_RUB_RATE (fallback rate only),
                              # RESEND_API_KEY, RESEND_FROM_EMAIL
npm run dev                  # http://localhost:3000
```

The frontend expects the API to be reachable at `API_BASE_URL`; both apps run independently and
communicate only over HTTP.

## Scripts

| Command | med-guard | server |
|---|---|---|
| `npm run dev` | Start Next.js dev server (Turbopack) | Start the API with hot reload (`tsx watch`) |
| `npm run build` | Production build | Compile TypeScript to `dist/` |
| `npm run start` | Start production server | Run the compiled API |
| `npm run lint` | ESLint | — |
