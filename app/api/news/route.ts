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
// NOTE: Verify this URL by inspecting XHR requests on https://yw.xd.com/news
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
  { revalidate: 900 }
)

export async function GET() {
  const news = await fetchNews()
  return NextResponse.json(news)
}
