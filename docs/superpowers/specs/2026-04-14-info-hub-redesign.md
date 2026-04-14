# WWM Info Hub Redesign

**Goal:** Pivot the site from a guide-authoring site to an information aggregation hub for 燕雲十六聲 (Where Winds Meet).

**Architecture:** Adjust existing pages and components in-place. Add two new API routes (official YouTube RSS, 陸服 news). Restructure SiteHome layout. Repurpose guides data to curated external links.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, fast-xml-parser, framer-motion (existing)

---

## Pages & Navigation

**Navbar:** Remove "YouTube" link. Keep: 首頁 / 攻略 / 社群

**Remove:** `app/youtube/page.tsx` (delete the page and its Navbar entry)

---

## Home Page (`components/SiteHome.tsx`)

New three-section layout:

### Section 01 — 官方最新消息
Full-width row at the top. Fetches from `/api/news` (陸服 official feed). Shows 4–6 headline items with title + date. Falls back gracefully if unavailable.

### Section 02 — 官方 YouTube 最新影片 + 巴哈即時討論 (2-col grid)
- Left (2/3): Official channel latest videos from `/api/youtube`. Shows 4 thumbnails in a 2×2 grid. Links open YouTube in new tab.
- Right (1/3): Existing Bahamut feed from `/api/bahamut` (unchanged).

Remove the old guides list from home entirely. Keep masthead strip and category strip (adapt category strip to point to news/community sections instead of guide categories).

---

## Guides Page (`app/guides/page.tsx` + `data/guides.ts`)

Change concept: no longer user-authored guides, instead a curated list of external links (Bahamut articles, community posts).

**`data/guides.ts` interface change:**
```ts
export interface Guide {
  title: string
  url: string           // external link (Bahamut article, etc.)
  category: '新手入門' | '角色' | '副本' | '系統' | '進階'
  summary: string
  source: string        // e.g. '巴哈', '官網', 'YouTube'
  updatedAt: string
}
```
Remove `slug`, `ready` fields. Add `url` and `source`.

Seed with 3–5 placeholder entries (real Bahamut article URLs if known, otherwise example structure).

**`app/guides/page.tsx`:** Links open in new tab (`target="_blank"`). Remove "準備中" badge logic. Add "前往巴哈板塊" external link at top.

---

## New API: Official YouTube RSS (`app/api/youtube/route.ts`)

YouTube provides a public RSS feed for channels:
`https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`

Steps:
1. Fetch channel ID for `@WhereWindsMeetHMT` by requesting `https://www.youtube.com/@WhereWindsMeetHMT` and extracting `channelId` from the HTML (one-time on server, cached long-term).
2. Fetch RSS feed, parse with fast-xml-parser.
3. Return array of `{ id, title, thumbnail, publishedAt, url }`.
4. Cache 30 minutes with `unstable_cache`.

**Fallback:** If channel ID fetch fails, return empty array; home page shows a "暫時無法載入" state.

---

## New API: 陸服 News (`app/api/news/route.ts`)

Try sources in priority order — use the first one that returns data:

1. **官方網站公告** — `https://yw.xd.com/news` or similar path (scrape RSS/sitemap if available)
2. **Bilibili** — Official channel RSS: `https://api.bilibili.com/x/space/arc/search?mid=MID&ps=10`
3. **Weibo** — Official account RSS via a public Weibo RSS proxy

Cache 15 minutes. Return `{ title, url, pubDate, source }[]`.

**Note:** These sources may require trial and error. If none yield reliable data, the section is hidden and documented for future integration.

---

## Files Changed

| File | Action |
|------|--------|
| `components/Navbar.tsx` | Remove YouTube link |
| `app/youtube/page.tsx` | Delete |
| `components/SiteHome.tsx` | Restructure layout (news top, YT+baha grid) |
| `data/guides.ts` | Change interface + seed curated links |
| `app/guides/page.tsx` | Open links externally, remove ready/slug logic |
| `app/api/youtube/route.ts` | New — official YT RSS |
| `app/api/news/route.ts` | New — 陸服 news aggregation |
