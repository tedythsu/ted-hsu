# WWM Info Hub Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot the site from a guide-authoring site to an information aggregation hub — official YouTube feed, 陸服 news, curated Bahamut guide links, and live Bahamut community feed.

**Architecture:** Add two new API routes (`/api/youtube`, `/api/news`) following the existing `fast-xml-parser` + `unstable_cache` pattern. Restructure `SiteHome.tsx` layout in-place. Update `data/guides.ts` interface to curated external links. Remove the `/youtube` page and its Navbar entry.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, fast-xml-parser (already installed), framer-motion, lucide-react

---

## File Map

| File | Action |
|------|--------|
| `app/api/youtube/route.ts` | Create — official YT RSS feed |
| `app/api/news/route.ts` | Create — 陸服 official news scrape |
| `data/guides.ts` | Modify — change interface to external curated links |
| `app/guides/page.tsx` | Modify — open links externally, remove ready/slug logic |
| `components/SiteHome.tsx` | Modify — new layout with news + YT + Bahamut |
| `components/Navbar.tsx` | Modify — remove YouTube link |
| `data/site.ts` | Modify — update `youtube` URL to official channel |
| `app/youtube/page.tsx` | Delete |

---

### Task 1: Official YouTube RSS API

**Files:**
- Create: `app/api/youtube/route.ts`

- [ ] **Step 1: Create the route file**

```ts
// app/api/youtube/route.ts
import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { unstable_cache } from 'next/cache'

export interface YTVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
}

// YouTube channel handle page contains the channelId in its HTML.
// We fetch it once and cache it indefinitely (channel IDs never change).
async function getChannelId(): Promise<string | null> {
  try {
    const res = await fetch('https://www.youtube.com/@WhereWindsMeetHMT', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WWMGuide/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const match = html.match(/"channelId":"(UC[^"]{22})"/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

const fetchYTVideos = unstable_cache(
  async (): Promise<YTVideo[]> => {
    const channelId = await getChannelId()
    if (!channelId) return []

    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WWMGuide/1.0)' },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return []

    const xml = await res.text()
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
    const parsed = parser.parse(xml)

    const entries = parsed?.feed?.entry ?? []
    const arr = Array.isArray(entries) ? entries : [entries]

    return arr.slice(0, 6).map((entry: Record<string, unknown>) => {
      const id = String(entry['yt:videoId'] ?? '').trim()
      return {
        id,
        title: String(entry.title ?? '').trim(),
        thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        publishedAt: String(entry.published ?? '').trim(),
        url: `https://www.youtube.com/watch?v=${id}`,
      }
    })
  },
  ['yt-videos'],
  { revalidate: 1800 } // refresh every 30 minutes
)

