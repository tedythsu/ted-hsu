# Zenith Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimalist dark portfolio for Ted Hsu featuring a Bento Grid home, YouTube Spotlight page with facade pattern, and full-screen WebApp iframe flip page.

**Architecture:** Next.js 15 App Router with static TypeScript data files. Three routes: `/` (Bento + ResumeTimeline), `/youtube` (Spotlight), `/projects` (iframe flip). Components are Client Components where interactivity is required, Server Components otherwise.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, Vitest + React Testing Library

---

## File Map

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout: Geist font, dark-flash prevention, Navbar + Footer shell |
| `app/globals.css` | Tailwind import, custom scrollbar, text selection color |
| `app/page.tsx` | Home page — composes BentoGrid + ResumeTimeline + PageTransition |
| `app/youtube/page.tsx` | YouTube page — composes YouTubeSpotlight + PageTransition |
| `app/projects/page.tsx` | Projects page — composes ProjectFlip + PageTransition |
| `components/Navbar.tsx` | Fixed scroll-hide nav with active link detection |
| `components/BentoGrid.tsx` | 4-col × 3-row home bento layout with all 5 cells |
| `components/YouTubeSpotlight.tsx` | Facade pattern player + thumbnail rail + keyboard nav |
| `components/ProjectFlip.tsx` | Full-viewport iframe with slide animation + keyboard nav |
| `components/ResumeTimeline.tsx` | Vertical career timeline with roles, tags, dates |
| `components/Footer.tsx` | One-line footer with "Built with Claude Code" attribution |
| `components/PageTransition.tsx` | Framer Motion fade+slide wrapper for each page |
| `data/profile.ts` | Personal info, skills, SEO metadata, social links |
| `data/videos.ts` | YouTube video list: `{ id, title, thumbnail }[]` |
| `data/projects.ts` | WebApp project list: `{ name, url, github, tags, screenshot }[]` |
| `next.config.ts` | YouTube thumbnail image domain allow-list |
| `vitest.config.ts` | Vitest config with jsdom + path alias |
| `vitest.setup.ts` | `@testing-library/jest-dom` import |

---

## Task 1: Initialize Project + Testing

**Files:**
- Create: `zenith/` (Next.js 15 scaffold)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (add test scripts)

- [ ] **Step 1: Back up existing docs, scaffold Next.js into zenith/**

```bash
cd /Users/tedhsumbp2024/Documents/workspace

# Back up docs created during brainstorming
cp -r zenith/docs /tmp/zenith-docs-backup

# Scaffold a fresh Next.js project (temp name to avoid directory conflict)
npx create-next-app@latest zenith-temp \
  --typescript --tailwind --eslint --app --no-src-dir \
  --import-alias "@/*" --yes

# Merge scaffold into zenith/ (preserves .superpowers/ content)
cp -r zenith-temp/. zenith/
rm -rf zenith-temp

# Restore docs
cp -r /tmp/zenith-docs-backup zenith/docs
```

- [ ] **Step 2: Verify scaffold**

```bash
cd /Users/tedhsumbp2024/Documents/workspace/zenith
ls
# Expected: app/ components/ public/ package.json next.config.ts tsconfig.json
node -e "const p = require('./package.json'); console.log('next:', p.dependencies.next)"
# Expected: next: ^15.x.x
```

- [ ] **Step 3: Install runtime dependencies**

```bash
npm install framer-motion lucide-react
```

- [ ] **Step 4: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 5: Create vitest.config.ts**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 6: Create vitest.setup.ts**

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Add test scripts to package.json**

Edit `package.json` — add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 8: Verify test runner works**

```bash
npm run test:run
# Expected: no test files found, exit 0 (not an error)
```

- [ ] **Step 9: Update next.config.ts for YouTube thumbnails**

`next.config.ts`:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js 15 project with Vitest and YouTube image config"
```

---

## Task 2: Global Styles & Layout Foundation

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Check Tailwind version**

```bash
node -e "const p = require('./package.json'); console.log(p.devDependencies.tailwindcss ?? p.dependencies?.tailwindcss)"
```

If the installed version is `^3.x.x`, upgrade to v4:
```bash
npm install tailwindcss@latest @tailwindcss/postcss@latest postcss@latest
```

Then update `postcss.config.mjs`:
```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

- [ ] **Step 2: Write globals.css**

`app/globals.css`:
```css
@import "tailwindcss";

/* Custom 4px scrollbar — zinc palette */
* {
  scrollbar-width: thin;
  scrollbar-color: #52525b #27272a;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #27272a;
}

