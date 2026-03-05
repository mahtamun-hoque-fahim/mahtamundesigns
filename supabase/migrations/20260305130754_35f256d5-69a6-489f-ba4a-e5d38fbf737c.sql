
-- Page views tracking table
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  referrer text DEFAULT '',
  user_agent text DEFAULT '',
  country text DEFAULT '',
  device_type text DEFAULT 'desktop',
  browser text DEFAULT '',
  os text DEFAULT '',
  session_id text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (for tracking)
CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

-- Only authenticated can read
CREATE POLICY "Auth read page views" ON public.page_views
  FOR SELECT TO authenticated USING (true);

-- Activity log table
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  page text DEFAULT '',
  details text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth insert activity log" ON public.activity_log
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth read activity log" ON public.activity_log
  FOR SELECT TO authenticated USING (true);
