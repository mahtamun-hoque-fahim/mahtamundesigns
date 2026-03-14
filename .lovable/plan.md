

# Complete Website Recreation Prompt

Here is a detailed, self-contained prompt you can use to recreate this exact website from scratch:

---

## Prompt

Build a **dark-themed personal portfolio website** for a Logo & Brand Identity Designer using **React, Vite, TypeScript, Tailwind CSS, and Framer Motion**. The site must have a fully dynamic **CMS-driven architecture** where all text, images, and content are stored in a database (Supabase) and editable through an admin dashboard. Use **Space Grotesk** as the display/heading font and **DM Sans** as the body font.

---

### Color Scheme (Dark Mode Only)

- Background: `hsl(240 6% 6%)` (near-black)
- Card: `hsl(240 5% 10%)`
- Primary: `hsl(263 70% 58%)` (purple/violet)
- Foreground: `hsl(45 20% 90%)` (warm off-white)
- Muted foreground: `hsl(240 5% 50%)`
- Border: `hsl(240 4% 18%)`
- Custom thin scrollbar matching the theme
- No light mode needed

---

### Global Layout

**Header** (fixed, sticky top, backdrop blur):
- Brand name on the left as bold text with a colored dot (e.g., "MAHTAMUN.")
- Navigation links: Home, Portfolio, Reviews, Contact
- CTA button linking to WhatsApp ("Book a Meeting")
- Mobile: hamburger menu that toggles a dropdown nav
- All nav labels and CTA text/URL are CMS-editable

**Footer** (three-column grid):
- Column 1: Brand name + short description
- Column 2: Navigation links repeated
- Column 3: Social links (Instagram, Behance, Dribbble, Email)
- Bottom bar with copyright and tagline
- Background uses a faint version of the hero background image
- All text and URLs are CMS-editable

---

### Pages

#### 1. Homepage (`/`)

Sections in order:

1. **Hero Section** — Full-screen with a background image on the left, person cutout image on the right (desktop only). Left side has: eyebrow tag with sparkle icon ("Available for New Projects"), large heading, subtitle paragraph, three trust badges inline (e.g., "50+ Projects Delivered | 6+ Years Experience | 100% Satisfaction"), two CTA buttons ("View Portfolio" primary, "Start a Project" outline). All text CMS-editable. Images come from a Media Library system (database-managed).

2. **Logo Strip** — Horizontally auto-scrolling infinite strip of client logos (fetched from the companies database). Logos are inverted to white, low opacity, pauses on hover. CSS keyframe animation (`translateX(-50%)`).

3. **Services Section** — Centered eyebrow + heading + subtitle. 4-column grid of service cards (Logo Design, Brand Identity, Social Media Design, Web & UI Design). Each card has an icon, title, description. Cards have hover effect (border color change, background tint). Animated into view with IntersectionObserver. All text CMS-editable.

4. **Selected Works** — Asymmetric bento-grid layout (12-column grid with varying `col-span` values like 7+5, 5+7, 8+4). Shows up to 5 featured companies. Each card is a link to `/clients/:slug`, showing the featured image (grayscale, color on hover), gradient overlay, company name, category tag, short description on hover. "View Portfolio" button below. Animated on scroll.

5. **Mid-Page CTA** — Rounded card with gradient background (`from-primary/10`), heading, subtitle, two buttons (primary + outline). CMS-editable.

6. **How It Works / Process Section** — 4 steps (Discovery Call, Research & Concepts, Design & Refine, Final Delivery). **Desktop**: two-column layout where the left column has a sticky image (`sticky top-32, h-[70vh]`) that transitions with `AnimatePresence` as the user scrolls. Right column has steps spaced with `min-h-[70vh]` each, tracked by `IntersectionObserver` (threshold 0.6). Active step is full opacity, inactive steps are 30% opacity. Step indicator dots overlay on the image. **Mobile**: stacked vertically, each step has its own image above the text. Step images come from the Media Library.

