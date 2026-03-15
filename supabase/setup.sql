-- ============================================================
-- MAHTAMUN DESIGNS — FULL DATABASE SETUP
-- Run this once in Supabase SQL Editor to set everything up
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- STEP 1: Core helper function
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ────────────────────────────────────────────────────────────
-- STEP 2: Media assets (site images)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  file_path TEXT,
  public_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view media assets" ON public.media_assets;
DROP POLICY IF EXISTS "Authenticated users can insert media" ON public.media_assets;
DROP POLICY IF EXISTS "Authenticated users can update media" ON public.media_assets;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON public.media_assets;

CREATE POLICY "Anyone can view media assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert media" ON public.media_assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update media" ON public.media_assets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete media" ON public.media_assets FOR DELETE TO authenticated USING (true);

DROP TRIGGER IF EXISTS update_media_assets_updated_at ON public.media_assets;
CREATE TRIGGER update_media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ────────────────────────────────────────────────────────────
-- STEP 3: Storage bucket
-- ────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Anyone can view site media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload site media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update site media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete site media" ON storage.objects;

CREATE POLICY "Anyone can view site media" ON storage.objects FOR SELECT USING (bucket_id = 'site-media');
CREATE POLICY "Authenticated users can upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media');
CREATE POLICY "Authenticated users can update site media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-media');
CREATE POLICY "Authenticated users can delete site media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media');

-- ────────────────────────────────────────────────────────────
-- STEP 4: Companies / portfolio
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  contributions text[] NOT NULL DEFAULT '{}',
  impact text NOT NULL DEFAULT '',
  logo_url text,
  cover_url text,
  design_urls text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  featured_image_url text,
  category text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  layout_mode text NOT NULL DEFAULT 'simple',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read companies" ON public.companies;
DROP POLICY IF EXISTS "Auth insert companies" ON public.companies;
DROP POLICY IF EXISTS "Auth update companies" ON public.companies;
DROP POLICY IF EXISTS "Auth delete companies" ON public.companies;
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Auth insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update companies" ON public.companies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete companies" ON public.companies FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────────────────────
-- STEP 5: Project groups + images
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read project groups" ON public.project_groups;
DROP POLICY IF EXISTS "Auth insert project groups" ON public.project_groups;
DROP POLICY IF EXISTS "Auth update project groups" ON public.project_groups;
DROP POLICY IF EXISTS "Auth delete project groups" ON public.project_groups;
CREATE POLICY "Public read project groups" ON public.project_groups FOR SELECT USING (true);
CREATE POLICY "Auth insert project groups" ON public.project_groups FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update project groups" ON public.project_groups FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete project groups" ON public.project_groups FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_project_groups_updated_at ON public.project_groups;
CREATE TRIGGER update_project_groups_updated_at BEFORE UPDATE ON public.project_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  group_id uuid REFERENCES public.project_groups(id) ON DELETE CASCADE,
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read project images" ON public.project_images;
DROP POLICY IF EXISTS "Auth insert project images" ON public.project_images;
DROP POLICY IF EXISTS "Auth update project images" ON public.project_images;
DROP POLICY IF EXISTS "Auth delete project images" ON public.project_images;
CREATE POLICY "Public read project images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Auth insert project images" ON public.project_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update project images" ON public.project_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete project images" ON public.project_images FOR DELETE TO authenticated USING (true);

