# HostReply — AI reply generator for solo Airbnb hosts

Reply to guests in seconds, not minutes. AI-powered, sounds like you, setup in 2 minutes.

## What it does

- **Generate reply** — paste a guest message, get a perfect AI reply instantly
- **My property** — one-time setup for your WiFi, check-in times, rules, personality
- **Saved replies** — build a library of your best responses, filterable by category
- **Tone refinement** — make any reply shorter, warmer, or more formal in one click

## Getting started

### 1. Clone and install

```bash
git clone <your-repo>
cd hostreply
npm install
```

### 2. Add your Anthropic API key

```bash
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
```

Get your API key at https://console.anthropic.com

### 3. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

## Project structure

```
app/
  page.tsx              ← Landing page
  app/page.tsx          ← Main app (tabs: Generate / Setup / Saved)
  api/reply/route.ts    ← API route (calls Anthropic, keeps key server-side)
  globals.css           ← Tailwind + custom utilities
components/
  app/
    PropertySetup.tsx   ← Setup form for property + host personality
    ReplyGenerator.tsx  ← Message input + AI reply + refinement buttons
    SavedReplies.tsx    ← Library of saved replies with tag filter
lib/
  types.ts              ← TypeScript types
  storage.ts            ← localStorage helpers (config + saved replies)
```

## Deploying to production

### Vercel (recommended — free)

```bash
npm install -g vercel
vercel
# Follow prompts, add ANTHROPIC_API_KEY as an env variable
```

### Self-hosted (your own VPS)

```bash
npm run build
npm start
# Runs on port 3000 — put nginx in front
```

## Next features to build

- [ ] Multi-listing support (switch between properties)
- [ ] Chrome extension to inject into Airbnb inbox
- [ ] Review responder (reply to guest reviews)
- [ ] Scheduled message templates
- [ ] Stripe integration for $8/mo billing
- [ ] Auth (NextAuth.js) so users can have accounts

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic SDK** (server-side, key never exposed to client)
- **localStorage** for persistence (no database needed for MVP)
