# MAHTAMUN DESIGNS — Design & UI Guide

This document captures every design decision in this site — colors, typography, spacing, motion, and component patterns. Use this as the single source of truth when building new pages, extending the portfolio, or migrating to a new framework.

---

## Philosophy

The design language is **dark, minimal, typographic-first**. It communicates seriousness and craft without being cold. The purple accent creates energy without screaming. Everything breathes — wide spacing, restrained use of color, motion that feels earned rather than decorative.

Three words that should describe every page: **Bold. Quiet. Intentional.**

---

## Color System

All colors are defined as CSS HSL variables in `src/index.css` and consumed via Tailwind tokens.

### Core Palette

| Token | HSL | Hex (approx) | Usage |
|---|---|---|---|
| `background` | `240 6% 6%` | `#0e0e11` | Page background — near-black with a blue-grey tint |
| `foreground` | `45 20% 90%` | `#ece9e0` | Primary text — warm off-white, never pure white |
| `card` | `240 5% 10%` | `#181820` | Card/surface backgrounds |
| `card-foreground` | `45 20% 90%` | `#ece9e0` | Text on cards |
| `primary` | `263 70% 58%` | `#7c3aed` → `#8b5cf6` | Purple — the signature accent |
| `primary-foreground` | `0 0% 100%` | `#ffffff` | Text on primary backgrounds |
| `secondary` | `240 4% 14%` | `#212128` | Slightly lighter surface |
| `muted` | `240 4% 18%` | `#27272f` | Subtle backgrounds, borders |
| `muted-foreground` | `240 5% 50%` | `#78788a` | Subdued text, labels, placeholders |
| `accent` | `270 60% 50%` | `#7c3aed` | Same purple family, used for hover states |
| `border` | `240 4% 18%` | `#27272f` | All borders — same as muted |
| `destructive` | `0 70% 50%` | `#e53e3e` | Errors, delete actions |

### Sidebar Palette (Admin)

| Token | HSL | Usage |
|---|---|---|
| `sidebar-background` | `240 6% 8%` | Slightly darker than page bg |
| `sidebar-primary` | `263 70% 58%` | Active nav item |
| `sidebar-accent` | `240 4% 14%` | Hover state |
| `sidebar-border` | `240 4% 18%` | Dividers |

### Color Rules

- **Never use pure black** (`#000000`) or pure white (`#ffffff`) for backgrounds or body text. The warmth in `foreground` and depth in `background` is intentional.
- **Purple is used sparingly** — highlights, active states, CTAs, and accent words in headings. Not for body text or large fills.
- **Opacity modifiers** are used extensively: `text-primary/30`, `bg-primary/10`, `border-border/50`. This creates depth without adding new colors.
- **Grayscale images** in carousels, hover to color — keeps focus on text and layout, not imagery.

---

## Typography

### Fonts

| Role | Font | Import |
|---|---|---|
| **Display** | Space Grotesk | Google Fonts |
| **Body** | DM Sans | Google Fonts |

```css
/* Applied in index.css */
font-family: var(--font-display); /* headings */
font-family: var(--font-body);    /* body text */
```

```tsx
/* Tailwind classes */
className="font-display"  /* Space Grotesk */
className="font-body"     /* DM Sans */
```

### Type Scale

| Element | Classes | Notes |
|---|---|---|
| Hero headline | `text-5xl md:text-7xl font-display font-bold tracking-tight` | |
| Section title | `text-4xl md:text-5xl font-display font-bold tracking-tight` | |
| Card title | `text-xl md:text-2xl font-display font-bold` | |
| Label / eyebrow | `text-xs uppercase tracking-[0.2em] text-primary font-display` | Purple, spaced caps |
| Body large | `text-lg text-muted-foreground` | |
| Body default | `text-sm text-muted-foreground` | |
| Caption | `text-xs text-muted-foreground` | |

### Typographic Patterns

**Split headline** — last word in purple, rest in foreground:
```tsx
const words = title.split(' ');
<h1>
  {words.slice(0, -1).join(' ')}{' '}
  <span className="text-primary">{words[words.length - 1]}</span>
</h1>
```

**Eyebrow label** — appears above section titles:
```tsx
<p className="text-xs uppercase tracking-[0.3em] text-primary font-display mb-4">
  Client Testimonials
</p>
```

**Letter spacing on uppercase** — always use `tracking-[0.2em]` or `tracking-[0.3em]` for small caps labels, never just `tracking-widest`.

---

## Spacing & Layout

### Container
```tsx
<div className="container mx-auto px-6">
```
Max width: `1400px` (set in Tailwind config). Padding: `24px` each side.

### Section Spacing
```tsx
className="py-24 md:py-32"   /* standard section */
className="py-20"             /* compact section (logo strip) */
className="pt-32 pb-16"      /* page hero (accounts for fixed header) */
```

### Grid System
The selected works grid uses an asymmetric 12-column layout:
```tsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
  {/* Large item: spans 7 cols, 2 rows */}
  <div className="md:col-span-7 md:row-span-2">
  {/* Smaller items: span 5 cols */}
  <div className="md:col-span-5">
  {/* Bottom items: 8 and 4 cols */}
  <div className="md:col-span-8">
  <div className="md:col-span-4">
```

### Border Radius
```tsx
--radius: 0.5rem  /* base = 8px */

rounded-sm  /* 6px  — inputs, small tags */
rounded     /* 8px  — cards */
rounded-lg  /* 8px  — same as rounded (uses --radius) */
rounded-xl  /* 12px — media cards */
rounded-2xl /* 16px — showcase images */
rounded-3xl /* 24px — CTA section */
rounded-full /* pill — buttons, avatar */
```

