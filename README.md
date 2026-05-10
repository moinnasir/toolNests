# ToolNest Deployable MVP

ToolNest is a Next.js App Router SaaS toolkit for freelancers, creators, and small teams. It includes auth, dashboards, tools, admin surfaces, blog, subscriptions, referrals, SEO, analytics/ad hooks, and server routes for cloud-backed features.

## Features

- Free tools: Image Converter, WhatsApp Link Generator, Image to Text, Stamp and Signature, CV Maker
- Pro tools: Invoice Maker, Expiring Link Generator, Send Later
- Premium tools: File Locker, Voice to Text, Video Converter
- Firebase Email/Password auth, Firestore, and Storage
- Stripe checkout plus EasyPaisa checkout initiation
- Admin pages for users, tool stats, file logs, and payments
- Blog with Markdown posts stored in Firestore
- Sitemap, robots.txt, Google Analytics, and AdSense hooks

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

PowerShell may block `npm.ps1`; use `npm.cmd install` and `npm.cmd run dev` on Windows if needed.

## Environment

Copy `.env.example` to `.env.local` and fill the values you need.

Required for auth/storage/database:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Required for server-backed file/email routes:

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM`

Payments:

- Stripe: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PRICE_PRO`, `NEXT_PUBLIC_STRIPE_PRICE_PREMIUM`
- EasyPaisa: `EASYPAISA_STORE_ID`, `EASYPAISA_HASH_KEY`, `EASYPAISA_ACCOUNT_NUM`, optional `EASYPAISA_RETURN_URL`, optional `EASYPAISA_CHECKOUT_URL`

Optional:

- `ASSEMBLYAI_API_KEY`
- `OPENAI_API_KEY` and optional `OPENAI_MODEL` — enables “Generate with AI” for allowed AI/content tool slugs (server-side only).
- `GOOGLE_PAGESPEED_API_KEY` (alias `GOOGLE_PAGESPEED_KEY` also supported) — enables live PageSpeed Insights in the Page Speed Analyzer universal tool.
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_ADSENSE_CA_PUB`
- `NEXT_PUBLIC_ADSENSE_SLOT`
- `NEXT_PUBLIC_ADMIN_EMAILS`

The app builds without Firebase keys by using safe placeholders. Live auth, Firestore, and Storage need real Firebase credentials.

## Firebase Rules

Starter Firestore and Storage rules are in `firebase-rules.md`. Tighten them before production according to your plan, especially for admin-only writes and file access.

## Deployment

1. Push this folder to GitHub or import it directly into Vercel.
2. Add all environment variables in Vercel Project Settings.
3. Enable Firebase Auth Email/Password, Firestore, and Storage.
4. Configure Stripe products/prices and add the price IDs to env.
5. Configure EasyPaisa merchant values when available.
6. Add a cron job that sends `GET /api/sendlater/run` every 5-10 minutes.

## Verification

```bash
npm run lint
npm run build
```

Smoke test home, tools, pricing, login/register/dashboard/settings, admin authorization, Stripe missing-config behavior, EasyPaisa missing-config behavior, and every tool page.
