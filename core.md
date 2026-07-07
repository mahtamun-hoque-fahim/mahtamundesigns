# CORE.md — Process Log & Ground Rules

This file exists so neither Claude nor anyone else forgets how this project is being built. It is a living log — append, don't overwrite.

---

## Ground Rules (set 2026-07-02, updated 2026-07-05)

1. **No pipeline.** No auto-triggered skills, no Citadel/Council/Singularity flow for this project. This is a manual, hands-on build.
2. **Section-by-section.** Fahim hands over one page at a time. Within a page, one section is built at a time.
3. **Confirm before advancing.** After each section is built, stop. Wait for Fahim to review output and explicitly confirm before starting the next section.
4. **Image-heavy, not flat.** This is a graphic designer's portfolio — visuals carry weight. Avoid default flat/minimal treatment unless explicitly asked for. Lean into real image content, not placeholder blocks.
5. **Pause & Explain.** If Fahim says "pause, explain," stop building and explain the reasoning/decision in plain terms. That explanation gets logged here in CORE.md, dated, so it persists.
6. **Per-page log.** When a page is fully done, write a `[pagename].md` documenting the build from a designer's perspective — layout logic, visual decisions, what worked, what was tried.
7. **Future skill use.** These page logs are intended to eventually inform/improve the `cave-man` and `ui-ux-designer` skills. Skills are NEVER modified without Fahim's explicit confirmation, even if the log content clearly suggests an improvement.
8. **Running audit log.** Across the whole build, maintain a log of loose frontend ends — UI built but not yet wired to backend/data — so nothing gets forgotten before the eventual full audit + dashboard pass.
9. **Resolution = mark done, never delete.** When a loose end or loose anchor resolves, update its row's Status to `✅ Resolved (date)` with a one-line note on how — do NOT remove the row. The tables are a history, not just a live to-do list.
10. **Smooth micro-interactions.** (Locked 2026-07-05) Every click, hover, animation, transition, entrance/exit must be smooth. No instant snaps. Proper easing (ease-in-out, not linear defaults), visual feedback on every interaction, scale/fade/translate animations with timing that feels intentional. This applies to every element built now and in future.

---

## Project Snapshot (read this first if you're a new Claude instance)

