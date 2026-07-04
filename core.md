# CORE.md — Process Log & Ground Rules

This file exists so neither Claude nor anyone else forgets how this project is being built. It is a living log — append, don't overwrite.

---

## Ground Rules (set 2026-07-02)

1. **No pipeline.** No auto-triggered skills, no Citadel/Council/Singularity flow for this project. This is a manual, hands-on build.
2. **Section-by-section.** Fahim hands over one page at a time. Within a page, one section is built at a time.
3. **Confirm before advancing.** After each section is built, stop. Wait for Fahim to review output and explicitly confirm before starting the next section.
4. **Image-heavy, not flat.** This is a graphic designer's portfolio — visuals carry weight. Avoid default flat/minimal treatment unless explicitly asked for. Lean into real image content, not placeholder blocks.
5. **Pause & Explain.** If Fahim says "pause, explain," stop building and explain the reasoning/decision in plain terms. That explanation gets logged here in CORE.md, dated, so it persists.
6. **Per-page log.** When a page is fully done, write a `[pagename].md` documenting the build from a designer's perspective — layout logic, visual decisions, what worked, what was tried.
7. **Future skill use.** These page logs are intended to eventually inform/improve the `cave-man` and `ui-ux-designer` skills. Skills are NEVER modified without Fahim's explicit confirmation, even if the log content clearly suggests an improvement.
8. **Running audit log.** Across the whole build, maintain a log of loose frontend ends — UI built but not yet wired to backend/data — so nothing gets forgotten before the eventual full audit + dashboard pass.
9. **Resolution = mark done, never delete.** When a loose end or loose anchor resolves, update its row's Status to `✅ Resolved (date)` with a one-line note on how — do NOT remove the row. The tables are a history, not just a live to-do list.

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
  - Fonts: `--font-display` = Space Grotesk (headline/display use), `--font-mono` = JetBrains Mono (nav, labels, body, eyebrows — matches the technical/monospace feel of the reference)
- **Typography lock:** Space Grotesk (`--font-display`) is CONFIRMED and LOCKED for all titles/headings across the whole project, not just Hero. Fahim explicitly approved it after inspecting Lovable's devtools. Use `font-display` class for every heading going forward — do not introduce a different display font without him asking first.
- **Shared horizontal baseline — REVERTED (2026-07-03, same day it was added).** Was briefly a hard rule (`max-w-[1400px]` / `px-6 md:px-10` everywhere, no exceptions but Trusted-by). Fahim undid it — Hero is BACK to `md:pl-20 lg:pl-28` push-right, Featured Projects grid is BACK to `lg:px-12 xl:px-24` narrowing. **Do not re-apply the shared-baseline rule without a fresh explicit instruction** — this was tried and explicitly undone, not a stale note to "fix."
- **Logo asset:** `public/logo/mahtamun-wordmark.svg` — white wordmark + purple accent dot, built for dark backgrounds only.
- **Component structure:** `components/sections/` for full page sections (navbar, hero, etc.), `components/ui/` for reusable small pieces (buttons, cards).

## Sections Built So Far

1. **Navbar** (`components/sections/navbar.tsx`) — logo, nav links (Home/Showcase/Reviews/About), Book Meeting CTA. **STICKY/FIXED** (`position: fixed`), **scroll-conditional background**: transparent at top, `bg-black/10 backdrop-blur-lg border-b border-white/5` once scrolled past 12px. Went always-on → scroll-conditional → Fahim wanted scroll-conditional back (client component with scroll listener). This is the current standing behavior.

