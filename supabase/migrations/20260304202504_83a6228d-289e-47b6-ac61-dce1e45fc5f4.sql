
CREATE TABLE public.companies (
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
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Auth insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update companies" ON public.companies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete companies" ON public.companies FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.reviews (
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
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Auth insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update reviews" ON public.reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete reviews" ON public.reviews FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.site_content (
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
CREATE POLICY "Public read content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Auth insert content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update content" ON public.site_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete content" ON public.site_content FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed companies
INSERT INTO public.companies (slug, name, tagline, short_description, full_description, role, contributions, impact, logo_url, cover_url, design_urls, featured, featured_image_url, category, sort_order) VALUES
('nexus-studio', 'Nexus Studio', 'Creative Agency', 'Complete brand identity and visual system for a forward-thinking creative agency.', 'Nexus Studio needed a complete brand overhaul to match their ambitious vision. I crafted a comprehensive visual identity system that included everything from logo design to full marketing collateral, establishing a cohesive brand presence across all touchpoints.', 'Lead Brand Designer', ARRAY['Brand Identity','Logo Design','Marketing Collateral','Brand Guidelines'], 'Increased brand recognition by 300% within the first quarter of launch.', '/images/companies/nexus-studio/logo.png', '/images/companies/nexus-studio/cover.jpg', ARRAY['/images/home/selected-works-1.jpg','/images/home/selected-works-2.jpg','/images/companies/nexus-studio/design-1.jpg'], true, '/images/home/selected-works-1.jpg', 'Brand Identity', 1),
('prism-creative', 'Prism Creative', 'Design Studio', 'Premium packaging design for an artisan cosmetics brand.', 'Prism Creative''s artisan cosmetics line required packaging that communicated luxury and authenticity. I designed a packaging system that was both visually stunning and functional, using premium materials and sophisticated typography.', 'Packaging Designer', ARRAY['Packaging Design','Product Photography Direction','Print Production'], 'Product line saw a 45% increase in retail sales after the redesign.', '/images/companies/prism-creative/logo.png', '/images/companies/prism-creative/cover.jpg', ARRAY['/images/home/selected-works-2.jpg','/images/home/selected-works-4.jpg','/images/companies/prism-creative/design-1.jpg'], true, '/images/home/selected-works-2.jpg', 'Packaging Design', 2),
('lunar-agency', 'Lunar Agency', 'Digital Agency', 'Bold typographic campaign for a cutting-edge digital agency.', 'Lunar Agency wanted to make a bold statement in the digital space. I created a series of typographic posters and digital campaigns that pushed creative boundaries while maintaining brand consistency across all platforms.', 'Creative Director', ARRAY['Campaign Design','Typography','Art Direction','Digital Assets'], 'Campaign reached 2M+ impressions and won a regional design award.', '/images/companies/lunar-agency/logo.png', '/images/companies/lunar-agency/cover.jpg', ARRAY['/images/home/selected-works-3.jpg','/images/home/selected-works-5.jpg','/images/companies/lunar-agency/design-1.jpg'], true, '/images/home/selected-works-3.jpg', 'Campaign Design', 3),
('vertex-labs', 'Vertex Labs', 'Tech Company', 'Social media design system for a growing tech startup.', 'Vertex Labs needed a cohesive social media presence that would set them apart in the competitive tech landscape. I developed a comprehensive social media design system with templates, guidelines, and a vibrant visual language.', 'Social Media Designer', ARRAY['Social Media Design','Content Strategy','Template System'], 'Social engagement increased by 200% within three months.', '/images/logos/company-4.png', '/images/home/selected-works-4.jpg', ARRAY['/images/home/selected-works-4.jpg','/images/home/selected-works-2.jpg'], true, '/images/home/selected-works-4.jpg', 'Social Media', 4),
('aurora-brand', 'Aurora Brand', 'Fashion Label', 'Editorial design for a premium fashion magazine.', 'Aurora Brand''s fashion magazine required a sophisticated editorial design that would complement their high-end content. I crafted elegant layouts with careful attention to typography, whitespace, and image treatment.', 'Editorial Designer', ARRAY['Magazine Layout','Editorial Design','Typography','Photo Editing'], 'Magazine became the most-read fashion publication in the region.', '/images/logos/company-5.png', '/images/home/selected-works-5.jpg', ARRAY['/images/home/selected-works-5.jpg','/images/home/selected-works-3.jpg'], true, '/images/home/selected-works-5.jpg', 'Editorial Design', 5),
('echo-digital', 'Echo Digital', 'SaaS Platform', 'UI/UX design for a next-gen project management platform.', 'Echo Digital required a modern, intuitive interface for their SaaS platform. I delivered a complete UI overhaul with a focus on user experience, accessibility, and visual consistency.', 'UI/UX Designer', ARRAY['UI Design','UX Research','Design System','Prototyping'], 'User retention increased by 60% after the redesign.', '/images/logos/company-1.png', '/images/home/selected-works-1.jpg', ARRAY['/images/home/selected-works-1.jpg','/images/home/selected-works-3.jpg'], false, '/images/home/selected-works-1.jpg', 'UI/UX Design', 6),
('horizon-media', 'Horizon Media', 'Media House', 'Motion graphics and video branding for a digital media company.', 'Horizon Media needed dynamic motion graphics that would elevate their video content. I created a comprehensive motion identity system including intros, lower thirds, and transition effects.', 'Motion Designer', ARRAY['Motion Graphics','Video Branding','Animation','Storyboarding'], 'Video engagement rates doubled within the first month.', '/images/logos/company-2.png', '/images/home/selected-works-2.jpg', ARRAY['/images/home/selected-works-2.jpg','/images/home/selected-works-4.jpg'], false, '/images/home/selected-works-2.jpg', 'Motion Design', 7),
('zenith-collective', 'Zenith Collective', 'Art Collective', 'Exhibition branding and environmental graphics for art spaces.', 'Zenith Collective needed immersive environmental graphics for their gallery exhibitions. I designed wayfinding systems, exhibition catalogs, and spatial branding that enhanced the visitor experience.', 'Environmental Designer', ARRAY['Exhibition Design','Wayfinding','Catalog Design','Spatial Branding'], 'Exhibition attendance grew by 150% year-over-year.', '/images/logos/company-3.png', '/images/home/selected-works-3.jpg', ARRAY['/images/home/selected-works-3.jpg','/images/home/selected-works-5.jpg'], false, '/images/home/selected-works-3.jpg', 'Environmental Design', 8),
('pulse-fitness', 'Pulse Fitness', 'Wellness Brand', 'Complete brand identity for a premium fitness and wellness startup.', 'Pulse Fitness wanted a brand that communicated energy, discipline, and premium quality. I built a full visual identity from logo to merchandise, app UI, and marketing assets.', 'Brand Designer', ARRAY['Brand Identity','App UI','Merchandise Design','Marketing Assets'], 'Secured $500K in seed funding partly attributed to strong brand presence.', '/images/logos/company-4.png', '/images/home/selected-works-4.jpg', ARRAY['/images/home/selected-works-4.jpg','/images/home/selected-works-1.jpg'], false, '/images/home/selected-works-4.jpg', 'Brand Identity', 9);

-- Seed reviews (each unique avatar entry)
INSERT INTO public.reviews (client_name, role, company, avatar_url, expanded_image_url, review_text, short_text, rating, sort_order) VALUES
('Arif Rahman', 'CEO', 'Nexus Studio', '/images/reviews/client-1.jpg', '/images/home/selected-works-1.jpg', 'Working with this designer was transformative for our brand. The attention to detail and creative vision exceeded all expectations. Every deliverable was polished, on time, and perfectly aligned with our vision. I''ve never experienced such a seamless creative process.', 'Transformative work that exceeded all expectations.', 5, 1),
('Nadia Sultana', 'Marketing Director', 'Prism Creative', '/images/reviews/client-2.jpg', '/images/home/selected-works-2.jpg', 'The packaging designs completely transformed our product line. Sales increased dramatically and we received countless compliments from customers. The designer understood our brand essence and translated it into visual perfection.', 'Our product line was completely transformed.', 5, 2),
('Kamal Hassan', 'Founder', 'Lunar Agency', '/images/reviews/client-3.jpg', '/images/home/selected-works-3.jpg', 'Incredible creative vision combined with flawless execution. The campaign designs were bold, memorable, and drove real business results. This is someone who truly understands the intersection of aesthetics and strategy.', 'Bold designs that drove real business results.', 5, 3),
('Fatima Begum', 'Brand Manager', 'Vertex Labs', '/images/reviews/client-1.jpg', '/images/home/selected-works-4.jpg', 'Our social media presence went from forgettable to iconic. The design system was so well-structured that our team could create on-brand content independently. A true strategic thinker with impeccable taste.', 'From forgettable to iconic social presence.', 5, 4),
('Rafiq Ahmed', 'Creative Director', 'Aurora Brand', '/images/reviews/client-2.jpg', '/images/home/selected-works-5.jpg', 'The editorial designs brought a new level of sophistication to our magazine. Every page was a masterclass in typography and layout. Working together felt like a true creative partnership.', 'A masterclass in typography and layout.', 4, 5),
('Samira Islam', 'Product Lead', 'Nexus Studio', '/images/reviews/client-3.jpg', '/images/home/selected-works-1.jpg', 'Delivered beyond what we imagined possible. The brand identity work was cohesive, modern, and instantly recognizable. Our stakeholders were unanimously impressed, and the brand guidelines have become our creative bible.', 'Cohesive and instantly recognizable branding.', 5, 6),
('Tariq Hossain', 'CTO', 'Echo Digital', '/images/reviews/client-1.jpg', '/images/home/selected-works-2.jpg', 'The UI/UX redesign was nothing short of revolutionary for our platform. User onboarding time dropped by 40% and customer satisfaction scores hit an all-time high. Exceptional understanding of both design and technology.', 'Revolutionary UI/UX that transformed our platform.', 5, 7),
('Ayesha Khan', 'Head of Marketing', 'Horizon Media', '/images/reviews/client-2.jpg', '/images/home/selected-works-3.jpg', 'The motion graphics elevated our entire video production quality. Every animation felt purposeful and on-brand. Our audience engagement metrics have never been better.', 'Motion graphics that elevated our entire brand.', 4, 8),
('Imran Chowdhury', 'Gallery Director', 'Zenith Collective', '/images/reviews/client-3.jpg', '/images/home/selected-works-4.jpg', 'The exhibition design work was breathtaking. Visitors consistently praised the wayfinding and spatial branding. It completely transformed how people experience our gallery spaces.', 'Breathtaking exhibition design work.', 5, 9),
('Rima Akter', 'Founder & CEO', 'Pulse Fitness', '/images/reviews/client-1.jpg', '/images/home/selected-works-5.jpg', 'From logo to app interface to merchandise — every touchpoint was designed with incredible care. Investors were genuinely impressed by our brand presence, which played a key role in our funding round.', 'Every touchpoint designed with incredible care.', 5, 10),
('Zahid Mahmud', 'Operations Director', 'Vertex Labs', '/images/reviews/client-2.jpg', '/images/home/selected-works-1.jpg', 'Working with Mahtamun was a game-changer for our internal communications design. The templates and visual systems he created have saved our team countless hours while maintaining brand consistency.', 'A game-changer for our visual communications.', 4, 11);

-- Seed site content
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
('global','footer','nav_title','Navigation'),
('global','footer','connect_title','Connect'),
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
('showcase','about','title','About My Work'),
('showcase','designs','title','Design Showcase'),
('showcase','cta','title','Interested in working together?'),
('showcase','cta','description','Let''s discuss your project and bring your vision to life.'),
('showcase','cta','button_meeting','Book Meeting'),
('showcase','cta','button_contact','Contact'),
('showcase','cta','whatsapp_url','https://wa.me/8801795931345'),
('reviews','header','title','Client Reviews'),
('reviews','header','description','Hear from the brands we''ve helped transform through design.'),
('contact','header','title','Let''s Build Something Together'),
('contact','header','description','Whether you have a project in mind, want to discuss a collaboration, or just want to say hello — I''d love to hear from you.'),
('contact','brands','title','Brands I''ve Worked With'),
('contact','form','title','Get in Touch'),
('contact','form','description','Drop me a message using the form. I''ll get back to you within 24 hours. Let''s discuss your vision and bring it to life.'),
('contact','form','email','mahtamunhoquefahim@pm.me'),
('contact','form','whatsapp','+880 1795 931345'),
('contact','form','whatsapp_url','https://wa.me/8801795931345');