-- ────────────────────────────────────────────────────────────
-- STEP 6: Media store (bulk uploads)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media_store (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text NOT NULL DEFAULT '',
  public_url text NOT NULL DEFAULT '',
  filename text NOT NULL DEFAULT '',
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  group_id uuid REFERENCES public.project_groups(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT '',
  assigned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_store ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth read media store" ON public.media_store;
DROP POLICY IF EXISTS "Auth insert media store" ON public.media_store;
DROP POLICY IF EXISTS "Auth update media store" ON public.media_store;
DROP POLICY IF EXISTS "Auth delete media store" ON public.media_store;
CREATE POLICY "Auth read media store" ON public.media_store FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert media store" ON public.media_store FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update media store" ON public.media_store FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete media store" ON public.media_store FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_media_store_updated_at ON public.media_store;
CREATE TRIGGER update_media_store_updated_at BEFORE UPDATE ON public.media_store FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.media_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES public.media_store(id) ON DELETE CASCADE NOT NULL,
  tag text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth read media tags" ON public.media_tags;
DROP POLICY IF EXISTS "Auth insert media tags" ON public.media_tags;
DROP POLICY IF EXISTS "Auth update media tags" ON public.media_tags;
DROP POLICY IF EXISTS "Auth delete media tags" ON public.media_tags;
CREATE POLICY "Auth read media tags" ON public.media_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert media tags" ON public.media_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update media tags" ON public.media_tags FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete media tags" ON public.media_tags FOR DELETE TO authenticated USING (true);

-- ────────────────────────────────────────────────────────────
-- STEP 7: Reviews
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  role text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  avatar_url text,
  expanded_image_url text,
  review_text text NOT NULL DEFAULT '',
  short_text text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Auth insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Auth update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Auth delete reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Auth insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update reviews" ON public.reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete reviews" ON public.reviews FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────────────────────
-- STEP 8: Site content (editable text)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section text NOT NULL,
  content_key text NOT NULL,
  content_value text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(page, section, content_key)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read content" ON public.site_content;
DROP POLICY IF EXISTS "Auth insert content" ON public.site_content;
DROP POLICY IF EXISTS "Auth update content" ON public.site_content;
DROP POLICY IF EXISTS "Auth delete content" ON public.site_content;
CREATE POLICY "Public read content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Auth insert content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update content" ON public.site_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete content" ON public.site_content FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────────────────────
-- STEP 9: Analytics + activity
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.page_views (
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
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Auth read page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read page views" ON public.page_views FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  page text DEFAULT '',
  details text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth insert activity log" ON public.activity_log;
DROP POLICY IF EXISTS "Auth read activity log" ON public.activity_log;
CREATE POLICY "Auth insert activity log" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth read activity log" ON public.activity_log FOR SELECT TO authenticated USING (true);

-- ────────────────────────────────────────────────────────────
-- STEP 10: Admin sessions / security
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token text NOT NULL,
  device_type text DEFAULT 'desktop',
  browser text DEFAULT '',
  os text DEFAULT '',
  ip_address text DEFAULT '',
  location text DEFAULT '',
  login_time timestamptz NOT NULL DEFAULT now(),
  last_active timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  terminated_at timestamptz,
  terminated_reason text DEFAULT ''
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth manage own sessions" ON public.admin_sessions;
CREATE POLICY "Auth manage own sessions" ON public.admin_sessions FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_type text DEFAULT 'desktop',
  browser text DEFAULT '',
  os text DEFAULT '',
  ip_address text DEFAULT '',
  location text DEFAULT '',
  login_time timestamptz NOT NULL DEFAULT now(),
  success boolean NOT NULL DEFAULT true,
  failure_reason text DEFAULT '',
  login_method text NOT NULL DEFAULT 'email'
);

ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth manage own login history" ON public.login_history;
CREATE POLICY "Auth manage own login history" ON public.login_history FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  recovery_email text DEFAULT '',
  recovery_email_verified boolean NOT NULL DEFAULT false,
  recovery_verification_code text DEFAULT '',
  recovery_code_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth manage own settings" ON public.admin_settings;
CREATE POLICY "Auth manage own settings" ON public.admin_settings FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  details text DEFAULT '',
  device_type text DEFAULT '',
  browser text DEFAULT '',
  os text DEFAULT '',
  ip_address text DEFAULT '',
  location text DEFAULT '',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth manage own alerts" ON public.security_alerts;
CREATE POLICY "Auth manage own alerts" ON public.security_alerts FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- STEP 11: Contact messages
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  source_page text NOT NULL DEFAULT '/contact',
  is_read boolean NOT NULL DEFAULT false,
  email_notified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Auth read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Auth update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Auth delete contact messages" ON public.contact_messages;
CREATE POLICY "Public insert contact messages" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Auth read contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth update contact messages" ON public.contact_messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete contact messages" ON public.contact_messages FOR DELETE TO authenticated USING (true);

-- ────────────────────────────────────────────────────────────
-- STEP 12: Seed default media slots
-- ────────────────────────────────────────────────────────────
INSERT INTO public.media_assets (slot_key, label, category, file_path, public_url) VALUES
('hero-bg', 'Hero Background', 'hero', NULL, '/images/home/hero-bg.png'),
('hero-person', 'Hero Person', 'hero', NULL, '/images/home/hero-person.png'),
('hero-main', 'Hero Main', 'hero', NULL, '/images/home/hero.jpg'),
('selected-works-1', 'Selected Work 1', 'portfolio', NULL, '/images/home/selected-works-1.jpg'),
('selected-works-2', 'Selected Work 2', 'portfolio', NULL, '/images/home/selected-works-2.jpg'),
('selected-works-3', 'Selected Work 3', 'portfolio', NULL, '/images/home/selected-works-3.jpg'),
('selected-works-4', 'Selected Work 4', 'portfolio', NULL, '/images/home/selected-works-4.jpg'),
('selected-works-5', 'Selected Work 5', 'portfolio', NULL, '/images/home/selected-works-5.jpg'),
('logo-company-1', 'Company Logo 1', 'logos', NULL, '/images/logos/company-1.png'),
('logo-company-2', 'Company Logo 2', 'logos', NULL, '/images/logos/company-2.png'),
('logo-company-3', 'Company Logo 3', 'logos', NULL, '/images/logos/company-3.png'),
('logo-company-4', 'Company Logo 4', 'logos', NULL, '/images/logos/company-4.png'),
('logo-company-5', 'Company Logo 5', 'logos', NULL, '/images/logos/company-5.png'),
('review-client-1', 'Review Client 1', 'reviews', NULL, '/images/reviews/client-1.jpg'),
('review-client-2', 'Review Client 2', 'reviews', NULL, '/images/reviews/client-2.jpg'),
('review-client-3', 'Review Client 3', 'reviews', NULL, '/images/reviews/client-3.jpg'),
('lunar-agency-cover', 'Lunar Agency Cover', 'portfolio', NULL, '/images/companies/lunar-agency/cover.jpg'),
('lunar-agency-design-1', 'Lunar Agency Design 1', 'portfolio', NULL, '/images/companies/lunar-agency/design-1.jpg'),
('lunar-agency-logo', 'Lunar Agency Logo', 'portfolio', NULL, '/images/companies/lunar-agency/logo.png'),
('nexus-studio-cover', 'Nexus Studio Cover', 'portfolio', NULL, '/images/companies/nexus-studio/cover.jpg'),
('nexus-studio-design-1', 'Nexus Studio Design 1', 'portfolio', NULL, '/images/companies/nexus-studio/design-1.jpg'),
('nexus-studio-logo', 'Nexus Studio Logo', 'portfolio', NULL, '/images/companies/nexus-studio/logo.png'),
('prism-creative-cover', 'Prism Creative Cover', 'portfolio', NULL, '/images/companies/prism-creative/cover.jpg'),
('prism-creative-design-1', 'Prism Creative Design 1', 'portfolio', NULL, '/images/companies/prism-creative/design-1.jpg'),
('prism-creative-logo', 'Prism Creative Logo', 'portfolio', NULL, '/images/companies/prism-creative/logo.png')
ON CONFLICT (slot_key) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- STEP 13: Seed site content
-- ────────────────────────────────────────────────────────────
INSERT INTO public.site_content (page, section, content_key, content_value) VALUES
('global','header','brand_name','MAHTAMUN'),
('global','header','nav_home','Home'),
('global','header','nav_portfolio','Portfolio'),
('global','header','nav_reviews','Reviews'),
('global','header','nav_contact','Contact'),
('global','header','cta_text','Book a Meeting'),
('global','header','cta_url','https://wa.me/8801795931345'),
('global','footer','brand_name','MAHTAMUN'),
('global','footer','description','Crafting bold visual identities and memorable brand experiences for ambitious companies across Bangladesh.'),
('global','footer','copyright','© 2024 Mahtamun. All rights reserved.'),
('global','footer','tagline','Designed with passion in Bangladesh'),
('global','footer','email','mahtamunhoquefahim@pm.me'),
('global','footer','instagram_url','#'),
('global','footer','behance_url','#'),
('global','footer','dribbble_url','#'),
('home','hero','title','Mahtamun'),
('home','hero','subtitle','Lead Designer @interting.digital'),
('home','hero','button_portfolio','Portfolio'),
('home','hero','button_contact','Contact'),
('home','hero','bg_image','/images/home/hero-bg.png'),
('home','hero','person_image','/images/home/hero-person.png'),
('home','hero','person_alt','Mahtamun'),
('home','logostrip','title','Trusted by Rising Brands of Bangladesh'),
('home','selectedworks','title','Selected Works'),
('home','selectedworks','button','View Portfolio'),
('home','reviews_preview','subtitle','Client Testimonials'),
('home','reviews_preview','title','What Clients Say About Us'),
('home','reviews_preview','link_text','Read All Reviews →'),
('home','stats','stat_1_value','6'),
('home','stats','stat_1_suffix','+'),
('home','stats','stat_1_label','Years Experience'),
('home','stats','stat_2_value','600'),
('home','stats','stat_2_suffix','+'),
('home','stats','stat_2_label','Designs Created'),
('home','stats','stat_3_value','11'),
('home','stats','stat_3_suffix',''),
('home','stats','stat_3_label','Happy Clients'),
('home','stats','stat_4_value','100'),
('home','stats','stat_4_suffix','%'),
('home','stats','stat_4_label','Client Satisfaction'),
('home','cta','title','Still Thinking?'),
('home','cta','description','Great design doesn''t wait. Let''s have a quick chat about your vision — no commitment, just a conversation.'),
('home','cta','button_text','Book a Meeting'),
('home','cta','whatsapp_url','https://wa.me/8801795931345'),
('clients','header','title','Our Portfolio'),
('clients','header','description','Brands we''ve had the pleasure of working with, creating lasting visual impact.'),
('contact','header','title','Let''s Build Something Together'),
('contact','header','description','Whether you have a project in mind, want to discuss a collaboration, or just want to say hello — I''d love to hear from you.'),
('contact','form','title','Get in Touch'),
('contact','form','email','mahtamunhoquefahim@pm.me'),
('contact','form','whatsapp','+880 1795 931345'),
('contact','form','whatsapp_url','https://wa.me/8801795931345'),
('reviews','header','title','Client Reviews'),
('reviews','header','description','Hear from the brands we''ve helped transform through design.')
ON CONFLICT (page, section, content_key) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- STEP 14: Seed companies
-- ────────────────────────────────────────────────────────────
INSERT INTO public.companies (slug, name, tagline, short_description, full_description, role, contributions, impact, logo_url, cover_url, design_urls, featured, featured_image_url, category, sort_order) VALUES
('nexus-studio', 'Nexus Studio', 'Creative Agency', 'Complete brand identity and visual system for a forward-thinking creative agency.', 'Nexus Studio needed a complete brand overhaul to match their ambitious vision. I crafted a comprehensive visual identity system that included everything from logo design to full marketing collateral.', 'Lead Brand Designer', ARRAY['Brand Identity','Logo Design','Marketing Collateral','Brand Guidelines'], 'Increased brand recognition by 300% within the first quarter of launch.', '/images/companies/nexus-studio/logo.png', '/images/companies/nexus-studio/cover.jpg', ARRAY['/images/home/selected-works-1.jpg','/images/home/selected-works-2.jpg','/images/companies/nexus-studio/design-1.jpg'], true, '/images/home/selected-works-1.jpg', 'Brand Identity', 1),
('prism-creative', 'Prism Creative', 'Design Studio', 'Premium packaging design for an artisan cosmetics brand.', 'Prism Creative''s artisan cosmetics line required packaging that communicated luxury and authenticity. I designed a packaging system that was both visually stunning and functional.', 'Packaging Designer', ARRAY['Packaging Design','Product Photography Direction','Print Production'], 'Product line saw a 45% increase in retail sales after the redesign.', '/images/companies/prism-creative/logo.png', '/images/companies/prism-creative/cover.jpg', ARRAY['/images/home/selected-works-2.jpg','/images/home/selected-works-4.jpg','/images/companies/prism-creative/design-1.jpg'], true, '/images/home/selected-works-2.jpg', 'Packaging Design', 2),
('lunar-agency', 'Lunar Agency', 'Digital Agency', 'Bold typographic campaign for a cutting-edge digital agency.', 'Lunar Agency wanted to make a bold statement in the digital space. I created a series of typographic posters and digital campaigns that pushed creative boundaries.', 'Creative Director', ARRAY['Campaign Design','Typography','Art Direction','Digital Assets'], 'Campaign reached 2M+ impressions and won a regional design award.', '/images/companies/lunar-agency/logo.png', '/images/companies/lunar-agency/cover.jpg', ARRAY['/images/home/selected-works-3.jpg','/images/home/selected-works-5.jpg','/images/companies/lunar-agency/design-1.jpg'], true, '/images/home/selected-works-3.jpg', 'Campaign Design', 3)
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- STEP 15: Seed reviews
-- ────────────────────────────────────────────────────────────
INSERT INTO public.reviews (client_name, role, company, avatar_url, expanded_image_url, review_text, short_text, rating, sort_order) VALUES
('Arif Rahman', 'CEO', 'Nexus Studio', '/images/reviews/client-1.jpg', '/images/home/selected-works-1.jpg', 'Working with this designer was transformative for our brand. The attention to detail and creative vision exceeded all expectations. Every deliverable was polished, on time, and perfectly aligned with our vision.', 'Transformative work that exceeded all expectations.', 5, 1),
('Nadia Sultana', 'Marketing Director', 'Prism Creative', '/images/reviews/client-2.jpg', '/images/home/selected-works-2.jpg', 'The packaging designs completely transformed our product line. Sales increased dramatically and we received countless compliments from customers. The designer understood our brand essence perfectly.', 'Our product line was completely transformed.', 5, 2),
('Kamal Hassan', 'Founder', 'Lunar Agency', '/images/reviews/client-3.jpg', '/images/home/selected-works-3.jpg', 'Incredible creative vision combined with flawless execution. The campaign designs were bold, memorable, and drove real business results. This is someone who truly understands the intersection of aesthetics and strategy.', 'Bold designs that drove real business results.', 5, 3)
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- DONE ✅
-- ────────────────────────────────────────────────────────────
SELECT 'Setup complete! All tables created and seeded.' as status;
