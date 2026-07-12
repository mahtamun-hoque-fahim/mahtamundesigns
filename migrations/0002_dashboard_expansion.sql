-- Migration: 0002_dashboard_expansion
-- Run: paste into Neon SQL editor  OR  npx drizzle-kit push

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS is_featured    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS featured_order INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  quote       TEXT NOT NULL,
  rating      INTEGER NOT NULL DEFAULT 5,
  avatar      TEXT,
  image       TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timeline_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_stats (
  id                TEXT PRIMARY KEY DEFAULT 'main',
  years_experience  INTEGER NOT NULL DEFAULT 6,
  total_designs     INTEGER NOT NULL DEFAULT 600,
  client_count      INTEGER NOT NULL DEFAULT 11,
  satisfaction      INTEGER NOT NULL DEFAULT 100,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_stats (id, years_experience, total_designs, client_count, satisfaction)
VALUES ('main', 6, 600, 11, 100)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS motivation_cards (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page   TEXT NOT NULL UNIQUE,
  name   TEXT,
  role   TEXT,
  quote  TEXT,
  avatar TEXT
);
