
-- Add layout_mode to companies
ALTER TABLE public.companies ADD COLUMN layout_mode text NOT NULL DEFAULT 'simple';

-- Project groups for organized design display
CREATE TABLE public.project_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read project groups" ON public.project_groups FOR SELECT USING (true);
CREATE POLICY "Auth insert project groups" ON public.project_groups FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update project groups" ON public.project_groups FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete project groups" ON public.project_groups FOR DELETE TO authenticated USING (true);

-- Project images (belongs to company, optionally to a group)
CREATE TABLE public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  group_id uuid REFERENCES public.project_groups(id) ON DELETE CASCADE,
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read project images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Auth insert project images" ON public.project_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update project images" ON public.project_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete project images" ON public.project_images FOR DELETE TO authenticated USING (true);

-- Media store for bulk uploads
CREATE TABLE public.media_store (
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

CREATE POLICY "Auth read media store" ON public.media_store FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert media store" ON public.media_store FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update media store" ON public.media_store FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete media store" ON public.media_store FOR DELETE TO authenticated USING (true);

-- Media tags
CREATE TABLE public.media_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES public.media_store(id) ON DELETE CASCADE NOT NULL,
  tag text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth read media tags" ON public.media_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert media tags" ON public.media_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update media tags" ON public.media_tags FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete media tags" ON public.media_tags FOR DELETE TO authenticated USING (true);

-- Trigger for updated_at on new tables
CREATE TRIGGER update_project_groups_updated_at BEFORE UPDATE ON public.project_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_media_store_updated_at BEFORE UPDATE ON public.media_store FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
