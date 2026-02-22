
-- Create media_assets table to track all site media
CREATE TABLE public.media_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_key TEXT NOT NULL UNIQUE, -- e.g. 'hero-person', 'selected-works-1', 'client-1-logo'
  label TEXT NOT NULL, -- human-readable label
  category TEXT NOT NULL DEFAULT 'general', -- hero, portfolio, reviews, logos
  file_path TEXT, -- storage path
  public_url TEXT, -- full public URL
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Public can read media (needed for frontend)
CREATE POLICY "Anyone can view media assets"
ON public.media_assets FOR SELECT
USING (true);

-- Only authenticated users (admin) can manage
CREATE POLICY "Authenticated users can insert media"
ON public.media_assets FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update media"
ON public.media_assets FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete media"
ON public.media_assets FOR DELETE
TO authenticated
USING (true);

-- Create storage bucket for site media
INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true);

-- Storage policies
CREATE POLICY "Anyone can view site media"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-media');

CREATE POLICY "Authenticated users can upload site media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-media');

CREATE POLICY "Authenticated users can update site media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-media');

CREATE POLICY "Authenticated users can delete site media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-media');

-- Seed default media slots
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
('prism-creative-logo', 'Prism Creative Logo', 'portfolio', NULL, '/images/companies/prism-creative/logo.png');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_media_assets_updated_at
BEFORE UPDATE ON public.media_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