**Root cause of the earlier background/glow confusion:** it was never about the image or a missing CSS glow layer. `position: fixed` removes the navbar from document flow, so before, when nav was `absolute`, the hero content had `pt-20`/`pt-16` compensating for it, effectively shrinking the visible hero area and making the background image's edge glow look thinner. Once nav went `fixed` and that top padding was removed, the hero's actual container is the full viewport again — the background image (with `object-cover`) fills correctly and the glow reads right. The CSS glow-overlay hack and the object-contain experiment were both solving the wrong problem — lesson: check layout/spacing causes before reaching for visual-asset-level fixes.
2. **Hero** (`components/sections/hero.tsx`) — full-bleed background image (`public/images/hero-bg.webp`, pattern+glow baked into the asset by Fahim, NOT built as CSS/SVG), name headline (font-display, Space Grotesk), role subtitle, Portfolio/Contact buttons with lucide-react icons, portrait cutout (`public/images/hero-portrait.webp`, RGBA/transparent, confirmed alpha survives WebP conversion).
   - Button hrefs are placeholders (`#showcase`, `#contact`) — Fahim will confirm real destinations once the full page is built. **Do not treat these as final.**
   - **Hero height rule:** hard-capped at `100dvh` (Fahim's explicit instruction — hero must never exceed 100vh). On mobile (`< md`), the portrait image is hidden entirely — name/subtitle/buttons only. This was a Claude judgment call to fit content in 100vh on small screens; Fahim has NOT yet confirmed this is the right tradeoff vs. a shrunk portrait or other options. Revisit if he raises it.
   - **Background image fit — use `object-contain`, NOT `object-cover`.** `hero-bg.webp`'s purple glow pattern lives at the far left/right edges of the image. `object-cover` crops inward on any viewport whose aspect ratio is narrower/taller than the image (1920x1078), which cuts the glow off entirely — this happened in production and Fahim caught it visually. `object-contain` + matching `bg-bg` behind it (image's near-black areas are `rgb(9,9,9)`, close enough to `#0a0a0a` to blend invisibly) keeps both edges visible always. Do not revert to `object-cover` for this asset.
   - **Composition — text and portrait must sit close together, minimal dead space.** First pass used `w-1/2` + `w-1/2` columns with `justify-between`, which left a huge empty gap in the middle on wide viewports — didn't match the reference's tight composition (portrait sits close to the text block, not floated far right). Second pass (`flex-1` + `max-w-[640px]`) improved it but Fahim compared against a Lovable-generated version with tighter spacing and confirmed: keep original copy/nav/buttons, only borrow the spacing approach. **Final approach:** text lives in its own padded container (`max-w-lg`, normal section padding); portrait is a SEPARATE absolutely-positioned element (`absolute inset-y-0 right-0 w-[46%]`) that bleeds all the way to the browser's right edge with zero padding/gutter — it is NOT part of the padded flex row anymore. This is what actually closed the visual gap: the portrait touching the true viewport edge, not just being sized bigger. If gap issues resurface, check whether the portrait is still full-bleed to `right-0` with no padding ancestor constraining it.
   - **Glow overlay — CSS-layered, not baked into the asset.** `hero-bg.webp`'s actual glow only occupies the outer ~15% of each edge — compared against a Lovable-generated reference, Fahim confirmed our render of the raw asset was accurate but visually thinner than Lovable's, which layers extra glow via CSS. Added a `mix-blend-screen` radial-gradient overlay (`rgba(187,124,255,0.35)` at 0% and 100% x-position) sitting between the bg image and content to amplify the purple bleed without needing a new asset. **REVERTED — Fahim said it made things look worse.** Do not re-add this overlay without explicit direction. Instead of a fabricated glow layer, the ask was to actually inspect the Lovable site's real CSS — attempted via `web_fetch`, but that tool only returns extracted page content for client-rendered SPAs, not the JS bundle/computed styles, so no real code inspection happened. If Fahim wants a real comparison, need either a GitHub export of the Lovable project or devtools screenshots from him.
   - **Background object-fit — back to `object-cover`** (not `object-contain`). Fahim's explicit instruction after reverting the glow overlay attempt. Note: `object-cover` was the ORIGINAL source of the edge-cropping bug (see above) — reintroducing it may bring that issue back on narrow/tall viewports. Watch for this; don't be surprised if it resurfaces.
   - **Text block position** — vertical: `translate-y-2`, `md:translate-y-6` (small downward offset from true center — went too far down at `translate-y-10/16`, Fahim asked for "just a bit up" from that, this is the corrected value). Horizontal: pushed further right via container padding (`md:pl-20 lg:pl-28`, asymmetric — right side stays at `md:pr-10`). If either axis is still off, ask for a specific direction/amount rather than guessing again.
   - **Three-dot decorative element** above the H1 — REMOVED per Fahim's instruction (2026-07-03). Do not re-add.

