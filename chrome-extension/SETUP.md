# HostReply — Chrome Extension Setup

## What this extension uses

| Service | Purpose | Cost |
|---|---|---|
| **Supabase** | Cloud DB (Postgres) + Anonymous Auth | Free (500 MB DB, 50k MAU) |
| **Google Gemini API** | Generates replies | Free tier (each user uses their own key) |

---

## Step 1 — Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project** → choose a name (e.g. `hostreply`) → set a DB password → pick a region → **Create new project**
3. Wait ~1 minute for the project to provision

---

## Step 2 — Create the database tables

1. In the Supabase dashboard, go to **SQL Editor** → **New query**
2. Paste the contents of `supabase/schema.sql` and click **Run**

This creates two tables with Row Level Security so users can only ever access their own data.

---

## Step 3 — Enable Anonymous Sign-in

1. Go to **Authentication → Sign In / Up** (or **Providers** depending on your dashboard version)
2. Find **Anonymous** in the list and toggle it **on** → **Save**

---

## Step 4 — Get your Supabase credentials

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
   - **anon / public key** — the long `eyJ…` string under "Project API Keys"

---

## Step 5 — Paste credentials into the extension

Open `chrome-extension/src/lib/supabase.ts` and replace the placeholders:

```ts
const SUPABASE_URL = 'https://xxxxxxxxxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

---

## Step 6 — Build the extension

```bash
cd chrome-extension
npm install
npm run build
```

This produces a `chrome-extension/dist/` folder — that's your extension.

---

## Step 7 — Load into Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `chrome-extension/dist/` folder
5. The HostReply icon will appear in your toolbar

---

## Step 8 — First run

When you open the extension for the first time it will ask for your **Gemini API key**.

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API key** → copy it
3. Paste it into the extension — it's stored only on your device via `chrome.storage.local`

---

## Rebuilding after changes

```bash
cd chrome-extension
npm run build
# Then go to chrome://extensions and click the refresh icon on the HostReply card
```

For live rebuilding while developing:

```bash
npm run dev   # watches for file changes and rebuilds automatically
```