- **Project:** Mahtamun's personal graphic-designer portfolio site.
- **Repo:** github.com/mahtamun-hoque-fahim/mahtamundesigns
- **Stack:** Next.js 16.2.10 (App Router, Turbopack default) · TypeScript · Tailwind v4 · deployed to Vercel eventually.
- **No `src/` dir** — `app/`, `components/`, `lib/`, `public/` live at repo root.
- **Process:** homepage first, section by section, in the exact order the reference design shows. Each section is built, Fahim reviews, confirms, THEN next section starts. Do not skip ahead or batch multiple sections without confirmation.
- **Design source of truth:** reference screenshots Fahim provides ARE the final design — replicate exactly, don't reinterpret. Do not apply frontend-design skill's "brainstorm your own direction" process when a screenshot is provided; only use it for typography/quality-floor judgment calls not visible in the screenshot.
- **Push cadence:** don't push after every single section by default — Fahim gives explicit "start pushing" instructions per phase. Check the most recent instruction before assuming push cadence.
- **Design tokens locked in `app/globals.css`:**
  - `--color-bg: #0a0a0a`, `--color-bg-alt: #131313`, `--color-surface: #1a1a1a`
  - `--color-accent: #bb7cff` (sourced from the logo SVG's accent dot), `--color-accent-dim: #7c4fd6`
  - `--color-line: #2a2a2a`, `--color-muted: #9a9a9a`
  - `--color-surface-light: #ffffff`, `--color-ink: #0a0a0a` (used for light-background sections like Reviews)
  - Fonts: `--font-display` = Space Grotesk (headline/display use), `--font-mono` = JetBrains Mono (nav, labels, body, eyebrows — matches the technical/monospace feel of the reference)
- **Typography lock:** Space Grotesk (`--font-display`) is CONFIRMED and LOCKED for all titles/headings across the whole project, not just Hero. Fahim explicitly approved it after inspecting Lovable's devtools. Use `font-display` class for every heading going forward — do not introduce a different display font without him asking first.
- **Shared horizontal baseline — REVERTED (2026-07-03, same day it was added).** Was briefly a hard rule (`max-w-[1400px]` / `px-6 md:px-10` everywhere, no exceptions but Trusted-by). Fahim undid it — Hero is BACK to `md:pl-20 lg:pl-28` push-right, Featured Projects grid is BACK to `lg:px-12 xl:px-24` narrowing. **Do not re-apply the shared-baseline rule without a fresh explicit instruction** — this was tried and explicitly undone, not a stale note to "fix."
- **Logo asset:** `public/logo/mahtamun-wordmark.svg` — white wordmark + purple accent dot, built for dark backgrounds only.
- **Component structure:** `components/sections/` for full page sections (navbar, hero, etc.), `components/ui/` for reusable small pieces (buttons, cards).

## Fonts — self-hosted, not next/font/google

Switched away from `next/font/google` because this sandbox's bash tool cannot reach `fonts.googleapis.com` (not on the allowed-domains list), which broke local builds. Using `@fontsource/space-grotesk` and `@fontsource/jetbrains-mono` instead (imported directly in `app/layout.tsx`, specific weight files only — 500/600/700 for Space Grotesk, 400/500/600/700 for JetBrains Mono). This is now the standing approach for this repo — do not switch back to `next/font/google` without checking network access first.

## Global CSS Rules (LOCKED)

- **Smooth scroll behavior** — `html { scroll-behavior: smooth; }` in `app/globals.css`. Applied globally to every page, every anchor link, every scroll event. DO NOT remove or override. Every new page inherits this automatically. (Locked 2026-07-05)

## Sections Built So Far

1. **Navbar** (`components/sections/navbar.tsx`) — logo, nav links (Home/Showcase/Reviews/About), **Contact CTA** (text changed from "Book Meeting" on 2026-07-05). **STICKY/FIXED** (`position: fixed`), **scroll-conditional background**: transparent at top, `bg-black/10 backdrop-blur-lg border-b border-white/5` once scrolled past 12px. Went always-on → scroll-conditional → Fahim wanted scroll-conditional back (client component with scroll listener). This is the current standing behavior. **Also auto-hides** while scrolled through any section tagged `data-nav-hide="true"` (currently just Reviews) — see that section's notes below for the mechanism.
   - **Universal component:** same navbar on every page (homepage, /about, company pages, etc.). Claude starts every new page with navbar already wired in — Fahim will never say "start navbar", it's automatic.
   - **Future: dynamic CTA button color on company pages.** When building `/clients/[slug]` pages, the CTA button's background color will change to match that company's logo accent color (sampled from the brand asset, not hardcoded).

   **Root cause of the earlier background/glow confusion:** it was never about the image or a missing CSS glow layer. `position: fixed` removes the navbar from document flow, so before, when nav was `absolute`, the hero content had `pt-20`/`pt-16` compensating for it, effectively shrinking the visible hero area and making the background image's edge glow look thinner. Once nav went `fixed` and that top padding was removed, the hero's actual container is the full viewport again — the background image (with `object-cover`) fills correctly and the glow reads right. The CSS glow-overlay hack and the object-contain experiment were both solving the wrong problem — lesson: check layout/spacing causes before reaching for visual-asset-level fixes.

2. **Hero** (`components/sections/hero.tsx`) — full-bleed background image (`public/images/hero-bg.webp`, pattern+glow baked into the asset by Fahim, NOT built as CSS/SVG), name headline (font-display, Space Grotesk), role subtitle, Portfolio/Contact buttons with lucide-react icons, portrait cutout (`public/images/hero-portrait.webp`, RGBA/transparent, confirmed alpha survives WebP conversion).
   - Button hrefs are placeholders (`#showcase`, `#contact`) — Fahim will confirm real destinations once the full page is built. **Do not treat these as final.**
   - **Hero height rule — LOCKED (2026-07-05):** hero = exactly `h-screen` (100vh, full viewport). Navbar is fixed on top, doesn't consume viewport space. Use `h-screen` on any hero section.
   - **Background image fit — use `object-contain`, NOT `object-cover`.** `hero-bg.webp`'s purple glow pattern lives at the far left/right edges of the image. `object-cover` crops inward on any viewport whose aspect ratio is narrower/taller than the image (1920x1078), which cuts the glow off entirely — this happened in production and Fahim caught it visually. `object-contain` + matching `bg-bg` behind it (image's near-black areas are `rgb(9,9,9)`, close enough to `#0a0a0a` to blend invisibly) keeps both edges visible always. Do not revert to `object-cover` for this asset.
   - **Composition — text and portrait must sit close together, minimal dead space.** First pass used `w-1/2` + `w-1/2` columns with `justify-between`, which left a huge empty gap in the middle on wide viewports — didn't match the reference's tight composition (portrait sits close to the text block, not floated far right). Second pass (`flex-1` + `max-w-[640px]`) improved it but Fahim compared against a Lovable-generated version with tighter spacing and confirmed: keep original copy/nav/buttons, only borrow the spacing approach. **Final approach:** text lives in its own padded container (`max-w-lg`, normal section padding); portrait is a SEPARATE absolutely-positioned element (`absolute inset-y-0 right-0 w-[46%]`) that bleeds all the way to the browser's right edge with zero padding/gutter — it is NOT part of the padded flex row anymore. This is what actually closed the visual gap: the portrait touching the true viewport edge, not just being sized bigger. If gap issues resurface, check whether the portrait is still full-bleed to `right-0` with no padding ancestor constraining it.
   - **Glow overlay — CSS-layered, not baked into the asset.** `hero-bg.webp`'s actual glow only occupies the outer ~15% of each edge — compared against a Lovable-generated reference, Fahim confirmed our render of the raw asset was accurate but visually thinner than Lovable's, which layers extra glow via CSS. Added a `mix-blend-screen` radial-gradient overlay (`rgba(187,124,255,0.35)` at 0% and 100% x-position) sitting between the bg image and content to amplify the purple bleed without needing a new asset. **REVERTED — Fahim said it made things look worse.** Do not re-add this overlay without explicit direction.
   - **Background object-fit — back to `object-cover`** (not `object-contain`). Fahim's explicit instruction after reverting the glow overlay attempt. Note: `object-cover` was the ORIGINAL source of the edge-cropping bug (see above) — reintroducing it may bring that issue back on narrow/tall viewports. Watch for this; don't be surprised if it resurfaces.
   - **Text block position** — vertical: `translate-y-2`, `md:translate-y-6` (small downward offset from true center — went too far down at `translate-y-10/16`, Fahim asked for "just a bit up" from that, this is the corrected value). Horizontal: pushed further right via container padding (`md:pl-20 lg:pl-28`, asymmetric — right side stays at `md:pr-10`). If either axis is still off, ask for a specific direction/amount rather than guessing again.
   - **Three-dot decorative element** above the H1 — REMOVED per Fahim's instruction (2026-07-03). Do not re-add.