2. **Trusted-by strip** (`components/sections/trusted-by.tsx`) — "TRUSTED BY RISING BANGLADESHI BRANDS" eyebrow + dual-row infinite auto-scroll marquee, 31 logos total (row 1 scrolls left, row 2 scrolls right, opposite directions, pauses on hover via `.marquee-track:hover`). Logos are grayscale/50% opacity by default, full color on hover. Edge fade via CSS `mask-image` gradient. Went with a marquee instead of a static grid because 31 logos don't fit a fixed row — this was a Claude judgment call, not explicitly requested; revisit if Fahim wants a static/grid layout instead.
   - **Logo assets:** `public/logos/*.webp`, all pre-converted to WebP by Fahim, all normalized to ~120px height, transparent backgrounds confirmed intact.
   - **Resolved:** `logo.webp` renamed to `joynal-academy.webp` — identified by reading the actual pixels (it says "JOYNAL ACADEMY"), alt text fixed. Naming convention for this whole set: source files were `[Brand Name] strip.png/webp` — brand name is a prefix, "strip" is always the suffix to strip off. All other logos already followed this correctly.
   - **Sizing** — reverted back to original: `h-10 md:h-12` logo display height, `py-14 md:py-16` section padding. Fahim asked to shrink it, then said undo — this is the CURRENT correct state, don't shrink again without a fresh explicit ask.
   - **Layout — SINGLE marquee row, not dual-row.** Originally built as two rows scrolling opposite directions; Fahim asked to consolidate into one row (in the same message as the size revert). All 31 logos now share one continuous scrolling track (`animate-marquee-left`). The `animate-marquee-right` keyframe in `globals.css` is now unused but left in place in case a second row returns.
   - **Hover behavior — FIXED, now JS-driven, not CSS.** The CSS `animation-duration` approach caused exactly the bug predicted earlier: hovering visibly restarted/jumped the scroll position, and un-hovering snapped back to fast speed from a different point than where it left off. Replaced with a `requestAnimationFrame` loop (client component) that tracks continuous position in a ref and eases current speed toward a target speed every frame — position never resets, speed transitions smoothly, hover-in/hover-out both continue from wherever the marquee actually was. The old `@keyframes marquee-left/right` and `.animate-marquee-*` classes in `globals.css` were REMOVED entirely — don't re-add them, this section no longer uses CSS animation for scrolling.
   - **Speed values** — derived from the ORIGINAL duration numbers (`40s` full loop / `120s` slow), not arbitrary px/s constants. First pass of the JS rewrite used hardcoded `40px/s` / `8px/s`, which didn't scale with actual loop width and felt different from the original CSS speeds Fahim liked. Fixed: `fastSpeed = loopWidth / 40`, `slowSpeed = loopWidth / 120`, computed after measuring the track's real `scrollWidth` on mount. If speed ever feels off again, check these two divisor constants first, not the easing.
