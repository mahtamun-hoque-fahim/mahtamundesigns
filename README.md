# Mahtamun Designs — Portfolio

A graphic design portfolio with a full admin dashboard.
Built with React + Vite + TypeScript + Supabase.

---

## ⚡ Setup (do this once)

### 1. Set up the database

1. Go to [supabase.com](https://supabase.com) → your project (`rxrfnscinvfrmkwghylu`)
2. Click **SQL Editor** → **New Query**
3. Open `supabase/setup.sql`, paste the entire contents → **Run**
4. You'll see: `Setup complete! All tables created and seeded.`

### 2. Set Resend key (for contact form emails)

In Supabase → **Edge Functions** → **Manage Secrets**, add:
- `RESEND_API_KEY` = your Resend key
- `ADMIN_USER_EMAIL` = your email (where contact messages go)

### 3. Create your admin account

Supabase → **Authentication** → **Users** → **Add User**
Set your email + password. That's your `/admin` login.

### 4. Deploy to Vercel

1. [vercel.com](https://vercel.com) → New Project → Import from GitHub → `mahtamundesigns`
2. Add environment variables:
   - `VITE_SUPABASE_URL` = `https://rxrfnscinvfrmkwghylu.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your anon key
3. Deploy ✅

---

## 🔧 Local development

```bash
cp .env.example .env   # fill in your Supabase values
npm install
npm run dev
```

---

## 🗂 Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + TypeScript |
| Bundler | Vite |
| UI | shadcn/ui + Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |
| Auth | Supabase Auth |
| Email | Resend via Supabase Edge Functions |
| Hosting | Vercel |

---

## 🖼 How media replacement works

1. Go to `/admin` → **Media** tab
2. Hover any image → click the upload icon → pick your file
3. It uploads to Supabase Storage, saves the URL to the DB
4. Your site shows the new image immediately, everywhere that slot is used
