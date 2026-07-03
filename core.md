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

1. **Navbar** (`components/sections/navbar.tsx`) — logo, nav links (Home/Showcase/Reviews/About), Book Meeting CTA. Absolutely positioned over Hero, transparent bg.
2. **Hero** (`components/sections/hero.tsx`) — full-bleed background image (`public/images/hero-bg.webp`, pattern+glow baked into the asset by Fahim, NOT built as CSS/SVG), name headline (font-display, Space Grotesk), role subtitle, Portfolio/Contact buttons with lucide-react icons, portrait cutout (`public/images/hero-portrait.webp`, RGBA/transparent, confirmed alpha survives WebP conversion).
   - Button hrefs are placeholders (`#showcase`, `#contact`) — Fahim will confirm real destinations once the full page is built. **Do not treat these as final.**

## Fonts — self-hosted, not next/font/google

Switched away from `next/font/google` because this sandbox's bash tool cannot reach `fonts.googleapis.com` (not on the allowed-domains list), which broke local builds. Using `@fontsource/space-grotesk` and `@fontsource/jetbrains-mono` instead (imported directly in `app/layout.tsx`, specific weight files only — 500/600/700 for Space Grotesk, 400/500/600/700 for JetBrains Mono). This is now the standing approach for this repo — do not switch back to `next/font/google` without checking network access first.

## Explain Log

(Entries added here whenever Fahim requests a pause-and-explain. Each entry: date, section/topic, explanation.)

---

## Loose Ends Tracker

(Frontend pieces built without backend wiring yet — updated as we go.)

| Page | Section | Element | Status | Notes |
|------|---------|---------|--------|-------|