3. **Featured Projects** (`components/sections/featured-projects.tsx`) — "Showcase" eyebrow + "FEATURED PROJECTS" heading (renamed from "Portfolio"/"SELECTED WORKS"), asymmetric grid: 1 large featured card full-width on top (`md:col-span-2`), 2 smaller cards below side by side. "SEE ALL" button.
   - **Data model:** `FEATURED_PROJECTS` array, typed (`FeaturedProject`), explicitly commented `TODO(dashboard)` — count, ordering, project type labels, and thumbnails are all meant to be dashboard-controlled eventually. Hardcoded to exactly 3 for now per Fahim's instruction: Fahad's Tutorial (featured/large), Motovessel, Interting.
   - **Field naming:** the small label above each project's title is called `projectType` in code (matches Fahim's terminology exactly — NOT `category`). Renamed from an earlier `category` field. Use `projectType` consistently if this data model is extended (e.g. for the Portfolio page or Client Profile pages later).
   - **Background — BUG FIXED (image wasn't rendering at all).** Root cause: the image wrapper used `-z-10` (negative z-index) inside a section that was only `relative` (no `isolate`/explicit stacking context). Without an explicit stacking context, a negative z-index child escapes to stack against the WRONG ancestor (can end up behind body/other sections instead of just behind its own siblings) — image was invisible even though the file loaded fine. Fixed: added `isolate` to the section, changed the image wrapper to `z-0` (non-negative) and kept content at `z-10`. **Lesson for future Claude:** negative z-index (`-z-*`) on a background layer is a common source of "asset exists but doesn't render" bugs — prefer `isolate` + non-negative z-index layering (`z-0` background, `z-10` content) over negative z-index tricks.
   - **File size flag (not yet acted on):** `featured-projects-bg.webp` is 2.3MB — quite heavy for a background asset. Not optimized/compressed further per Fahim's instruction (he only asked for the visibility fix). Worth revisiting if load performance becomes a concern.
   - **Bottom glow:** added an ambient radial purple glow (`rgba(187,124,255,0.35)`, radial-gradient, `h-[420px]`, positioned `bottom-0`) rising from the base of the section, behind the "SEE ALL" button — matches the reference screenshot Fahim sent. This is a genuine CSS-layered glow (unlike the hero glow-overlay experiment which was reverted) — Fahim explicitly asked for this one, keep it.
   - **Card heights:** featured card `min-h-[370px]`, smaller cards `min-h-[290px]` — 20% increase from the previous `308px`/`242px` per Fahim's instruction. If asked again, calculate from THESE current values, not the original `280px`/`220px`.
   - **Card grid width** — added `lg:px-12 xl:px-24` to the grid container to pull cards in from the section's full width on large/wide viewports. Fahim's ask: minimize card width, cards were touching too close to the section edges on wide screens.
   - **Card heights:** increased 10% — featured card `min-h-[280px]` → `min-h-[308px]`, smaller cards `min-h-[220px]` → `min-h-[242px]`.
   - **"SEE ALL" button** — restyled to match the original reference: white bg, dark text, purple ambient glow via `box-shadow` (`shadow-[0_0_50px_rgba(187,124,255,0.35)]`, intensifies on hover). Previously was an outlined transparent button — Fahim asked for the glow treatment matching the reference screenshot.
   - **Project type labels** — all set to placeholder `"Brand Identity"` for now, not confirmed real values. Fix when Fahim gives real ones or when dashboard data model lands.
   - **Thumbnail hover behavior — implemented.** When `thumbnail` is set (not `null`), it renders via `next/image` `fill`, `grayscale brightness-75` by default, `group-hover:grayscale-0 group-hover:brightness-100` on hover (same pattern as the Trusted-by logos), plus a `bg-gradient-to-t from-black/80` overlay so the Project Type/title text stays readable regardless of thumbnail content. Empty-state placeholder (hatch pattern + "THUMBNAIL PENDING") still shows when `thumbnail: null`. **Important:** there is NO separate logo overlay element — per Fahim, any brand logo visible on a card is baked into the thumbnail image itself at design time, not a UI layer Claude controls. Contrast/legibility of text *within* the thumbnail image is Fahim's responsibility as the designer, not something to fix in code.

## Site Architecture (planned, NOT yet built — logged 2026-07-03)

- **Homepage** (`/`) — in progress, section by section (current file).
- **Portfolio page** (`/portfolio` — route TBD) — index/grid of every company Fahim has worked with. Card = profile pic + cover image. Same count/source as the Trusted-by strip logos (~31 currently, dashboard-managed list). NOT BUILT YET.
- **Client Profile page** (`/clients/[slug]` — dynamic route, one per company) — the shared destination for BOTH (a) Featured Projects cards on the homepage, and (b) Portfolio page cards. Contains profile pic + cover (dashboard-uploaded) plus additional case-study-style content ("lots of stuff", not yet spec'd in detail). NOT BUILT YET.
- **Naming note:** "Client Profile page" is Claude's chosen name (Fahim asked Claude to pick one) — use this term consistently in code (component names, route folders) and future conversation unless Fahim renames it.
- **Key relationship:** Featured Projects (homepage) and the Portfolio page are two different ENTRY POINTS into the same Client Profile page type — not three unrelated page templates. Build the Client Profile template once, link both places to it.
- Do not start building Portfolio or Client Profile pages until Fahim explicitly says so — this was logged as an architecture note only, per his instruction.

## Fonts — self-hosted, not next/font/google

Switched away from `next/font/google` because this sandbox's bash tool cannot reach `fonts.googleapis.com` (not on the allowed-domains list), which broke local builds. Using `@fontsource/space-grotesk` and `@fontsource/jetbrains-mono` instead (imported directly in `app/layout.tsx`, specific weight files only — 500/600/700 for Space Grotesk, 400/500/600/700 for JetBrains Mono). This is now the standing approach for this repo — do not switch back to `next/font/google` without checking network access first.

## In Future (confirmed but not yet built — consolidated tracker)

Things Fahim has committed to building but that are blocked on a reference image, a decision, or simply haven't come up in the build order yet. Update this whenever something new future-facing comes up in conversation — don't let it live only in a chat message.

| Item | What it needs | Blocked on |
|---|---|---|
| Portfolio page (`/portfolio`) | Grid of ~31 client cards (profile pic + cover) | Reference image from Fahim, dashboard data model |
| Client Profile page (`/clients/[slug]`) | Profile pic + cover + case-study content, shared destination for Featured Projects AND Portfolio cards | Reference image from Fahim, content spec ("lots of stuff" not yet detailed) |
| Dashboard / CMS | Controls: Featured Projects count/order/categories/thumbnails, Trusted-by logo list, Portfolio card list | Not started, no reference yet — this is the backend everything above depends on |
| Contact destination | Where "Book Meeting" / "Contact" buttons actually go (form? Calendly? mailto?) | Fahim hasn't decided yet — see Loose Anchors |
| About section/page | Nav link `#about` currently dead | Not designed yet |
| Reviews section | Testimonial cards, star ratings | Next up — in progress this session |
| Stats bar | 6+ Years / 600+ Designs / 11 Clients / 100% Satisfaction | Numbers need reconfirming as current |
| Bottom CTA | "I'm here to solve THE PAIN" + tilted testimonial card | Not started |
| Footer | Nav links, social URLs, license line | Social URLs needed; WikiMedia CC license line flagged earlier as possibly wrong |

## Explain Log

(Entries added here whenever Fahim requests a pause-and-explain. Each entry: date, section/topic, explanation.)

---

## Loose Ends Tracker

(Frontend pieces built without backend wiring yet — updated as we go.)

| Page | Section | Element | Status | Notes |
|------|---------|---------|--------|-------|
| Home | Featured Projects | Project data (title/category/thumbnail/href) | Hardcoded | Needs dashboard/CMS wiring; data model already typed (`FeaturedProject`) for a clean swap |
| Home | Featured Projects | Thumbnail images | Placeholder (empty) | Upload/assignment flow needed from dashboard |

## Loose Anchors (dead/placeholder links — audited 2026-07-03)

| Location | href | Status | Needed |
|---|---|---|---|
| Navbar — "Reviews" | `#reviews` | Dead | Build Reviews section with `id="reviews"` |
| Navbar — "About" | `#about` | Dead | Build About section/page with `id="about"` |
| Navbar — "Book Meeting" | `#contact` | Dead | Contact section AND a confirmed destination (form/Calendly/mailto — Fahim hasn't decided) |
| Hero — "Contact" button | `#contact` | Dead | Same as above |
| Featured Projects — 3 project cards | `#` | Placeholder | Case-study pages or external links, once real project content exists |
| Featured Projects — "SEE ALL" | `#` | Placeholder | Likely a `/portfolio` page — doesn't exist yet |

Re-audit this list every time a new section/page is built — anchors that were dead may become valid once their target section exists (e.g. `#reviews` resolves itself the moment the Reviews section is built with a matching `id`).