3. **Trusted-by strip** (`components/sections/trusted-by.tsx`) — "TRUSTED BY RISING BANGLADESHI BRANDS" eyebrow + single-row infinite auto-scroll marquee, 31 logos total. Logos are grayscale/50% opacity by default, full color on hover.
   - **Logo assets:** `public/logos/*.webp`, all pre-converted to WebP by Fahim, all normalized to ~120px height, transparent backgrounds confirmed intact.
   - **Resolved:** `logo.webp` renamed to `joynal-academy.webp` — identified by reading the actual pixels (it says "JOYNAL ACADEMY"), alt text fixed. Naming convention for this whole set: source files were `[Brand Name] strip.png/webp` — brand name is a prefix, "strip" is always the suffix to strip off.
   - **Sizing** — `h-10 md:h-12` logo display height, `py-14 md:py-16` section padding. Fahim asked to shrink it, then said undo — this is the CURRENT correct state.
   - **Layout — SINGLE marquee row, not dual-row.** Originally built as two rows scrolling opposite directions; Fahim asked to consolidate into one row. All 31 logos now share one continuous scrolling track. The `animate-marquee-right` keyframe in `globals.css` is unused but left in place.
   - **Hover behavior — JS-driven, not CSS.** The CSS `animation-duration` approach caused a visible jump/restart on hover. Replaced with a `requestAnimationFrame` loop (client component) that tracks continuous position in a ref and eases current speed toward a target speed every frame — position never resets, speed transitions smoothly. The old `@keyframes marquee-left/right` and `.animate-marquee-*` classes in `globals.css` were REMOVED entirely.
   - **Speed values** — derived from the ORIGINAL duration numbers (`40s` full loop / `120s` slow), not arbitrary px/s constants: `fastSpeed = loopWidth / 40`, `slowSpeed = loopWidth / 120`, computed after measuring the track's real `scrollWidth` on mount.

4. **Featured Projects** (`components/sections/featured-projects.tsx`) — "Showcase" eyebrow + "FEATURED PROJECTS" heading (renamed from "Portfolio"/"SELECTED WORKS"), asymmetric grid: 1 large featured card full-width on top (`md:col-span-2`), 2 smaller cards below side by side. "SEE ALL" button.
   - **Data model:** `FEATURED_PROJECTS` array, typed (`FeaturedProject`), explicitly commented `TODO(dashboard)` — count, ordering, project type labels, and thumbnails are all meant to be dashboard-controlled eventually. Hardcoded to exactly 3 for now: Fahad's Tutorial (featured/large), Motovessel, Interting.
   - **Field naming:** the small label above each project's title is called `projectType` in code (matches Fahim's terminology exactly — NOT `category`).
   - **Background — BUG FIXED (image wasn't rendering at all).** Root cause: the image wrapper used `-z-10` (negative z-index) inside a section that was only `relative` (no `isolate`/explicit stacking context), so it escaped to stack against the WRONG ancestor. Fixed: added `isolate` to the section, changed the image wrapper to `z-0` (non-negative), content stays `z-10`. **Lesson for future Claude:** negative z-index (`-z-*`) on a background layer is a common source of "asset exists but doesn't render" bugs — prefer `isolate` + non-negative z-index layering over negative z-index tricks.
   - **File size flag (not yet acted on):** `featured-projects-bg.webp` is 2.3MB — quite heavy for a background asset. Worth revisiting if load performance becomes a concern.
   - **Bottom glow color:** sampled the ACTUAL pixel color from `featured-projects-bg.webp`'s glow region (`rgb(160,83,242)`, a deeper violet than the site's `--color-accent` token) and used that exact color (`rgba(160,83,242,0.4)`, radial-gradient, `h-[420px]`, `bottom-0`) rather than defaulting to the accent token. Don't default to `--color-accent` for glows meant to match this specific background asset — sample the real pixel color instead.
   - **Card heights** — increased to `min-h-[481px]` (featured) / `min-h-[377px]` (smaller), a 30% increase from `370px`/`290px`. History of increases: `280/220` → `308/242` (+10%) → `370/290` (+20%) → `481/377` (+30%, current). Always `grep` current values before doing percentage-based size changes rather than assuming a previously-logged number is still accurate.
   - **Card grid width** — `lg:px-12 xl:px-24` on the grid container to pull cards in from the section's full width on large/wide viewports.
   - **"SEE ALL" button** — white bg, dark text, purple ambient glow via `box-shadow` (`shadow-[0_0_50px_rgba(187,124,255,0.35)]`, intensifies on hover).
   - **Project type labels** — all set to placeholder `"Brand Identity"` for now, not confirmed real values.
   - **Thumbnail hover behavior:** when `thumbnail` is set (not `null`), renders via `next/image` `fill`, `grayscale brightness-75` by default, `group-hover:grayscale-0 group-hover:brightness-100` on hover, plus a `bg-gradient-to-t from-black/80` overlay for text legibility. Empty-state placeholder (hatch pattern + "THUMBNAIL PENDING") shows when `thumbnail: null`. **Important:** there is NO separate logo overlay element — any brand logo visible on a card is baked into the thumbnail image itself at design time, not a UI layer Claude controls. Contrast/legibility of text *within* the thumbnail image is Fahim's responsibility as the designer.

