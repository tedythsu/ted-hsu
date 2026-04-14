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
  { revalidate: 1800 }
)

export async function GET() {
  const videos = await fetchYTVideos()
  return NextResponse.json(videos)
}