export async function GET() {
  const videos = await fetchYTVideos()
  return NextResponse.json(videos)
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: no TypeScript errors, `/api/youtube` appears in route list as `ƒ (Dynamic)`.

- [ ] **Step 3: Smoke-test the route in the browser**

Start the dev server: `npm run dev`
Open: `http://localhost:3000/api/youtube`
Expected: JSON array of `{ id, title, thumbnail, publishedAt, url }` objects, or `[]` if YouTube is rate-limiting.

- [ ] **Step 4: Commit**

```bash
git add app/api/youtube/route.ts
git commit -m "feat: add official YouTube RSS API route"
```

---

### Task 2: 陸服 News API

**Files:**
- Create: `app/api/news/route.ts`

The official 燕雲十六聲 CN site (`https://yw.xd.com`) is a React SPA. Its news data is loaded from a JSON API endpoint. We attempt to fetch their `/api/news` or announcement endpoint. If unavailable (geo-block, rate-limit, structure change), the route returns `[]` and the home page hides the section gracefully.

**To verify the actual API URL:** Open `https://yw.xd.com/news` in a browser, open DevTools → Network tab, filter by Fetch/XHR, and look for a request that returns a list of news items. Update `NEWS_API_URL` below to match.

- [ ] **Step 1: Create the route file**

```ts
// app/api/news/route.ts
import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'

export interface NewsItem {
  title: string
  url: string
  pubDate: string
  source: string
}

// Primary source: XD official game site news API.
// IMPORTANT: Verify this URL by inspecting XHR requests on https://yw.xd.com/news
// Update NEWS_API_URL if the actual endpoint differs.
const NEWS_API_URL = 'https://yw.xd.com/api/news/list?page=1&pageSize=10'
const NEWS_BASE_URL = 'https://yw.xd.com/news/'

async function fetchFromXDSite(): Promise<NewsItem[]> {
  try {
    const res = await fetch(NEWS_API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WWMGuide/1.0)',
        'Referer': 'https://yw.xd.com/',
      },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return []
    const json = await res.json() as Record<string, unknown>

    // XD site typically wraps data in { data: { list: [...] } } or { list: [...] }
    const raw = (json?.data as Record<string, unknown>)?.list ?? json?.list ?? json?.data ?? []
    const items = Array.isArray(raw) ? raw : []

    return items.slice(0, 8).map((item: Record<string, unknown>) => ({
      title: String(item.title ?? item.name ?? '').trim(),
      url: item.url
        ? String(item.url)
        : `${NEWS_BASE_URL}${item.id ?? ''}`,
      pubDate: String(item.publishTime ?? item.createTime ?? item.date ?? '').trim(),
      source: '官網',
    })).filter((n) => n.title)
  } catch {
    return []
  }
}

const fetchNews = unstable_cache(
  async (): Promise<NewsItem[]> => {
    const items = await fetchFromXDSite()
    return items
  },
  ['wwm-news'],
  { revalidate: 900 } // refresh every 15 minutes
)

export async function GET() {
  const news = await fetchNews()
  return NextResponse.json(news)
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: no errors, `/api/news` appears in route list.

- [ ] **Step 3: Smoke-test**

Start dev: `npm run dev`
Open: `http://localhost:3000/api/news`
Expected: JSON array, or `[]` (empty is acceptable — the URL likely needs adjustment after inspecting the real site's network requests).

- [ ] **Step 4: Commit**

```bash
git add app/api/news/route.ts
git commit -m "feat: add 陸服 news API route (URL to be verified)"
```

---

### Task 3: Update `data/guides.ts` to curated external links

**Files:**
- Modify: `data/guides.ts`

- [ ] **Step 1: Replace the file contents**

```ts
// data/guides.ts
export interface Guide {
  title: string
  url: string        // external link — opens in new tab
  category: '新手入門' | '角色' | '副本' | '系統' | '進階'
  summary: string
  source: string     // e.g. '巴哈', '官網', 'YouTube'
  updatedAt: string
}

// 在這裡新增精選攻略連結（外部文章）
export const guides: Guide[] = [
  {
    title: '新手入門完整攻略（巴哈討論）',
    url: `https://forum.gamer.com.tw/B.php?bsn=75703`,
    category: '新手入門',
    summary: '燕雲十六聲巴哈姆特板塊，匯集玩家討論與攻略文章。',
    source: '巴哈',
    updatedAt: '2026-04-14',
  },
  {
    title: '戰鬥系統與閃避彈反教學',
    url: `https://forum.gamer.com.tw/B.php?bsn=75703`,
    category: '新手入門',
    summary: '了解閃避、彈反、武功系統與氣血機制，打好戰鬥基礎。',
    source: '巴哈',
    updatedAt: '2026-04-14',
  },
  {
    title: '角色與門派選擇指南',
    url: `https://forum.gamer.com.tw/B.php?bsn=75703`,
    category: '角色',
    summary: '各門派特色與初期角色選擇建議，找到最適合你的玩法。',
    source: '巴哈',
    updatedAt: '2026-04-14',
  },
]
```

Note: The URLs above default to the board index. Replace them with specific article URLs when you find useful Bahamut posts.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | grep -E 'error|Error'
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add data/guides.ts
git commit -m "feat: change guides to curated external links"
```

---

### Task 4: Update guides page for external links

**Files:**
- Modify: `app/guides/page.tsx`

The guides page currently links to internal routes (`/guides/${slug}`) and shows "準備中" badges. Replace with external links that open in a new tab, and show a source badge instead.

- [ ] **Step 1: Replace the file contents**

