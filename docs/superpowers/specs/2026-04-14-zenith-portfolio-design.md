# Zenith — Minimalist Dark Portfolio Design Spec

**Date:** 2026-04-14  
**Owner:** Ted Hsu  
**Status:** Approved

---

## Overview

A personal brand portfolio for a frontend engineer. Core goals: showcase YouTube gaming content, GitHub WebApps, and a professional resume. Visual philosophy: extreme minimalism with a dark aesthetic — no decoration that doesn't serve a function.

**Live identity:**
- Name: Ted Hsu
- YouTube: https://www.youtube.com/@TedHsu-v6s
- GitHub: https://github.com/tedythsu/

---

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SSG, file-based routing, Geist font built-in |
| Language | TypeScript | Type-safe data config files |
| Styling | Tailwind CSS v4 | CSS variables match spec palette exactly |
| Animation | Framer Motion | Page transitions, hover micro-animations, flip effect |
| Icons | Lucide React | Minimal line-weight icons |
| Content | Static TypeScript files | Engineer-maintained; edit → push → Vercel auto-deploys |
| Deployment | Vercel | Zero-config Next.js hosting |

**Not used:** Sanity CMS, Contentlayer (deprecated).

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `background` | `#09090b` (Zinc 950) | Page background |
| `surface` | `#18181b` (Zinc 900) | Cards, Bento cells |
| `border` | `#27272a` (Zinc 800) | Card borders, dividers |
| `border-hover` | `#52525b` (Zinc 600) | Hover state borders |
| `text-primary` | `#ffffff` | Headings, names |
| `text-secondary` | `#a1a1aa` (Zinc 400) | Body text, descriptions |
| `text-muted` | `#71717a` (Zinc 500) | Labels, timestamps |

---

## Typography

- **Font:** Geist (Next.js native via `next/font/google`)
- **Hierarchy:** weight contrast over color contrast
  - Display: 700–800, white
  - Body: 400, `#a1a1aa`
  - Labels: 500, uppercase, letter-spacing 0.1em

---

## Project Structure

```
zenith/
├── app/
│   ├── layout.tsx            # Global font, custom scrollbar, metadata
│   ├── page.tsx              # Home — Full Bento Hero
│   ├── youtube/
│   │   └── page.tsx          # YouTube Spotlight page
│   └── projects/
│       └── page.tsx          # Full-screen iframe flip page
├── components/
│   ├── Navbar.tsx            # Scroll-hide minimal nav
│   ├── BentoGrid.tsx         # Home bento layout
│   ├── YouTubeSpotlight.tsx  # Large player + thumbnail rail
│   ├── ProjectFlip.tsx       # Full-screen iframe paginator
│   └── ResumeTimeline.tsx    # Career timeline section
├── data/
│   ├── videos.ts             # { id, title, thumbnail }[]
│   ├── projects.ts           # { name, url, github, tags, screenshot }[]
│   └── profile.ts            # { bio, skills, resumeUrl, socials }
└── public/
    └── resume.pdf
```

---

## Pages

### Home `/`

Full Bento Hero — no separate hero section, the bento grid IS the hero. All visible on first screen.

**Grid cells:**
- **Large (2×2):** `Ted Hsu`, role tagline, GitHub + YouTube icon links
- **Medium:** Latest YouTube video thumbnail (uses `videos[0].thumbnail`) → links to `/youtube`
- **Medium:** Featured project screenshot (uses `projects[0].screenshot`) → links to `/projects`
- **Small:** Skills tags (Angular, TypeScript, AI Tools)
- **Small:** One-liner bio + resume download CTA (PDF)

**Below the fold (scroll section):** `ResumeTimeline` component — vertical career timeline with role, company, and date entries.

### YouTube `/youtube`

- **Facade pattern:** initial render shows only the video thumbnail + custom play button overlay. The `<iframe>` is injected into the DOM only when the user clicks play — avoids loading multiple YouTube embeds on page load and keeps PageSpeed score high.
- Full-width 16:9 player area (rounded corners); thumbnail rail below for switching
- Keyboard arrow keys supported for navigation
- Data: `data/videos.ts` — array of `{ id: string, title: string, thumbnail: string }`

### Projects `/projects`

- Full-viewport `<iframe>` embed of deployed WebApp
- Decorative browser chrome bar at top (fake URL bar showing app URL)
- Top-left overlay: project name + tech tags (fade in on load)
- Top-right overlay: GitHub icon link
- Left/right arrow buttons + keyboard arrow navigation
- Bottom: page indicator dots (e.g. `● ○ ○ ○`)
- Page transition: Framer Motion `AnimatePresence` with `x` slide + `opacity`
- Data: `data/projects.ts` — array of `{ name, url, github, tags, screenshot }`. The `screenshot` field is used only in the home Bento preview cell, not on this page.

---

## Components

### Navbar

- Fixed top, `z-50`
- Scroll down → `translateY(-100%)` (hidden), scroll up → `translateY(0)` (visible)
- Transition: `200ms ease`
- Left: `Ted Hsu` (small, 500 weight)
- Right: text links — Home / YouTube / Projects
- Background: `#09090b/80` + `backdrop-blur-sm`

### Visual Polish (applies globally)

- **Custom scrollbar:** 4px wide, `#27272a` track, `#52525b` thumb, rounded
- **Text selection color:** `selection:bg-zinc-700 selection:text-white` — brand-consistent highlight
- **Card hover:** border `#27272a` → `#52525b` + `box-shadow: 0 0 12px rgba(255,255,255,0.04)`
- **Page transitions:** Framer Motion `opacity` + `y: 16 → 0`, duration `0.4s ease-out`
- **Bento cells:** subtle `scale(1.01)` on hover via Framer Motion `whileHover`
- **Dark flash prevention:** `<html>` tag in `layout.tsx` must carry `style="background:#09090b"` as an inline style (not class-based) so the background renders before any CSS loads — prevents white flash on hard refresh

---

## Data Shape

```ts
// data/videos.ts
export const videos = [
  { id: 'YOUTUBE_ID', title: 'Video Title', thumbnail: 'https://...' },
]

// data/projects.ts
export const projects = [
  {
    name: 'Atmos: Live Like a Pro',
    url: 'https://your-app.vercel.app',
    github: 'https://github.com/tedythsu/repo',
    tags: ['React', 'TypeScript', 'AI'],
    screenshot: '/screenshots/atmos.png',
  },
]

// data/profile.ts
export const profile = {
  name: 'Ted Hsu',
  tagline: 'Frontend Engineer · YouTube Creator',
  bio: '...',
  skills: ['Angular', 'TypeScript', 'AI Tools'],
  // Skills marked as primary render with extra emphasis in BentoGrid
  primarySkill: 'Angular',
  resumeUrl: '/resume.pdf',
  socials: {
    github: 'https://github.com/tedythsu/',
    youtube: 'https://www.youtube.com/@TedHsu-v6s',
  },
  // SEO / Open Graph
  seo: {
    description: 'Frontend Engineer specializing in Angular & TypeScript. YouTube creator covering gaming & dev.',
    ogImage: '/og-image.png', // 1200×630px, placed in /public
  },
}
```

---

## Footer

Minimal one-line footer on all pages:

```
Built with Claude Code & Next.js 15  ·  © 2026 Ted Hsu
```

Small text, `#52525b`, centered. No extra links — keeps the page visually clean and serves as a conversation opener with interviewers about AI-assisted development.

---

## Out of Scope

- Backend / API routes
- Authentication
- Comments or contact form
- Dark/light mode toggle (dark-only by design)
- i18n (English/Chinese choice left to content in data files)