::-webkit-scrollbar-thumb {
  background: #52525b;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #71717a;
}

/* Brand-consistent text selection */
::selection {
  background: #3f3f46;
  color: #ffffff;
}
```

- [ ] **Step 3: Write layout.tsx**

`app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { profile } from '@/data/profile'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: `${profile.name} — Frontend Engineer`,
  description: profile.seo.description,
  openGraph: {
    title: `${profile.name} — Frontend Engineer`,
    description: profile.seo.description,
    images: [{ url: profile.seo.ogImage, width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#09090b' }}>
      <body className={`${geist.variable} font-sans bg-zinc-950 text-zinc-100 antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

Note: `style={{ background: '#09090b' }}` on `<html>` is intentional — it renders before CSS loads, preventing the white flash on hard refresh.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: global styles — dark flash prevention, custom scrollbar, text selection"
```

---

## Task 3: Static Data Files

**Files:**
- Create: `data/profile.ts`
- Create: `data/videos.ts`
- Create: `data/projects.ts`

- [ ] **Step 1: Create data/profile.ts**

`data/profile.ts`:
```ts
export const profile = {
  name: 'Ted Hsu',
  tagline: 'Frontend Engineer · YouTube Creator',
  bio: 'Frontend engineer with expertise in Angular & TypeScript. I build production web apps and share gaming content on YouTube.',
  skills: ['Angular', 'TypeScript', 'AI Tools', 'Next.js', 'RxJS'],
  primarySkill: 'Angular' as const,
  resumeUrl: '/resume.pdf',
  socials: {
    github: 'https://github.com/tedythsu/',
    youtube: 'https://www.youtube.com/@TedHsu-v6s',
  },
  seo: {
    description: 'Frontend Engineer specializing in Angular & TypeScript. YouTube creator covering gaming & dev.',
    ogImage: '/og-image.png',
  },
} as const
```

- [ ] **Step 2: Create data/videos.ts**

`data/videos.ts`:
```ts
export interface Video {
  id: string
  title: string
  thumbnail: string
}

export const videos: Video[] = [
  {
    id: 'REPLACE_WITH_VIDEO_ID',
    title: 'My First Video Title',
    thumbnail: 'https://img.youtube.com/vi/REPLACE_WITH_VIDEO_ID/maxresdefault.jpg',
  },
]
```

**Action required:** Replace `REPLACE_WITH_VIDEO_ID` with real YouTube video IDs from https://www.youtube.com/@TedHsu-v6s. Each video's thumbnail URL auto-derives from `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`.

- [ ] **Step 3: Create data/projects.ts**

`data/projects.ts`:
```ts
export interface Project {
  name: string
  url: string
  github: string
  tags: string[]
  screenshot: string
}

export const projects: Project[] = [
  {
    name: 'Atmos: Live Like a Pro',
    url: 'https://your-atmos-app.vercel.app',
    github: 'https://github.com/tedythsu/atmos',
    tags: ['React', 'TypeScript', 'AI'],
    screenshot: '/screenshots/atmos.png',
  },
]
```

**Action required:** Replace with real deployed URLs and GitHub links. Add screenshots to `public/screenshots/`. If a project has no screenshot, use `''` — the Bento cell will skip the background image.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 5: Commit**

```bash
git add data/
git commit -m "feat: static data files — profile, videos, projects"
```

---

## Task 4: Navbar Component

**Files:**
- Create: `components/Navbar.tsx`
- Create: `components/Navbar.test.tsx`

- [ ] **Step 1: Write failing tests**

`components/Navbar.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('Ted Hsu')).toBeInTheDocument()
  })

  it('renders all three navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('YouTube')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('applies active style to the current path link', () => {
    render(<Navbar />)
    // usePathname returns '/', so Home link should have text-white class
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveClass('text-white')
  })

  it('applies muted style to inactive links', () => {
    render(<Navbar />)
    const youtubeLink = screen.getByText('YouTube').closest('a')
    expect(youtubeLink).toHaveClass('text-zinc-500')
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

```bash
npm run test:run -- components/Navbar.test.tsx
# Expected: FAIL — Cannot find module './Navbar'
```

- [ ] **Step 3: Implement Navbar**

`components/Navbar.tsx`:
```tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/youtube', label: 'YouTube' },
  { href: '/projects', label: 'Projects' },
]

export function Navbar() {
  const [visible, setVisible] = useState(true)
  const [lastY, setLastY] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setVisible(y < lastY || y < 64)
      setLastY(y)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastY])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-transform duration-200"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
    >
      <nav className="flex items-center justify-between px-6 h-14 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-900">
        <Link href="/" className="text-sm font-medium text-white tracking-tight">
          Ted Hsu
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname === href
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test:run -- components/Navbar.test.tsx
# Expected: PASS (4 tests)
```

- [ ] **Step 5: Commit**

```bash
git add components/Navbar.tsx components/Navbar.test.tsx
git commit -m "feat: scroll-hide Navbar with active link highlighting"
```

---

## Task 5: BentoGrid + Home Page

**Files:**
- Create: `components/BentoGrid.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement BentoGrid**

`components/BentoGrid.tsx`:
```tsx
import Link from 'next/link'
import Image from 'next/image'
import { Github, Youtube, Download } from 'lucide-react'
import { profile } from '@/data/profile'
import { videos } from '@/data/videos'
import { projects } from '@/data/projects'

function BentoCell({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 transition-all duration-300 hover:border-zinc-600 hover:shadow-[0_0_12px_rgba(255,255,255,0.04)] ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

export function BentoGrid() {
  const featuredVideo = videos[0]
  const featuredProject = projects[0]

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3 min-h-screen p-4 pt-[70px]">
      {/* Identity — 2 cols × 2 rows */}
      <BentoCell className="col-span-2 row-span-2 flex flex-col justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-3">
            Frontend Engineer
          </p>
          <h1 className="text-5xl font-bold text-white tracking-tight leading-none mb-3">
            Ted Hsu
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            {profile.tagline}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a
            href={profile.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <Youtube className="w-4 h-4" />
            YouTube
          </a>
          <a
            href={profile.resumeUrl}
            download
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors ml-auto"
          >
            <Download className="w-4 h-4" />
            Resume
          </a>
        </div>
      </BentoCell>

      {/* YouTube preview — 2 cols × 1 row */}
      <Link href="/youtube" className="col-span-2 row-span-1">
        <BentoCell className="h-full relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <Image
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              fill
              className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
            />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
              YouTube
            </p>
            <div>
              <p className="text-white text-sm font-medium line-clamp-2">
                {featuredVideo.title}
              </p>
              <p className="text-zinc-500 text-xs mt-1">Watch →</p>
            </div>
          </div>
        </BentoCell>
      </Link>

      {/* Projects preview — 2 cols × 1 row */}
      <Link href="/projects" className="col-span-2 row-span-1">
        <BentoCell className="h-full relative overflow-hidden group cursor-pointer">
          {featuredProject.screenshot && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src={featuredProject.screenshot}
                alt={featuredProject.name}
                fill
                className="object-cover opacity-25 group-hover:opacity-45 transition-opacity duration-300"
              />
            </div>
          )}
          <div className="relative z-10 flex flex-col h-full justify-between">
            <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
              WebApps
            </p>
            <div>
              <p className="text-white text-sm font-medium">{featuredProject.name}</p>
              <div className="flex gap-1 mt-1.5">
                {featuredProject.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-zinc-500 bg-zinc-800 rounded px-1.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </BentoCell>
      </Link>

      {/* Skills — 2 cols × 1 row */}
      <BentoCell className="col-span-2 row-span-1">
        <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-3">
          Skills
        </p>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                skill === profile.primarySkill
                  ? 'border-zinc-400 text-zinc-200 bg-zinc-800'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </BentoCell>

      {/* Bio + Resume CTA — 2 cols × 1 row */}
      <BentoCell className="col-span-2 row-span-1 flex flex-col justify-between">
        <p className="text-sm text-zinc-400 leading-relaxed">{profile.bio}</p>
        <a
          href={profile.resumeUrl}
          download
          className="inline-flex items-center gap-2 text-xs text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2 w-fit transition-colors"
        >
          <Download className="w-3 h-3" />
          Download Resume
        </a>
      </BentoCell>
    </div>
  )
}
```

- [ ] **Step 2: Update Home page**

`app/page.tsx`:
```tsx
import { BentoGrid } from '@/components/BentoGrid'

export default function Home() {
  return <BentoGrid />
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
# Open http://localhost:3000
# Verify:
# - All 5 bento cells fill the screen without scrolling (on 1080p+)
# - Identity cell: large "Ted Hsu" heading, tagline, 3 icon links at bottom
# - YouTube cell: thumbnail background, "YOUTUBE" label, video title
# - Projects cell: "WEBAPPS" label, project name, tech tags
# - Skills cell: Angular pill is brighter/emphasized vs others
# - Bio cell: text + "Download Resume" button
# - Hovering any cell: border brightens + faint glow
```

- [ ] **Step 4: Commit**

```bash
git add components/BentoGrid.tsx app/page.tsx
git commit -m "feat: BentoGrid home page with 5-cell layout, identity, YouTube, projects, skills, bio"
```

---

## Task 6: YouTube Spotlight Page

**Files:**
- Create: `components/YouTubeSpotlight.tsx`
- Create: `components/YouTubeSpotlight.test.tsx`
- Create: `app/youtube/page.tsx`

- [ ] **Step 1: Write failing tests**

`components/YouTubeSpotlight.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { YouTubeSpotlight } from './YouTubeSpotlight'

vi.mock('@/data/videos', () => ({
  videos: [
    { id: 'abc123', title: 'First Video', thumbnail: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg' },
    { id: 'def456', title: 'Second Video', thumbnail: 'https://img.youtube.com/vi/def456/maxresdefault.jpg' },
  ],
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

describe('YouTubeSpotlight', () => {
  it('shows play button initially, not iframe', () => {
    render(<YouTubeSpotlight />)
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    expect(screen.queryByTitle('YouTube player')).not.toBeInTheDocument()
  })

  it('loads iframe when play button is clicked', () => {
    render(<YouTubeSpotlight />)
    fireEvent.click(screen.getByRole('button', { name: /play/i }))
    expect(screen.getByTitle('YouTube player')).toBeInTheDocument()
  })

  it('shows the first video title initially', () => {
    render(<YouTubeSpotlight />)
    expect(screen.getByText('First Video')).toBeInTheDocument()
  })

  it('switches to next video on next button click and resets to facade', () => {
    render(<YouTubeSpotlight />)
    // click next
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('Second Video')).toBeInTheDocument()
    // switching video resets to facade (no iframe)
    expect(screen.queryByTitle('YouTube player')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

```bash
npm run test:run -- components/YouTubeSpotlight.test.tsx
# Expected: FAIL — Cannot find module './YouTubeSpotlight'
```

- [ ] **Step 3: Implement YouTubeSpotlight**

`components/YouTubeSpotlight.tsx`:
```tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { videos, type Video } from '@/data/videos'

function VideoFacade({ video, onPlay }: { video: Video; onPlay: () => void }) {
  return (
    <button
      onClick={onPlay}
      aria-label="play"
      className="relative w-full aspect-video rounded-xl overflow-hidden group"
    >
      <Image
        src={video.thumbnail}
        alt={video.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <Play className="w-6 h-6 text-white fill-white ml-1" />
        </div>
      </div>
    </button>
  )
}

function VideoPlayer({ video }: { video: Video }) {
  return (
    <iframe
      title="YouTube player"
      className="w-full aspect-video rounded-xl"
      src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
      allow="autoplay; encrypted-media; fullscreen"
      allowFullScreen
    />
  )
}

export function YouTubeSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const activeVideo = videos[activeIndex]

  const go = (dir: -1 | 1) => {
    const next = activeIndex + dir
    if (next < 0 || next >= videos.length) return
    setActiveIndex(next)
    setPlaying(false)
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 max-w-5xl mx-auto">
      <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-6">
        YouTube
      </p>

      <div className="w-full mb-6">
        {playing ? (
          <VideoPlayer video={activeVideo} />
        ) : (
          <VideoFacade video={activeVideo} onPlay={() => setPlaying(true)} />
        )}
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-white">{activeVideo.title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            disabled={activeIndex === 0}
            aria-label="previous"
            className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-zinc-600 w-12 text-center tabular-nums">
            {activeIndex + 1} / {videos.length}
          </span>
          <button
            onClick={() => go(1)}
            disabled={activeIndex === videos.length - 1}
            aria-label="next"
            className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thumbnail rail */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {videos.map((video, i) => (
          <button
            key={video.id}
            onClick={() => { setActiveIndex(i); setPlaying(false) }}
            className={`relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              i === activeIndex
                ? 'border-white/60'
                : 'border-transparent opacity-50 hover:opacity-75'
            }`}
          >
            <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create YouTube page**

`app/youtube/page.tsx`:
```tsx
import { YouTubeSpotlight } from '@/components/YouTubeSpotlight'

export default function YouTubePage() {
  return <YouTubeSpotlight />
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm run test:run -- components/YouTubeSpotlight.test.tsx
# Expected: PASS (4 tests)
```

- [ ] **Step 6: Verify in browser**

```bash
# Open http://localhost:3000/youtube
# Verify:
# - "YOUTUBE" label in small caps
# - Large thumbnail with custom circular play button (NO YouTube iframe)
# - Clicking play → YouTube iframe with autoplay
# - Prev/Next buttons: counter shows "1 / N", prev is disabled on video 1
# - Clicking next → thumbnail changes, counter increments, playing resets to facade
# - Thumbnail rail: active has white border, others are dimmed
```

- [ ] **Step 7: Commit**

```bash
git add components/YouTubeSpotlight.tsx components/YouTubeSpotlight.test.tsx app/youtube/
git commit -m "feat: YouTube Spotlight page with facade pattern and thumbnail rail"
```

---

## Task 7: ProjectFlip Page

**Files:**
- Create: `components/ProjectFlip.tsx`
- Create: `components/ProjectFlip.test.tsx`
- Create: `app/projects/page.tsx`

- [ ] **Step 1: Write failing tests**

`components/ProjectFlip.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectFlip } from './ProjectFlip'

vi.mock('@/data/projects', () => ({
  projects: [
    { name: 'App One', url: 'https://one.example.com', github: 'https://github.com/x/one', tags: ['React'], screenshot: '' },
    { name: 'App Two', url: 'https://two.example.com', github: 'https://github.com/x/two', tags: ['Angular'], screenshot: '' },
    { name: 'App Three', url: 'https://three.example.com', github: 'https://github.com/x/three', tags: ['TS'], screenshot: '' },
  ],
}))

vi.mock('framer-motion', () => ({
  motion: {
    iframe: ({ title, src, className }: { title: string; src: string; className: string }) => (
      <iframe title={title} src={src} className={className} />
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('ProjectFlip', () => {
  it('shows the first project name initially', () => {
    render(<ProjectFlip />)
    expect(screen.getByText('App One')).toBeInTheDocument()
  })

  it('navigates to next project on ArrowRight keypress', () => {
    render(<ProjectFlip />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('App Two')).toBeInTheDocument()
  })

  it('navigates to previous project on ArrowLeft keypress', () => {
    render(<ProjectFlip />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('App One')).toBeInTheDocument()
  })

  it('does not navigate past the last project', () => {
    render(<ProjectFlip />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowRight' }) // at end, no-op
    expect(screen.getByText('App Three')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
npm run test:run -- components/ProjectFlip.test.tsx
# Expected: FAIL — Cannot find module './ProjectFlip'
```

- [ ] **Step 3: Implement ProjectFlip**

`components/ProjectFlip.tsx`:
```tsx
'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Github } from 'lucide-react'
import { projects } from '@/data/projects'

export function ProjectFlip() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const go = (dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= projects.length) return
    setDirection(dir)
    setIndex(next)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [index]) // re-registers on index change so go() closes over fresh index

  const project = projects[index]

  return (
    <div className="fixed inset-0 flex flex-col" style={{ top: '56px' }}>
      {/* Fake browser chrome bar */}
      <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-3 z-10 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
        </div>
        <div className="flex-1 mx-2 bg-zinc-800 rounded text-xs text-zinc-500 px-3 py-1 text-center truncate">
          {project.url}
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>

      {/* Project name + tags overlay */}
      <div className="absolute top-[66px] left-4 z-20 pointer-events-none">
        <h2 className="text-white font-semibold text-sm bg-zinc-950/70 backdrop-blur-sm px-2 py-1 rounded">
          {project.name}
        </h2>
        <div className="flex gap-1 mt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-zinc-400 bg-zinc-950/70 backdrop-blur-sm border border-zinc-800 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Animated iframe */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.iframe
            key={project.url}
            src={project.url}
            title={project.name}
            className="absolute inset-0 w-full h-full border-0"
            initial={{ x: `${direction * 100}%`, opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: `${direction * -100}%`, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          />
        </AnimatePresence>
      </div>

      {/* Left arrow */}
      <button
        onClick={() => go(-1)}
        disabled={index === 0}
        aria-label="Previous project"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => go(1)}
        disabled={index === projects.length - 1}
        aria-label="Next project"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Page indicator dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
            aria-label={`Go to project ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create Projects page**

`app/projects/page.tsx`:
```tsx
import { ProjectFlip } from '@/components/ProjectFlip'

export default function ProjectsPage() {
  return <ProjectFlip />
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm run test:run -- components/ProjectFlip.test.tsx
# Expected: PASS (4 tests)
```

- [ ] **Step 6: Verify in browser**

```bash
# Open http://localhost:3000/projects
# Verify:
# - Full-screen iframe below navbar + browser chrome bar
# - Fake browser bar shows project URL + GitHub icon (right side)
# - Project name + tags overlay (top-left, blurred dark bg)
# - Left arrow is disabled on first project
# - Right arrow advances to next project with slide animation
# - ArrowLeft / ArrowRight keyboard keys work
# - Dot indicators at bottom: active dot is wider (6×1.5px → 24×1.5px) and white
```

- [ ] **Step 7: Commit**

```bash
git add components/ProjectFlip.tsx components/ProjectFlip.test.tsx app/projects/
git commit -m "feat: ProjectFlip page with full-screen iframe, slide animation, keyboard nav"
```

---

## Task 8: ResumeTimeline + Footer

**Files:**
- Create: `components/ResumeTimeline.tsx`
- Create: `components/Footer.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement ResumeTimeline**

`components/ResumeTimeline.tsx`:
```tsx
const timeline = [
  {
    role: 'Senior Frontend Engineer',
    company: 'Your Current Company',
    period: '2023 — Present',
    description: 'Angular architecture, TypeScript, AI tool integration.',
    tags: ['Angular', 'TypeScript', 'RxJS', 'AI Tools'],
  },
  {
    role: 'Frontend Developer',
    company: 'Previous Company',
    period: '2021 — 2023',
    description: 'Built scalable enterprise web applications.',
    tags: ['Angular', 'TypeScript', 'JavaScript'],
  },
]

export function ResumeTimeline() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-10">
        Experience
      </p>
      <div className="relative">
        <div className="absolute left-0 top-2 bottom-0 w-px bg-zinc-800" />
        <div className="space-y-10 pl-8">
          {timeline.map((entry, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[33px] top-1.5 w-2 h-2 rounded-full bg-zinc-600 border-2 border-zinc-950" />
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-white font-medium text-sm">{entry.role}</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">{entry.company}</p>
                </div>
                <span className="text-xs text-zinc-600 font-mono shrink-0">{entry.period}</span>
              </div>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{entry.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {entry.tags.map((tag) => (
                  <span key={tag} className="text-xs text-zinc-500 border border-zinc-800 rounded px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Action required:** Replace `timeline` entries with Ted Hsu's actual work history.

- [ ] **Step 2: Implement Footer**

`components/Footer.tsx`:
```tsx
export function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-6">
      <p className="text-center text-xs text-zinc-600">
        Built with Claude Code & Next.js 15 · © {new Date().getFullYear()} Ted Hsu
      </p>
    </footer>
  )
}
```

- [ ] **Step 3: Add ResumeTimeline to Home page**

`app/page.tsx`:
```tsx
import { BentoGrid } from '@/components/BentoGrid'
import { ResumeTimeline } from '@/components/ResumeTimeline'

export default function Home() {
  return (
    <>
      <BentoGrid />
      <ResumeTimeline />
    </>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
# Open http://localhost:3000
# Scroll below the bento grid
# Verify:
# - "EXPERIENCE" in small caps label
# - Vertical line with dots marking each entry
# - Role + company on left, period (monospace font) on right
# - Description text in zinc-400
# - Tech tags in small bordered pills
# - Footer at very bottom: "Built with Claude Code & Next.js 15 · © 2026 Ted Hsu"
```

- [ ] **Step 5: Commit**

```bash
git add components/ResumeTimeline.tsx components/Footer.tsx app/page.tsx
git commit -m "feat: ResumeTimeline career section and Footer"
```

---

## Task 9: Framer Motion Page Transitions

**Files:**
- Create: `components/PageTransition.tsx`
- Modify: `app/page.tsx`
- Modify: `app/youtube/page.tsx`
- Modify: `app/projects/page.tsx`

- [ ] **Step 1: Create PageTransition wrapper**

`components/PageTransition.tsx`:
```tsx
'use client'
import { motion } from 'framer-motion'

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Wrap all pages**

`app/page.tsx`:
```tsx
import { BentoGrid } from '@/components/BentoGrid'
import { ResumeTimeline } from '@/components/ResumeTimeline'
import { PageTransition } from '@/components/PageTransition'

export default function Home() {
  return (
    <PageTransition>
      <BentoGrid />
      <ResumeTimeline />
    </PageTransition>
  )
}
```

`app/youtube/page.tsx`:
```tsx
import { YouTubeSpotlight } from '@/components/YouTubeSpotlight'
import { PageTransition } from '@/components/PageTransition'

export default function YouTubePage() {
  return (
    <PageTransition>
      <YouTubeSpotlight />
    </PageTransition>
  )
}
```

`app/projects/page.tsx`:
```tsx
import { ProjectFlip } from '@/components/ProjectFlip'
import { PageTransition } from '@/components/PageTransition'

export default function ProjectsPage() {
  return (
    <PageTransition>
      <ProjectFlip />
    </PageTransition>
  )
}
```

- [ ] **Step 3: Verify in browser**

```bash
# Navigate between Home → YouTube → Projects using the navbar
# Verify:
# - Each page fades in with a subtle upward drift on load
# - Transition feels smooth at ~0.4s
# - No flash or layout shift during transition
```

- [ ] **Step 4: Commit**

```bash
git add components/PageTransition.tsx app/page.tsx app/youtube/page.tsx app/projects/page.tsx
git commit -m "feat: Framer Motion page transitions — fade + slide entrance"
```

---

## Task 10: Final Verification + Deploy

- [ ] **Step 1: Run full test suite**

```bash
npm run test:run
# Expected: PASS — 12 tests total
# Navbar: 4 | YouTubeSpotlight: 4 | ProjectFlip: 4
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 3: Lint check**

```bash
npm run lint
# Expected: no errors
```

- [ ] **Step 4: Production build**

```bash
npm run build
# Expected: ✓ Compiled successfully
# If build fails with Image hostname error, verify next.config.ts has img.youtube.com in remotePatterns (added in Task 1 Step 9)
```

- [ ] **Step 5: Add .superpowers to .gitignore**

Append to `.gitignore`:
```
.superpowers/
```

- [ ] **Step 6: Commit pre-deploy state**

```bash
git add .gitignore
git commit -m "chore: pre-deploy — all tests passing, build verified"
```

- [ ] **Step 7: Deploy to Vercel**

```bash
# Option A: Vercel CLI
npx vercel --prod

# Option B: Push to GitHub, then import at vercel.com/new
git remote add origin https://github.com/tedythsu/zenith.git
git push -u origin main
# Then: vercel.com/new → Import → Deploy
```

- [ ] **Step 8: Verify live site**

```bash
# After deploy, check the live URL:
# 1. Hard refresh (Cmd+Shift+R) — background should be dark immediately (no white flash)
# 2. Navbar: scroll down → hides, scroll up → appears
# 3. /youtube: thumbnail shows, click → iframe loads with autoplay
# 4. /projects: iframe loads, ArrowLeft/Right navigates, dots update
# 5. Paste URL at https://opengraph.xyz — verify og:image preview card appears
# 6. Custom scrollbar: visible in Chrome/Safari (4px zinc scrollbar)
```

---

## Manual Content Steps (after code is working)

These require Ted Hsu's actual content — not automatable:

1. **YouTube video IDs** — update `data/videos.ts` with real IDs from https://www.youtube.com/@TedHsu-v6s
2. **Project data** — update `data/projects.ts` with real URLs, GitHub links, tag lists
3. **Project screenshots** — add PNG/WebP files to `public/screenshots/`
4. **OG image** — add a `public/og-image.png` (1200×630px) for social sharing previews
5. **Resume PDF** — add `public/resume.pdf`
6. **Work history** — update `timeline` array in `components/ResumeTimeline.tsx` with real roles
7. **Bio** — update `profile.bio` in `data/profile.ts` with actual personal statement