7. **Reviews Preview** — Auto-rotating testimonial carousel (5-second interval with animated progress bars). Shows quote icon, review text in italics, avatar, client name, role, and company. Progress indicator below as thin bars filling left to right. "Read All Reviews" link. CMS-editable labels. Reviews fetched from database.

8. **Stats Section** — 4-column grid with animated count-up numbers (triggered by IntersectionObserver). Stats like "6+ Years Experience", "600+ Designs Created", "11 Happy Clients", "100% Client Satisfaction". Values, suffixes, and labels all CMS-editable.

9. **Bottom CTA** — Rounded card with hero background image at low opacity, heading, description, WhatsApp "Book a Meeting" button (rounded-full, inverted colors), "View Portfolio" outline button, and a rotated review/client image on the right (desktop only). CMS-editable.

#### 2. Clients / Portfolio Page (`/clients`)

- Page heading with last word highlighted in primary color
- Subtitle paragraph
- Asymmetric 12-column bento grid of company cards (varying spans like 8+4, 5+7, 4+4+4, etc.)
- Each card: featured image (grayscale, color on hover), gradient overlay, logo + name + tagline, short description, "View Project" text that appears on hover
- All data from database

#### 3. Company Showcase Page (`/clients/:slug`)

- **Hero**: Full-width cover image with gradient overlay. Company logo (inverted white) and name/tagline overlaid at bottom
- "Back to Clients" link
- **About Section**: Two-column — left has full description, right has Role, Contributions (as pill badges), and Impact
- **Design Showcase**: Supports two layout modes controlled from CMS:
  - **Grouped Mode**: Multiple project groups, each with a numbered title, optional subtitle, and a masonry image grid
  - **Simple Mode**: Single masonry grid of all images
- **Masonry Grid**: CSS columns (`columns-1 sm:columns-2 lg:columns-3 xl:columns-4`), `break-inside-avoid`, images at natural aspect ratio (never cropped). Hover effect: `scale(1.03)` + shadow. Click opens lightbox.
- **Lightbox**: Full-screen overlay (`bg-background/95 backdrop-blur`), prev/next navigation, close button, image counter. Framer Motion enter/exit animations.
- **CTA Section**: Card with heading, description, two buttons (WhatsApp + Contact page). CMS-editable.

#### 4. Reviews Page (`/reviews`)

- Page heading with highlighted last word
- Asymmetric 12-column bento grid of review cards (varying spans)
- Each card: avatar, name, role/company, star rating (1-5), short review text, "Read more" link
- Click opens a **modal** with: left side shows expanded image (desktop), right side shows full review text, star rating, client details, and a "Book Meeting" WhatsApp CTA button
- Framer Motion enter/exit for modal

#### 5. Contact Page (`/contact`)

- Page heading with highlighted last word + subtitle
- Scrolling logo strip of client logos (same as homepage)
- Two-column layout:
  - Left: heading, description, email address, WhatsApp number, social icons (Instagram, Behance, Dribbble, Email) as circular bordered buttons
  - Right: Contact form with Name, Email (side by side), Subject, Message textarea, Send button
- Form submits to database (`contact_messages` table) and triggers a notification edge function
- Success state shows checkmark icon and thank you message with "Send Another" button

#### 6. Admin Login (`/admin/login`)

- Centered login form with email + password
- "Forgot Password" link (sends reset email)
- "Emergency Access" mode using master credentials (edge function validates against stored secrets, generates a magic link OTP)
- Session termination message if logged in from another device
- Emergency login warning (once per 30 days, recorded as security alert)

#### 7. Admin Dashboard (`/admin`)

- **Sidebar navigation** (collapsible, 60px when collapsed, 240px expanded) with sections: Dashboard, Messages, Pages, Content Blocks, Media Library, Media Store, Reviews, Clients, Analytics, Activity Log, Settings
- **Top bar** with hamburger toggle and current page title
- **Session management**: Single-device enforcement. On login, all other sessions are terminated. Heartbeat every 60 seconds. Session validity check every 30 seconds. If session becomes invalid, auto-logout with reason message.

Dashboard sections:

