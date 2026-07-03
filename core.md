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
- **Logo asset:** `public/logo/mahtamun-wordmark.svg` — white wordmark + purple accent dot, built for dark backgrounds only.
- **Component structure:** `components/sections/` for full page sections (navbar, hero, etc.), `components/ui/` for reusable small pieces (buttons, cards).

## Sections Built So Far

1. **Navbar** (`components/sections/navbar.tsx`) — logo, nav links (Home/Showcase/Reviews/About), Book Meeting CTA. **STICKY/FIXED** (`position: fixed`), always-on `bg-black/10 backdrop-blur-lg border-b border-white/5` (NOT scroll-conditional — tried that first, Fahim simplified it to always-on dark 10% + blur after inspecting Lovable's devtools). This is the standing behavior — don't revert to `absolute`, don't re-add scroll-based toggling without being asked.

**Root cause of the earlier background/glow confusion:** it was never about the image or a missing CSS glow layer. `position: fixed` removes the navbar from document flow, so before, when nav was `absolute`, the hero content had `pt-20`/`pt-16` compensating for it, effectively shrinking the visible hero area and making the background image's edge glow look thinner. Once nav went `fixed` and that top padding was removed, the hero's actual container is the full viewport again — the background image (with `object-cover`) fills correctly and the glow reads right. The CSS glow-overlay hack and the object-contain experiment were both solving the wrong problem — lesson: check layout/spacing causes before reaching for visual-asset-level fixes.
2. **Hero** (`components/sections/hero.tsx`) — full-bleed background image (`public/images/hero-bg.webp`, pattern+glow baked into the asset by Fahim, NOT built as CSS/SVG), name headline (font-display, Space Grotesk), role subtitle, Portfolio/Contact buttons with lucide-react icons, portrait cutout (`public/images/hero-portrait.webp`, RGBA/transparent, confirmed alpha survives WebP conversion).
   - Button hrefs are placeholders (`#showcase`, `#contact`) — Fahim will confirm real destinations once the full page is built. **Do not treat these as final.**
   - **Hero height rule:** hard-capped at `100dvh` (Fahim's explicit instruction — hero must never exceed 100vh). On mobile (`< md`), the portrait image is hidden entirely — name/subtitle/buttons only. This was a Claude judgment call to fit content in 100vh on small screens; Fahim has NOT yet confirmed this is the right tradeoff vs. a shrunk portrait or other options. Revisit if he raises it.
   - **Background image fit — use `object-contain`, NOT `object-cover`.** `hero-bg.webp`'s purple glow pattern lives at the far left/right edges of the image. `object-cover` crops inward on any viewport whose aspect ratio is narrower/taller than the image (1920x1078), which cuts the glow off entirely — this happened in production and Fahim caught it visually. `object-contain` + matching `bg-bg` behind it (image's near-black areas are `rgb(9,9,9)`, close enough to `#0a0a0a` to blend invisibly) keeps both edges visible always. Do not revert to `object-cover` for this asset.
   - **Composition — text and portrait must sit close together, minimal dead space.** First pass used `w-1/2` + `w-1/2` columns with `justify-between`, which left a huge empty gap in the middle on wide viewports — didn't match the reference's tight composition (portrait sits close to the text block, not floated far right). Second pass (`flex-1` + `max-w-[640px]`) improved it but Fahim compared against a Lovable-generated version with tighter spacing and confirmed: keep original copy/nav/buttons, only borrow the spacing approach. **Final approach:** text lives in its own padded container (`max-w-lg`, normal section padding); portrait is a SEPARATE absolutely-positioned element (`absolute inset-y-0 right-0 w-[46%]`) that bleeds all the way to the browser's right edge with zero padding/gutter — it is NOT part of the padded flex row anymore. This is what actually closed the visual gap: the portrait touching the true viewport edge, not just being sized bigger. If gap issues resurface, check whether the portrait is still full-bleed to `right-0` with no padding ancestor constraining it.
   - **Glow overlay — CSS-layered, not baked into the asset.** `hero-bg.webp`'s actual glow only occupies the outer ~15% of each edge — compared against a Lovable-generated reference, Fahim confirmed our render of the raw asset was accurate but visually thinner than Lovable's, which layers extra glow via CSS. Added a `mix-blend-screen` radial-gradient overlay (`rgba(187,124,255,0.35)` at 0% and 100% x-position) sitting between the bg image and content to amplify the purple bleed without needing a new asset. **REVERTED — Fahim said it made things look worse.** Do not re-add this overlay without explicit direction. Instead of a fabricated glow layer, the ask was to actually inspect the Lovable site's real CSS — attempted via `web_fetch`, but that tool only returns extracted page content for client-rendered SPAs, not the JS bundle/computed styles, so no real code inspection happened. If Fahim wants a real comparison, need either a GitHub export of the Lovable project or devtools screenshots from him.
   - **Background object-fit — back to `object-cover`** (not `object-contain`). Fahim's explicit instruction after reverting the glow overlay attempt. Note: `object-cover` was the ORIGINAL source of the edge-cropping bug (see above) — reintroducing it may bring that issue back on narrow/tall viewports. Watch for this; don't be surprised if it resurfaces.
   - **Text block position** — shifted up slightly (`-translate-y-6`, `md:-translate-y-10`) off dead-center, removed the `pt-20`/`pt-16` top offset that was compensating for the (now-fixed, not absolute) navbar. Fahim's instruction was just "move the text" without a specific target — this is a first pass, not confirmed final. If he wants further repositioning, ask for a specific direction/amount rather than guessing again.

## Fonts — self-hosted, not next/font/google

Switched away from `next/font/google` because this sandbox's bash tool cannot reach `fonts.googleapis.com` (not on the allowed-domains list), which broke local builds. Using `@fontsource/space-grotesk` and `@fontsource/jetbrains-mono` instead (imported directly in `app/layout.tsx`, specific weight files only — 500/600/700 for Space Grotesk, 400/500/600/700 for JetBrains Mono). This is now the standing approach for this repo — do not switch back to `next/font/google` without checking network access first.

## Explain Log

(Entries added here whenever Fahim requests a pause-and-explain. Each entry: date, section/topic, explanation.)

---

## Loose Ends Tracker

(Frontend pieces built without backend wiring yet — updated as we go.)

| Page | Section | Element | Status | Notes |
|------|---------|---------|--------|-------|