---

## Motion & Animation

All motion uses **Framer Motion**. Core pattern:

```tsx
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

const { ref, isInView } = useInView();

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6 }}
>
```

### Animation Presets

| Effect | Values | Used for |
|---|---|---|
| Fade up | `y: 20 → 0, opacity: 0 → 1, duration: 0.6` | Section titles, text blocks |
| Stagger children | `delay: i * 0.1` | Grid items, lists |
| Slower reveal | `duration: 0.7` | Hero, CTA sections |
| Image reveal | `opacity: 0 → 1` via `LazyImage` | All images |

### Rules
- **Never animate on desktop hover** with translateY — use opacity and color only
- **Grayscale → color on hover** for portfolio images: `grayscale group-hover:grayscale-0 transition-all duration-700`
- **Overlay on hover**: `opacity-0 group-hover:opacity-100 transition-opacity duration-300`
- Logo strip scroll: `animation: scroll-logos 40s linear infinite` — pauses on hover

---

## Component Patterns

### Buttons

```tsx
// Primary CTA (hero)
<Button variant="hero">Portfolio</Button>
// → bg-primary, white text, rounded-full, h-12 px-8

// Outline CTA
<Button variant="heroOutline">Contact</Button>
// → border border-primary/40, text-foreground, rounded-full

// Dark CTA (on light sections)
<Button className="bg-foreground text-background rounded-full">
```

### Cards
```tsx
<div className="border border-border rounded-xl bg-card overflow-hidden">
```
Always `bg-card` not `bg-background` for cards. Always `border-border`. Never drop shadows on dark backgrounds — use border instead.

### Image overlay pattern (portfolio grid):
```tsx
<div className="relative group overflow-hidden rounded-lg">
  <LazyImage src={...} className="grayscale group-hover:grayscale-0 transition-all duration-700" fill />
  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
  <div className="absolute bottom-0 left-0 right-0 p-6">
    {/* text content */}
  </div>
</div>
```

### Section eyebrow + title:
```tsx
<p className="text-sm uppercase tracking-[0.3em] text-primary font-display mb-4">
  {subtitle}
</p>
<h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
  {titleFirstPart} <span className="text-primary">{lastWord}</span>
</h2>
```

### Divider lines:
```tsx
<div className="border-t border-border" />     /* standard */
<div className="border-y border-border/50" />  /* subtle, 50% opacity */
```

---

## Page Structure

### Public pages
```
Header (fixed, h-16, bg-background/80 backdrop-blur)
  └── Logo left | Nav center | CTA button right

Main content
  └── pt-32 to clear fixed header on first section

Footer
  └── 3-column grid: brand+desc | nav | connect
  └── bg with hero-bg image at 8% opacity overlay
```

### Admin dashboard
```
Sidebar (fixed left, w-60 / w-16 collapsed)
Main content area (ml-60, scrollable)
  └── Page title in top bar
  └── Content component
```

---

## LazyImage Component

All images use `LazyImage` which fades in after load (prevents layout shift):

```tsx
<LazyImage
  src={url}
  alt="description"
  fill          // absolute positioned, fills parent
  aspectRatio="video" // or "square" | "portrait" | "auto"
  className="object-cover"
/>
```

The parent must be `relative overflow-hidden` with a defined height when using `fill`.

---

## Media / Image System

Images are stored in **Supabase Storage** (`site-media` bucket) and referenced in the `media_assets` table by `slot_key`. The `useMediaUrl(slotKey, fallback)` hook fetches the live URL with a reactive cache — all components update instantly when an image is replaced in the dashboard.

### Slot key naming convention:
```
hero-bg              ← page-section
hero-person
selected-works-1     ← section-index
process-step-1
cta-side-image       ← section-descriptor
review-client-1      ← type-index (legacy, now per-DB-row)
```

### Per-record images (not in media_assets):
- **Reviews** — `avatar_url`, `expanded_image_url` stored directly on each review row
- **Companies** — `logo_url`, `cover_url`, `featured_image_url`, `design_urls[]` stored on each company row
- **Logo strip** — `logo_url` stored on each `logo_strip_items` row

---

## What Makes This Design Work

A few things that are easy to accidentally break:

1. **The warm off-white foreground** (`45 20% 90%`) — if you switch to pure white text the warmth disappears and it looks generic.

2. **Purple is one color** — don't introduce a second accent. The restraint is the point.

3. **Space Grotesk for headings only** — if you use it for body text it loses impact. DM Sans for everything else.

4. **Borders, not shadows** — on dark backgrounds, box shadows disappear. Use `border border-border` everywhere instead of `shadow-*`.

5. **The background isn't pure black** — `hsl(240 6% 6%)` has a subtle blue-grey tint that makes the purple accent feel intentional and not random.

6. **Uppercase tracking on small labels** — `tracking-[0.2em]` not Tailwind's `tracking-widest`. The exact value matters for the rhythm.

7. **Images are grayscale by default** in the portfolio grid — this keeps visual weight on the type and layout. Color on hover is the reward.

---

## Extending This Design

When adding a new page or section, ask:

- Does the section need a full `py-24 md:py-32` or is it a compact component?
- Is the heading a "split" title (last word purple) or a plain heading?
- Does it need an eyebrow label above?
- Are images decorative (use opacity + grayscale) or featured (full color)?
- Does the motion trigger on scroll (`useInView`) or on mount?

Keep new components in the same directory structure:
```
src/components/
  home/        ← homepage sections
  layout/      ← Header, Footer
  shared/      ← reusable across pages (ContactForm)
  admin/       ← dashboard components
  ui/          ← shadcn primitives, never edit these directly
```