- **Dashboard Overview**: Summary metrics widget, quick navigation to other sections
- **Messages**: View contact form submissions with search, read/unread status tracking, reply via email
- **Pages (Content Editor)**: Edit all CMS text content (organized by page > section > key)
- **Content Blocks**: Tabbed view to manage Reviews and Clients data blocks
- **Media Library**: Manage all site images (hero, process steps, etc.) with slot-based system. Shows usage indicators (which page/section uses each image). Delete protection with confirmation for in-use images. Upload replaces existing image and invalidates cache.
- **Media Store**: General file storage management
- **Reviews Manager**: CRUD for client reviews (name, role, company, rating, short text, full text, avatar, expanded image, sort order)
- **Clients Manager**: CRUD for companies (name, slug, tagline, descriptions, role, contributions, impact, logo, cover, featured image, designs array, layout mode toggle, category, sort order, featured flag). Includes Project Groups editor (create groups with title + subtitle, upload images to groups, reorder)
- **Analytics**: Visitor analytics from `page_views` table (page paths, devices, browsers, OS, referrers, sessions)
- **Activity Log**: Audit trail of all admin actions
- **Settings**: Account and security management

---

### Backend (Supabase)

**Database Tables:**
- `site_content` — CMS key-value store (page, section, content_key, content_value)
- `companies` — Client/company data with `layout_mode` field ("grouped" or "simple")
- `project_groups` — Groups within a company (title, subtitle, sort_order, company_id)
- `project_images` — Images within groups or ungrouped (image_url, sort_order, company_id, group_id nullable)
- `reviews` — Client reviews with rating, avatar, expanded image
- `media_assets` — Slot-based media system (slot_key, label, category, public_url, file_path)
- `media_store` — General file storage with tagging
- `media_tags` — Tags for media store items
- `contact_messages` — Form submissions (name, email, subject, message, is_read, email_notified, source_page)
- `page_views` — Analytics (page_path, referrer, user_agent, device_type, browser, os, session_id)
- `admin_sessions` — Active session tracking (session_token, user_id, is_active, device info, heartbeat)
- `login_history` — All login attempts (success/fail, method, device info)
- `security_alerts` — Suspicious login detection (new device, new location, failed attempts, emergency login)
- `admin_settings` — Recovery email configuration

**Storage:** `site-media` public bucket for uploaded images.

**Edge Functions:**
- `notify-contact` — Sends styled HTML email via Resend API when a contact form is submitted (if daily count <= 5)
- `daily-contact-summary` — Batch email summary of all un-notified messages (triggered at scheduled time)
- `emergency-login` — Validates master credentials from secrets and generates a magic link OTP
- `create-admin` — One-time admin user creation

**RLS Policies:** Public read on companies, reviews, site_content, media_assets, page_views (insert only). Authenticated full access on admin tables. Contact messages: public insert, authenticated read/update/delete.

**Visitor Tracking:** Bot detection (comprehensive UA pattern list), human verification (waits for scroll/mouse/touch/click), rate limiting (2s minimum between records), excludes admin sessions, generates anonymous session IDs.

**Security:** Single-device session enforcement, suspicious login detection (new device/location/browser/IP, failed attempt patterns), emergency master credential system with audit logging, session heartbeats and validity polling.

---

### Technical Patterns

- **CMS Hook** (`useCms`): Returns a function `c(page, section, key, fallback)` that looks up text from the `site_content` table with static fallbacks
- **Media Hook** (`useMediaUrl`): Returns URL for a slot key with fallback, uses in-memory cache with invalidation
- **Data Hooks**: `useCompanies()`, `useReviews()` with in-memory caching and static data fallbacks
- **IntersectionObserver Hook** (`useInView`): Triggers animations when elements enter viewport
- **Count-Up Hook** (`useCountUp`): Animates numbers from 0 to target value
- **Lazy Image Component**: Wrapper for images with aspect ratio support and object-fit
- **Route Indicator**: Visual loading indicator on route changes
- All animations use Framer Motion with staggered delays

---