```tsx
// app/guides/page.tsx
import { guides } from '@/data/guides'
import { PageTransition } from '@/components/PageTransition'
import { ArrowUpRight } from 'lucide-react'

const categoryColor: Record<string, string> = {
  '新手入門': 'text-amber-600',
  '角色': 'text-sky-600',
  '副本': 'text-rose-600',
  '系統': 'text-emerald-600',
  '進階': 'text-purple-600',
}

export default function GuidesPage() {
  const categories = [...new Set(guides.map((g) => g.category))]

  return (
    <PageTransition>
      <div className="px-8 md:px-16 pt-24 pb-20">
        <p className="text-[11px] tracking-[0.22em] uppercase text-zinc-600 mb-4">精選攻略</p>
        <h1 className="font-[family-name:var(--font-dm-serif)] italic text-white text-5xl md:text-7xl leading-none mb-4">
          Guides
        </h1>
        <a
          href={`https://forum.gamer.com.tw/B.php?bsn=75703`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-16"
        >
          前往巴哈姆特板塊 <ArrowUpRight className="w-3 h-3" />
        </a>

        {categories.map((cat) => (
          <div key={cat} className="mb-14">
            <p className={`text-[10px] tracking-widest uppercase mb-6 ${categoryColor[cat] ?? 'text-zinc-600'}`}>
              {cat}
            </p>
            <div>
              {guides.filter((g) => g.category === cat).map((guide) => (
                <a
                  key={guide.title}
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-5 border-b border-zinc-800/40 hover:border-zinc-700/50 transition-colors"
                >
                  <div>
                    <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors mb-1">
                      {guide.title}
                    </p>
                    <p className="text-xs text-zinc-700 leading-relaxed max-w-lg">{guide.summary}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-[10px] text-zinc-700 border border-zinc-800 rounded px-2 py-0.5">
                      {guide.source}
                    </span>
                    <span className="text-xs text-zinc-800">{guide.updatedAt}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: no errors. `/guides` still listed as `○ (Static)`.

- [ ] **Step 3: Commit**

```bash
git add app/guides/page.tsx
git commit -m "feat: update guides page to open external curated links"
```

---

### Task 5: Restructure SiteHome

**Files:**
- Modify: `components/SiteHome.tsx`

Replace the current three-section layout (masthead + category strip + guides/Bahamut grid) with: masthead + news row + YouTube/Bahamut grid.

- [ ] **Step 1: Replace the file contents**

```tsx
// components/SiteHome.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { site } from '@/data/site'
import type { BahaPost } from '@/app/api/bahamut/route'
import type { YTVideo } from '@/app/api/youtube/route'
import type { NewsItem } from '@/app/api/news/route'

function useDateString() {
  const [date, setDate] = useState('')
  useEffect(() => {
    setDate(new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' }))
  }, [])
  return date
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.06, duration: 0.5 },
  }),
}

export function SiteHome() {
  const [posts, setPosts] = useState<BahaPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [videos, setVideos] = useState<YTVideo[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [news, setNews] = useState<NewsItem[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const dateStr = useDateString()

  useEffect(() => {
    fetch('/api/bahamut')
      .then((r) => r.json())
      .then((d) => { setPosts(d); setPostsLoading(false) })
      .catch(() => setPostsLoading(false))
    fetch('/api/youtube')
      .then((r) => r.json())
      .then((d) => { setVideos(d); setVideosLoading(false) })
      .catch(() => setVideosLoading(false))
    fetch('/api/news')
      .then((r) => r.json())
      .then((d) => { setNews(d); setNewsLoading(false) })
      .catch(() => setNewsLoading(false))
  }, [])

  return (
    <div className="pt-14">

      {/* ── Masthead ── */}
      <div className="px-8 md:px-16 py-3 flex items-center justify-between border-b border-zinc-800/60">
        <span className="text-xs font-medium text-zinc-300 tracking-wide">WWM Guide</span>
        <span className="text-xs text-zinc-400 hidden md:block">燕雲十六聲 資訊站</span>
        <span className="text-[11px] text-zinc-500 font-mono">{dateStr}</span>
      </div>

      {/* ── Section 01: Official News ── */}
      {(newsLoading || news.length > 0) && (
        <div className="px-8 md:px-16 py-8 border-b border-zinc-800/40">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-5 flex items-center gap-3">
            <span className="font-mono">01</span> 官方最新消息
          </p>
          {newsLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-zinc-900 rounded animate-pulse w-full" />
                  <div className="h-2 bg-zinc-900 rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
            {news.slice(0, 4).map((item, i) => (
              <motion.a
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group py-4 pr-6 border-b md:border-b-0 md:border-r border-zinc-800/30 last:border-0 hover:border-zinc-700/40 transition-colors"
              >
                <p className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug mb-2">
                  {item.title}
                </p>
                <p className="text-[10px] text-zinc-600">
                  {item.pubDate
                    ? new Date(item.pubDate).toLocaleDateString('zh-TW')
                    : item.source}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* ── Main two-column grid ── */}
      <div className="px-8 md:px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10">

        {/* Left: Official YouTube (2/3) */}
        <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-zinc-800/40 pb-10 md:pb-0 md:pr-10">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="font-mono">02</span> 官方 YouTube
            <a
              href={site.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 normal-case"
            >
              前往頻道 <ArrowUpRight className="w-3 h-3" />
            </a>
          </p>

          {videosLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video bg-zinc-900 animate-pulse rounded" />
                  <div className="h-3 bg-zinc-900 rounded animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          )}

          {!videosLoading && videos.length === 0 && (
            <p className="text-xs text-zinc-500">暫時無法取得影片</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {videos.slice(0, 4).map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="relative aspect-video overflow-hidden mb-3 bg-zinc-900">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-65 group-hover:scale-[1.02] transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all">
                      <Play className="w-3 h-3 text-white/70 ml-0.5" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">
                  {video.title}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Live Bahamut (1/3) */}
        <div className="md:col-span-1 pt-10 md:pt-0">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="font-mono">03</span> 巴哈 即時討論
            <a
              href={`https://forum.gamer.com.tw/B.php?bsn=${site.bahamutBsn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 normal-case"
            >
              板塊 <ArrowUpRight className="w-3 h-3" />
            </a>
          </p>

          {postsLoading && (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-zinc-900 rounded animate-pulse" style={{ width: `${70 + i % 3 * 10}%` }} />
              ))}
            </div>
          )}

          {!postsLoading && posts.length === 0 && (
            <p className="text-xs text-zinc-500">暫時無法取得資料</p>
          )}

          <div className="space-y-0">
            {posts.slice(0, 12).map((post, i) => (
              <motion.a
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 py-3.5 border-b border-zinc-800/30 hover:border-zinc-700/40 transition-colors"
              >
                <span className="text-[10px] text-zinc-600 font-mono flex-shrink-0 pt-0.5 w-4">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">
                    {post.title}
                  </p>
                  {post.author && (
                    <p className="text-[10px] text-zinc-600 mt-1">{post.author}</p>
                  )}
                </div>
                <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-0.5" />
              </motion.a>
            ))}
          </div>

          {/* Facebook link */}
          <div className="mt-8 pt-6 border-t border-zinc-800/40">
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <span>官方 Facebook 粉專</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <p className="text-[10px] text-zinc-600 mt-1">@WhereWindsMeetHMT</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add components/SiteHome.tsx
git commit -m "feat: restructure home page to info-hub layout (news + YT + Bahamut)"
```

---

### Task 6: Update Navbar, site data, and remove youtube page

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `data/site.ts`
- Delete: `app/youtube/page.tsx`

- [ ] **Step 1: Update Navbar — remove YouTube link**

Replace lines 6–11 in `components/Navbar.tsx`:

```ts
const links = [
  { href: '/', label: '首頁' },
  { href: '/guides', label: '攻略' },
  { href: '/community', label: '社群' },
]
```

(Remove the `{ href: '/youtube', label: 'YouTube' }` entry.)

- [ ] **Step 2: Update site.ts — point youtube to official channel**

Replace the `youtube` field in `data/site.ts`:

```ts
export const site = {
  name: 'WWM Guide',
  nameFull: '燕雲十六聲 資訊站',
  tagline: '燕雲十六聲資訊、官方新聞、社群討論整合資訊站。',
  description: '燕雲十六聲（Where Winds Meet）官方消息、攻略、社群討論整合資訊站。',
  url: 'https://wwm-guide.vercel.app',
  youtube: 'https://www.youtube.com/@WhereWindsMeetHMT',
  facebook: 'https://www.facebook.com/WhereWindsMeetHMT/',
  bahamutBsn: '75703',
  ogImage: '/og-image.png',
} as const
```

- [ ] **Step 3: Delete the youtube page**

```bash
rm app/youtube/page.tsx
```

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

Expected: no errors. `/youtube` no longer appears in the route list.

- [ ] **Step 5: Commit and push**

```bash
git add components/Navbar.tsx data/site.ts
git rm app/youtube/page.tsx
git commit -m "feat: remove YouTube page, update Navbar and site metadata"
git push
```
