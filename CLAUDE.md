# fortis-frontend — Working Context

The Next.js user-facing application for Fortis Edge. Hosted on Vercel.

For project-wide context, see `../CLAUDE.md`. For full architecture, see `../docs/02_technical-architecture.md`.

## What This Repo Does

- Marketing site, chat widget, customer portal pages, admin dashboard
- Public quote viewer at `/quote/[id]`
- Thin chat proxy at `/api/chat/route.ts` that forwards to the FastAPI backend

This repo does **not** contain AI logic, conversation persistence, or estimate creation. Those all live in `fortis-chatbot/`.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15.5 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI primitives | `@base-ui/react` |
| AI SDK | Vercel AI SDK 6.0 (with `@ai-sdk/xai`) |
| PDF | `@react-pdf/renderer` (slated for removal) |
| DB client | `@supabase/supabase-js` (anon key, read-only for quotes) |
| Hosting | Vercel |

Brand colors: `#003DA7` (primary blue), `#0082CA` (light blue), `#00783F` / `#76BD22` (greens, accent).

## Repo Map

```
app/                      # Next.js App Router
  api/chat/route.ts       # Chat proxy → forwards to FORTIS_CHAT_BACKEND_URL
  quote/[id]/page.tsx     # Public quote viewer (reads from Supabase via anon key)
  customer-portal/        # Customer-facing portal pages
  dashboard/              # Admin dashboard (cookie-auth gated)
  assistant/              # Chat interface
  products-services/      # Marketing pages
  ...                     # Other marketing/info pages
components/               # ~46 React components (UI atoms, chat panels, marketing blocks)
  quote/QuoteDocument.tsx # The active quote rendering component
lib/                      # auth, chat, knowledge, quote, supabase helpers
data/                     # Static data
public/                   # Static assets, images, fonts
supabase/                 # Migrations
middleware.ts             # Route auth guard for /dashboard/*
```

## Build / Dev / Test

```bash
# Install
npm install

# Local dev server (typically port 3000)
npm run dev

# Production build (verifies type-correctness)
npm run build

# Lint
npm run lint
```

There is **no test suite on the frontend yet**. This is a known debt — see §11 in the architecture doc. Adding tests is required before Phase 2 (customer pilot).

## Environment Variables

Live in `.env.local` for dev, in Vercel project settings for prod. Required:

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key for quote-read access
- `FORTIS_CHAT_BACKEND_URL` — FastAPI backend URL (Vercel today, Railway after migration)
- `ADMIN_PASSWORD` (or similar) — for cookie-based admin auth

Always use `NEXT_PUBLIC_` prefix only for values that are safe in browser code. **Never expose the Supabase service role key here.**

## Conventions

- **Server components by default**, `"use client"` only when needed
- **Tailwind utility classes** for styling — avoid CSS modules unless there's a clear reason
- **Form inputs use `@base-ui/react`** primitives where possible for consistency
- **Markdown rendering** in chat uses the existing markdown component in `components/` — don't add a new markdown library
- **API route handlers** in `app/api/.../route.ts` follow Next.js 15 App Router conventions
- **Brand fonts**: Calibri/Arial as Gotham fallback in non-print contexts; system fonts elsewhere

## Critical Files

- `app/api/chat/route.ts` — the proxy. Keep it thin. AI logic does not belong here.
- `components/quote/QuoteDocument.tsx` — the active quote renderer. The version of this in `fortis-chatbot/` is legacy and should not be referenced.
- `middleware.ts` — admin route protection. Don't add auth logic to individual route handlers.

## Known Issues (current)

1. **Mobile responsiveness** is uneven across marketing and quote pages. Phase 0 punch list item.
2. **No test coverage.** Acceptable for now; required before Phase 2.
3. **Boilerplate `README.md`** still says "this is a Next.js project bootstrapped with `create-next-app`" — replace before any external sharing.
4. **`@react-pdf/renderer` is unused or near-unused.** Verify and remove during PDF library consolidation.

## Things Not To Touch

- **`supabase/` migrations**: which folder is the canonical schema source — `fortis-chatbot/sql/` or `fortis-frontend/supabase/` — has not been verified. Don't create or modify migrations until that's resolved (see §11 item 13 in the architecture doc). When in doubt, ask Brett.
- **The Supabase anon key in code** is intentional. Don't move it server-side or assume it's a leak — it's the public read key for quote pages.
- **Don't add new authentication frameworks.** The cookie-based admin auth is intentionally minimal for the prototype phase.

## Phase 2 Notes (for future work)

In Phase 2, this frontend may be replaced or embedded within the MyFortis Infigo portal. Approach is TBD (see architecture §7.3). Until that's decided:

- Don't add net-new marketing pages without explicit instruction
- Do invest in the chat widget, quote viewer, and admin dashboard — those are likely to survive any migration

## When To Reach for the Backend Repo

If a task involves any of the following, you're probably in the wrong repo:

- Conversation logic, message handling, or Grok prompts
- Estimate creation, pricing lookup, or wizard state
- Knowledge base content or AI training loop logic
- Supabase schema changes
- Twilio webhook handling
- Voice or SMS integration

Switch to `../fortis-chatbot/` and read its `CLAUDE.md`.
