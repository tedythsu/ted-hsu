import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { unstable_cache } from 'next/cache'

export interface BahaPost {
  title: string
  link: string
  author: string
  pubDate: string
  description: string
}

const fetchBahamutPosts = unstable_cache(
  async (): Promise<BahaPost[]> => {
    const res = await fetch('https://forum.gamer.com.tw/rss.php?bsn=75703', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WWMGuide/1.0)' },
    })
    if (!res.ok) return []

    const xml = await res.text()
    const parser = new XMLParser({ ignoreAttributes: false })
    const parsed = parser.parse(xml)

    const items = parsed?.rss?.channel?.item ?? []
    const arr = Array.isArray(items) ? items : [items]

    return arr.slice(0, 20).map((item: Record<string, string>) => ({
      title: String(item.title ?? '').trim(),
      link: String(item.link ?? '').trim(),
      author: String(item['dc:creator'] ?? item.author ?? '').trim(),
      pubDate: String(item.pubDate ?? '').trim(),
      description: String(item.description ?? '')
        .replace(/<[^>]+>/g, '')
        .trim()
        .slice(0, 100),
    }))
  },
  ['bahamut-posts'],
  { revalidate: 300 } // refresh every 5 minutes
)

export async function GET() {
  const posts = await fetchBahamutPosts()
  return NextResponse.json(posts)
}