5. **Reviews / Impressions** (`components/sections/reviews.tsx`) — light/white background (`bg-surface-light`, `text-ink`), contrast break from the rest of the dark homepage. "Customer Reviews and" eyebrow + "IMPRESSIONS" heading, "SEE ALL" button after.
   - **Scroll-jack horizontal track — the defining feature of this section.** Vertical scroll gets captured and translated into horizontal card movement across all 4 reviews, THEN releases back to normal vertical scroll. Implemented as: outer `<section>` with `height: 350vh` (gives enough vertical scroll distance to drive the horizontal travel), inner `sticky top-0 h-screen` container holds the heading + card track, and a scroll listener computes `progress = -sectionTop / (sectionHeight - viewportHeight)` (clamped 0–1) and applies `translateX(-progress * maxTranslate)` to the track via direct `style.transform` (not React state — avoids re-render cost on every scroll tick). This is plain JS/CSS, no scroll library. **Do not reduce the `350vh` height without checking pacing feels right** — too short and the horizontal scroll feels rushed/jumpy.
   - **Data model:** `REVIEWS` array, typed (`Review`), explicitly `TODO(dashboard)` — name, role, quote, rating, avatar, and count are ALL dashboard-controlled. Currently 4 entries, all fields `null`, rendered with placeholder fallback text ("Client Name", "Role, Company", pending-review copy) and a generic user icon for avatar. Same "empty until dashboard" pattern as Featured Projects thumbnails.
   - **"SEE ALL" button** — sits OUTSIDE the sticky/scroll-jacked section, in normal document flow right after it, so it only becomes reachable once the horizontal scroll segment finishes. `href="#"` — dead anchor, needs a real destination (likely a `/reviews` page, doesn't exist yet).
   - **Gap fixes (2026-07-03) — corrected approach.** First attempt switched `justify-center` → `justify-start` to fix a big gap ABOVE the heading, but that just relocated all the leftover vertical slack (viewport height minus actual content height) to BELOW the cards instead of removing it — Fahim flagged the new bottom gap immediately. **Real fix:** the slack itself needed to shrink, not just move. Reverted to `justify-center` (balances whatever slack remains) AND gave cards an explicit `h-[440px]` (was `h-full`, which just wrapped to content height ~300px) so there's less empty space to distribute in the first place. Also shrank the "SEE ALL" section padding to `py-6` (was `py-16` → `py-8` → `py-6`). **Lesson:** when a layout has a visible gap on one edge, check whether it's genuinely excess total space (fix by making content bigger/denser) before just flipping the alignment property, which only moves the same amount of empty space to the other side.
   - **Navbar auto-hide during this section.** Navbar slides up (`-translate-y-full`) and out of view while scrolled anywhere within the Reviews section's scroll range, reappears once past it. Implemented via a reusable contract: any section can opt in by adding `data-nav-hide="true"` — Navbar queries all elements with that attribute on scroll/resize and hides itself if `scrollY` falls within any of their `offsetTop`–`offsetTop+offsetHeight` ranges. Currently only Reviews uses this. If another section later needs the nav to hide (e.g. another light-background section), just add the same `data-nav-hide="true"` attribute — no Navbar code changes needed.
   - **"SEE ALL" button style — CORRECTED multiple times.** First attempt (rounded-full pill with a glow shadow ON the button) was wrong on two counts: button shape should be sharp corners, not rounded at all, and it needs an actual icon (`ArrowRight` from lucide-react), not a unicode arrow character. Second attempt used `rounded-md` — STILL rounded, just less so — Fahim had to repeat the correction. **Final shape: `rounded-none`, zero rounding.** The glow does NOT belong on the button — it belongs on the LEFT EDGE of the whole sticky section (`absolute inset-y-0 left-0 w-[420px]`, radial-gradient). **Lesson: "not rounded" means zero border-radius, not a smaller radius — don't compromise to a middle value like `rounded-md` when the instruction is an absolute.**
   - **"SEE ALL" button — back to SOLID color, gradient reverted.** Fahim sent a precise color-swatch reference; sampled the brightest/most saturated pixel from it programmatically: `rgb(110,47,189)` / `#6E2FBD`. Button is now `bg-[#6E2FBD]`, no gradient. Section's left-edge glow updated to use the SAME color (`rgba(110,47,189,0.45)`), also solid/non-gradient (just fades to transparent via radial falloff, which is different from a two-color gradient). This replaces the earlier `#A053F2` sampled from the background asset — that color is no longer used for this button/glow pair, though it may still be correct elsewhere (Featured Projects glow) since that was sampled from a different asset.

6. **Stats bar** (`components/sections/stats.tsx`) — 6+ Years / 600+ Designs / 11 Clients / 100% Satisfaction, dark strip (`bg-bg-alt`, border-y `border-line`). Client component: numbers count up from 0 via `requestAnimationFrame` with ease-out, triggered once by an `IntersectionObserver` (threshold 0.4) when the section scrolls into view — does not re-trigger on scroll-back-up. **Color: numbers `text-white`, labels `text-accent`** (corrected from the original numbers-accent/labels-muted pairing — Fahim wanted it the other way). Values still `TODO(dashboard)`-flagged, not reconfirmed as current.

7. **Secondary CTA Section** (`components/sections/secondary-cta.tsx`) — renamed from "Availability" (misleading name, corrected 2026-07-04). Universal/reusable component meant to appear on multiple pages, each with its own **combined per-page `SecondaryCtaSet`**: `{ eyebrow, heading, buttonLabel, buttonHref, motivation: { name, role, quote, avatar } }`. Terminology (Fahim's own, use consistently): the whole section = **Secondary CTA Section**; its card = **Secondary CTA Section Card**; the left/heading+button half = **Secondary Quotes**; the right/testimonial half = **Secondary Motivation**.
   - **Background — three-layer system, color-variable by design.** (1) `secondary-cta-bg.webp` — dedicated pattern-texture asset Fahim provided, deliberately colorless/grayscale. (2) A solid-color div using `mixBlendMode: "color"` — this is the literal mechanism for "apply color over a background image": it tints the grayscale pattern with whatever hue the `glow` prop carries while preserving the image's own luminosity/fade-to-black. (3) A pure-CSS radial-gradient glow, same `glow` variable, NOT baked into the image. `glow` is an "R, G, B" string, defaults to `"187, 124, 255"` (`--color-accent` / `#bb7cff`) — each future client/page passes its own value here, structure stays identical. **Glow tuning history:** first pass mixed in a white core for brightness — Fahim said this looked worse/washed-out; corrected to pure accent color with brightness from opacity falloff only (`0.9 → 0.45 → transparent`), no white. Later shrunk from `55%`/`520px` to `35%`/`320px` ("make it smaller").
   - **Card layout — 45% Secondary Quotes / 55% Secondary Motivation**, real coded content (not a flattened image) per Fahim's explicit choice between two options — he chose "real quote card, cropped" over "pre-baked transparent thumbnail." Avatar circle (fallback `UserRound` icon, matches Reviews' pattern), bold name, muted role, quote paragraph, external-link icon top-right, whole card `rotate-3` (straightens on hover), cropped by the column's `overflow-hidden`.
   - **Card fixes (2026-07-04):** original build had a visible bg-color seam between the two halves (fixed — both sides now share one seamless `bg-surface-light`) and the motivation card floated tiny in a sea of whitespace (fixed — card widened to `1100px`, image side padding tightened).
   - **DM NOW button** — `bg-ink` (black), NOT accent. Was briefly changed to `bg-accent` unprompted by Claude, then explicitly reverted — Fahim never asked for that change. **Do not change this button's color without an explicit instruction naming it.**
   - **Mobile-only order swap:** `order-1`/`order-2` (+ `md:order-none` to reset) — on mobile the stack is Motivation-up, Quotes-down; desktop's left/right split is unchanged.

8. **Footer** (`components/sections/footer.tsx`) — wordmark + tagline, "Navigation" column (Home/Portfolio/Reviews/Contact/Book meeting), "Stay in loop" column (Behance/Dribble/Figma Community), bottom bar with copyright + Legal Notice.
   - **License line flagged, not copied.** Reference screenshot had "Contents licensed Under WikiMedia Commons in CC BY-NC-ND 4.0" — Claude deliberately did NOT reproduce this; that license is meant for freely shareable media, not commercial client design work, and would be legally backwards here. Left out pending Fahim's actual license/terms decision.
   - Social URLs (Behance/Dribble/Figma Community) and the "Portfolio" link are all `#` placeholders — no real destinations provided yet.

## About Page Sections (built 2026-07-05)

9. **About Hero** (`components/sections/about-hero.tsx`) — full-bleed background image (`public/images/about-bg.webp`), centered "ABOUT ME" heading (Space Grotesk, `font-display`), subtitle "You're interested about me ?", two CTA buttons: "CONTACT" (white bg with Mail icon) and "READ THE STORY" (outlined border with ArrowRight icon). Uses `h-screen` for full viewport height. Navbar fixed on top, doesn't consume viewport space. Same z-index and background stacking pattern as Homepage Hero (isolate + z-0 for image + z-10 for content).

10. **About Intro** (`components/sections/about-intro.tsx`) — left side portrait (`public/images/face.webp`, rounded corners), right side bio with "MAHTAMUN" heading (accent color, Space Grotesk), role subtitle, 4 bio paragraphs (white/80%), email link with Mail icon. Background: `featured-projects-bg.webp` with 40% black overlay (`bg-black/40`). Layout: side-by-side on desktop (`lg:flex-row`, 40% portrait / 60% bio), stacks vertically on mobile. Content z-20 sits above overlay.

11. **About Timeline** (`components/sections/about-timeline.tsx`) — "HOW IT ALL STARTED" centered heading, vertical timeline with 6 hardcoded milestones (2016 → 2026). Each milestone: year (accent color), title, description. **Desktop:** centered gradient accent line with alternating left/right card layout. **Mobile:** single column vertical stack. **Future refactor needed:** currently 6 milestones are hardcoded in the component; when admin dashboard is built, this section will fetch milestone data dynamically to support variable count, editable titles, and editable descriptions.

## Portfolio Page Sections (built 2026-07-05)

15. **Portfolio Hero** (`components/sections/portfolio-hero.tsx`) — full-bleed `portfolio-hero.webp` (tribal pattern + designer at laptop), centered "PORTFOLIO" heading (Space Grotesk), "Memory for me, a checklist for you" subtitle (JetBrains Mono), two CTAs: "VIEW PROJECTS" (solid white/black, FolderOpen icon → `#portfolio-grid`) + "SEE REVIEWS" (outlined, filled star → `/reviews`). `h-screen`, `object-cover`, same z-index stacking as all other heroes.

16. **Portfolio Intro** (`components/sections/portfolio-intro.tsx`) — centered "The journey" eyebrow (italic, JetBrains Mono, `text-white/50`) + "BEGINS" heading (Space Grotesk, large), short `h-px w-24` horizontal rule divider below.

17. **Portfolio Grid** (`components/sections/portfolio-grid.tsx`) — `id="portfolio-grid"`, 2-column grid (1-column mobile). Repeating layout unit: `[half][half][full-width]` — items at `index % 3 === 2` get `col-span-2` (full-width covering card), others `col-span-1`. Full-width cards `min-h-[420px]`, equal cards `min-h-[300px]`. Cards: `rounded-none`, hatch placeholder when `thumbnail: null`, accent `projectType` label, `font-display` title, `ExternalLink` icon top-right. Data: `PORTFOLIO_PROJECTS` array, typed (`PortfolioProject`), `TODO(dashboard)`. **"See More" button** — outlined, `ChevronDown` icon, NO functionality yet — Fahim will explain the full behavior after the page is built. **Grid functionality is also pending Fahim's explanation.**

18. **Secondary CTA** (reused `<SecondaryCta>`) — `PORTFOLIO_CTA_SET`: "DISCUSS YOUR / PAIN POINT / DM NOW". Same copy as Reviews page, separate named set for dashboard flexibility.

## Dashboard (built 2026-07-07)

Stack: Neon + Drizzle + Better Auth + Cloudinary. All routes under `/dashboard/*` protected by `proxy.ts`. Lazy auth singleton (`getAuth()`) to avoid module-level DB call at build time.

- `lib/db/schema.ts` — Drizzle schema: `clients`, `gallery_items`, Better Auth tables (`user`, `session`, `account`, `verification`)
- `lib/db/index.ts` — Lazy Neon singleton (`getDb()`)
- `lib/auth.ts` — Lazy Better Auth instance (`getAuth()`)
- `lib/auth-client.ts` — Client-side `signIn`/`signOut`/`useSession`
- `lib/cloudinary.ts` — Server-side image upload helper
- `lib/actions/clients.ts` — Server Actions: `createClient`, `updateClient`, `deleteClient`, `addGalleryItem`, `deleteGalleryItem`, `updateGalleryItemLabel`
- `lib/clients.ts` — Now reads from Neon via `getAllClients()` / `getClient(slug)` — NOT hardcoded
- `proxy.ts` — Protects `/dashboard/*`, lets `/dashboard/login` through
- `app/api/auth/[...all]/route.ts` — Better Auth handler
- `app/dashboard/login/page.tsx` — Login form (email + password)
- `app/dashboard/layout.tsx` — Sidebar: Clients / New Client / Sign Out
- `app/dashboard/page.tsx` — Redirects to `/dashboard/clients`
- `app/dashboard/clients/page.tsx` — Client list: accent dot, logo, name, label, gallery count, Edit / View links
- `app/dashboard/clients/new/page.tsx` — Create form: name (required), label, tagline, accentColor, logo upload → auto-creates portfolio card + `/clients/[slug]` page
- `app/dashboard/clients/[slug]/page.tsx` — Fetch + pass to `ClientEditForm`
- `app/dashboard/clients/[slug]/client-edit-form.tsx` — Full edit: all client fields + gallery manager (upload image, pick label, delete item, change label live)
- `.env.example` — All required env vars documented
- `drizzle.config.ts` — Points to `DATABASE_URL_UNPOOLED` for migrations

**Activation steps (one-time):**
1. Set all env vars in Vercel dashboard (from `.env.example`)
2. Add `.env.local` locally with the same vars
3. Run `npx drizzle-kit generate && npx drizzle-kit migrate`
4. Create admin account (hit `/api/auth/sign-up` once or use Better Auth CLI)

**Dashboard scope — what's NOT yet covered:**
Reviews data, About Timeline milestones, Featured Projects cards, Stats bar numbers, Secondary CTA motivation cards. All still hardcoded. These are the next dashboard expansion targets.

## Ground Rule 6 Debt (logged 2026-07-07 audit)

Per-page design logs (`[pagename].md`) have NOT been written for any page. Required by Ground Rule 6 once a page is "fully done." Pages owed a log: homepage, about, portfolio, reviews, contact, clients/[slug]. To be created — not urgent but not forgotten.

## Reviews Page Sections (built 2026-07-05)

12. **Reviews Hero** (`components/sections/reviews-hero.tsx`) — full-bleed background image (`public/images/review-hero.webp`), centered "REVIEWS" heading + "Are people satisfied with my service ?" subtext. Two CTAs: "SEE REVIEWS" (white bg, star icon → `#reviews-grid` smooth scroll) and "VIEW PROJECTS" (outline border, eye icon → `/portfolio` future page). Uses `h-screen` full viewport height. Same z-index/content layering as homepage Hero.

13. **Reviews Grid** (`components/sections/reviews-grid.tsx`) — 2-1-2 asymmetric layout (desktop), single column (mobile). Each review card clickable → opens modal. Modal: 50/50 desktop split (image left, content right) / stacked vertical (mobile), with smooth entrance animations (`fadeIn` backdrop 300ms, `modalSlideIn` card 300ms ease-out). Star ratings pulled from `review.rating` field. Close via: X button, backdrop click, Escape key. Modal shows: full quote (italic), 5-star rating, client avatar/name/role, "Book Meeting" button (`#contact` placeholder for future contact page). Image field (`review.image`) optional, dashboard-managed. **Pagination:** Load More button adds 5 reviews per click. Separate `ALL_REVIEWS` array (distinct from homepage Reviews section) — TODO(dashboard) bulk CSV + form input for mass data entry.

14. **Secondary CTA Section** (reused component, different set) — `REVIEWS_PAGE_CTA_SET` with "DISCUSS YOUR" eyebrow, "PAIN POINT" heading, "DM NOW" button. Same reusable component as homepage, per-page content set pattern.

## Mobile Responsiveness Pass (2026-07-04 — ongoing)

**Standing instruction: every homepage instruction from Fahim from this point forward is scoped to phone/mobile only, unless he says otherwise.** Desktop (`md:` and up) styles must not be touched by these instructions.

- **Navbar mobile menu — was completely missing.** Nav links were `hidden md:flex` with NO mobile replacement at all; Home/Showcase/Reviews/About were unreachable on any viewport below `md`. Built a full mobile drawer: hamburger (`Menu`/`X` icon swap) → slide-down panel with all links + Book Meeting button. Closes via: **X tap**, **backdrop/outside-tap**, **Escape key**, **link tap**, and **auto-closes if resized back to desktop width**. Body scroll is locked while open.
- **Navbar background — reverted an over-engineering attempt.** Added a `supports-[backdrop-filter]` opaque fallback (`bg-black/80` default, `bg-black/10` only when blur is actually supported) to fix what looked like a transparency bug — but this turned out to be a red herring (see Deployment Confusion below). Fahim said to revert to the ORIGINAL simple version. **Current correct state: plain `bg-black/10 backdrop-blur-lg`, no fallback layer**, on both the header bar and the mobile menu panel. Do not re-add the `supports-[backdrop-filter]` fallback without explicit direction.
- **Hero background — `object-right` on mobile, `md:object-center` unchanged** for desktop. Same `hero-bg.webp` asset, just repositioned.
- **Featured Projects — uniform card height on mobile.** Both featured and non-featured cards now `min-h-[377px]` on mobile; desktop keeps the featured card's taller `md:min-h-[481px]` + `md:col-span-2`. Width was already uniform on mobile (single-column grid).
- **Featured Projects bottom glow — full-viewport width on mobile.** Split into two divs: mobile gets a `100%`-width radial gradient (`md:hidden`), desktop keeps the original `60%`-width version (`hidden md:block`).
- **Smooth scrolling — UNIVERSAL, not mobile-scoped.** `scroll-behavior: smooth` added to `html` in `globals.css`. Fahim explicitly said "universally" for this one item, overriding the general mobile-only scope for just this change.

## Deployment Confusion (2026-07-04 — important, read before assuming "it didn't work")

**GitHub Pages is ALSO enabled on this repo** (`build_type: "legacy"`, serving raw `main` branch via Jekyll-style static build at `https://mahtamun-hoque-fahim.github.io/mahtamundesigns/`) — completely separate from the real Vercel deployment, and NOT the actual Next.js build. Every push triggers BOTH a Vercel "Production" deployment (the real one, confirmed via GitHub's deployments API to actually build successfully from the correct commit) AND this GitHub Pages one. If Fahim reports "nothing is happening" / changes "aren't showing up" despite a clean local build and successful push, **check which URL he's actually looking at before assuming a code bug** — get the real Vercel deployment URL via the GitHub deployments API (`/repos/.../deployments`, filter `environment: "Production"`, then `/deployments/{id}/statuses` for the `environment_url`) rather than guessing. This has NOT been resolved yet — GitHub Pages is still enabled and still a source of confusion. Consider proposing Fahim disable it (Settings → Pages → source: None) next time this comes up.


- **Homepage** (`/`) — in progress, section by section (current file).
- **Reviews page** (`/reviews`) — ✅ Built (2026-07-05). Hero section, grid with modal expansion, pagination (load 5 more), secondary CTA, footer. Navbar links updated to point to `/reviews`. All sections built with smooth animations locked in.
- **Portfolio page** (`/portfolio` — route TBD) — index/grid of every company Fahim has worked with. Card = profile pic + cover image. Same count/source as the Trusted-by strip logos (~31 currently, dashboard-managed list). NOT BUILT YET.
- **Client Profile page** (`/clients/[slug]` — dynamic route, one per company) — the shared destination for BOTH (a) Featured Projects cards on the homepage, and (b) Portfolio page cards. Contains profile pic + cover (dashboard-uploaded) plus additional case-study-style content ("lots of stuff", not yet spec'd in detail). NOT BUILT YET.
- **Naming note:** "Client Profile page" is Claude's chosen name (Fahim asked Claude to pick one) — use this term consistently in code (component names, route folders) and future conversation unless Fahim renames it.
- **Key relationship:** Featured Projects (homepage) and the Portfolio page are two different ENTRY POINTS into the same Client Profile page type — not three unrelated page templates. Build the Client Profile template once, link both places to it.
- Do not start building Portfolio or Client Profile pages until Fahim explicitly says so — this was logged as an architecture note only, per his instruction.

## In Future (confirmed but not yet built — consolidated tracker)

Things Fahim has committed to building but that are blocked on a reference image, a decision, or simply haven't come up in the build order yet. Update this whenever something new future-facing comes up in conversation — don't let it live only in a chat message.

| Item | What it needs | Blocked on |
|---|---|---|
| Portfolio page (`/portfolio`) | Grid of ~31 client cards (profile pic + cover) | ✅ Resolved (2026-07-07) — built at `app/portfolio/page.tsx`, reads from DB via `getAllClients()` |
| Client Profile page (`/clients/[slug]`) | Profile pic + cover + case-study content, shared destination for Featured Projects AND Portfolio cards | ✅ Resolved (2026-07-07) — built at `app/clients/[slug]/page.tsx`, dynamic route, data from Neon |
| Dashboard / CMS | Controls: clients, gallery, accent color, logo, all client fields | ✅ Resolved (2026-07-07) — built at `/dashboard`, Neon+Drizzle+BetterAuth+Cloudinary. Scope: clients + gallery only. Reviews/Timeline/Featured Projects/Stats/Motivation cards NOT yet in dashboard (see Loose Ends). |
| Contact destination | Where "Book Meeting" / "Contact" buttons actually go (form? Calendly? mailto?) | ✅ Resolved (2026-07-07) — `/contact` page built with hero + form. Both buttons → `/contact#contact-form` with flash animation. |
| About section/page | Nav link `#about` currently dead | ✅ Resolved (2026-07-05) — built at `app/about/page.tsx`, navbar points to `/about` |
| Reviews section | Testimonial cards, star ratings, scroll-jack horizontal track | ✅ Resolved (2026-07-03) — built as `components/sections/reviews.tsx`, see Sections Built So Far. Content still dashboard-pending. |
| Stats bar | 6+ Years / 600+ Designs / 11 Clients / 100% Satisfaction | ✅ Resolved (2026-07-04) — built as `components/sections/stats.tsx`. Numbers still need reconfirming as current. |
| Bottom CTA (now "Secondary CTA Section") | "I'm here to solve THE PAIN" + tilted testimonial card | ✅ Resolved (2026-07-04) — built as `components/sections/secondary-cta.tsx`, real coded card (not image), reusable `SecondaryCtaSet` per page. See Sections Built So Far. |
| Footer | Nav links, social URLs, license line | ✅ Resolved (2026-07-04) — built as `components/sections/footer.tsx`. Social URLs still `#` placeholders; license line deliberately left off (WikiMedia CC line from reference doesn't fit — flagged, not copied). |

## Explain Log

(Entries added here whenever Fahim requests a pause-and-explain. Each entry: date, section/topic, explanation.)

---

## Loose Ends Tracker

(Frontend pieces built without backend wiring yet — updated as we go.)

| Page | Section | Element | Status | Notes |
|------|---------|---------|--------|-------|
| Home | Featured Projects | Project data (title/category/thumbnail/href) | Hardcoded | Needs dashboard/CMS wiring; data model already typed (`FeaturedProject`) for a clean swap |
| Home | Featured Projects | Thumbnail images | Placeholder (empty) | Upload/assignment flow needed from dashboard |
| Home | Reviews | Review data (name/role/quote/rating/avatar/count) | Hardcoded (all null) | Needs dashboard/CMS wiring; data model already typed (`Review`) for a clean swap |
| Home | Secondary CTA Section | `SecondaryCtaSet` (eyebrow/heading/button/motivation) | Hardcoded (`HOME_SET`, real approved homepage copy) | Future pages get their own named set, same shape; dashboard assigns which set → which page |
| Home | Footer | Social URLs (Behance/Dribble/Figma Community) | Placeholder (`#`) | Real URLs needed from Fahim |
| Home | Footer | "Portfolio" nav link | ✅ Resolved (2026-07-07) | Footer now links to `/portfolio` |
| Portfolio | Grid | Project data (title/projectType/thumbnail/href) | Hardcoded | `TODO(dashboard)` — full list, ordering, labels, thumbnails dashboard-controlled |
| Portfolio | Grid | "See More" button + grid functionality | Not wired | Fahim to explain full behavior after page is built |
| Portfolio | Grid | Thumbnail images | Placeholder (null) | Same pattern as Featured Projects |
| Portfolio | Secondary CTA | `PORTFOLIO_CTA_SET` motivation card | Hardcoded null | Needs real testimonial data from dashboard |
| About | Timeline | Milestone data (year/title/description) | Hardcoded (6 items: 2016–2026) | **Future:** refactor to fetch from database via dashboard. Support variable number of timestamps, editable titles, editable descriptions via admin dashboard. Currently 6 milestones are hardcoded in component; when dashboard is built, this will become a dynamic data pull. |
| Reviews | Grid | Review data (name/role/quote/rating/avatar/image) | Hardcoded (all null) | Separate list from homepage. Needs dashboard/CMS wiring with CSV + form bulk import option. Data model typed (`Review`) for clean swap. |
| Reviews | Grid | Review images | Placeholder (null) | Optional per-review, dashboard-assigned. Shows "No image" placeholder if null. |
| Reviews | Secondary CTA Section | `REVIEWS_PAGE_CTA_SET` (eyebrow/heading/button/motivation) | Hardcoded (real approved copy) | Different from `HOME_SET`, per-page pattern locked. Dashboard manages which set → which page. |
| Home | Reviews | Scroll section review data | Hardcoded null | No `reviews` DB table yet — dashboard scope gap. Separate from `/reviews` grid. |
| All pages | Secondary CTA | Motivation card data (name/role/quote/avatar) | Hardcoded null | No DB table for motivation/testimonial cards. Dashboard scope gap. |
| Home | Featured Projects | 3 project cards (href) | `#` dead | Blocked on real client slugs from dashboard |
| Home | Featured Projects | Project data (title/type/thumbnail) | Hardcoded | No `featured_projects` DB table yet — dashboard scope gap |
| Home | Stats bar | Numbers (years/designs/clients/satisfaction) | Hardcoded | No `stats` DB table yet — dashboard scope gap |
| About | Timeline | Milestone data | Hardcoded 6 items | No `timeline_items` DB table yet — dashboard scope gap |
| Footer | All pages | Social URLs (Behance/Dribbble/Figma Community) | `#` | Fahim to provide real URLs |
| Footer | All pages | "Legal Notice" link | `#` | Fahim to decide license/terms page |
| Navbar | Client pages | CTA button color → company accent | Not implemented | Logged in core.md line 54 as future feature — navbar is currently global/static |

## Loose Anchors (dead/placeholder links — audited 2026-07-05)

| Location | href | Status | Needed |
|---|---|---|---|
| Navbar — "Reviews" | `/reviews` | ✅ Resolved (2026-07-05) | Reviews page built at `/reviews/page.tsx` |
| Navbar — "About" | `/about` | ✅ Resolved (2026-07-05) | About page built at `/about/page.tsx` |
| Navbar — "Contact" / "Book Meeting" | `/contact` / `/contact#contact-form` | ✅ Resolved (2026-07-07) | Contact page built, both buttons wired |
| Hero — "Contact" button | `/contact` | ✅ Resolved (2026-07-07) | Points to `/contact` |
| Featured Projects — 3 project cards | `#` | Blocked on real slugs | Will resolve once real clients added via dashboard |
| Featured Projects — "SEE ALL" | `/portfolio` | ✅ Resolved (2026-07-07) | Fixed in audit pass — `rounded-none` also corrected simultaneously |
| Reviews Hero — "SEE REVIEWS" | `#reviews-grid` | ✅ Resolved (2026-07-05) | Scrolls to Reviews Grid section on same page |
| Reviews Hero — "VIEW PROJECTS" | `/portfolio` | ✅ Resolved (2026-07-05) | Portfolio page now exists at `/portfolio` |

Re-audit this list every time a new section/page is built — anchors that were dead may become valid once their target section exists.
