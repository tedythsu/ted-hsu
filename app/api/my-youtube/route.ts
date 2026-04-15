import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import type { YTVideo } from '@/app/api/youtube/route'

// Channel ID for @TedHsu-v6s (personal channel)
const CHANNEL_ID = 'UCERpZtzSBEfkQDQx5e8QbxA'

async function fetchMyVideos(): Promise<YTVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WWMGuide/1.0)' },
        next: { revalidate: 1800 },
      }
    )
    if (!res.ok) return []

    const xml = await res.text()
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
    const parsed = parser.parse(xml)

    const entries = parsed?.feed?.entry ?? []
    const arr = Array.isArray(entries) ? entries : [entries]

    return arr.slice(0, 4).map((entry: Record<string, unknown>) => {
      const id = String(entry['yt:videoId'] ?? '').trim()
      return {
        id,
        title: String(entry.title ?? '').trim(),
        thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        publishedAt: String(entry.published ?? '').trim(),
        url: `https://www.youtube.com/watch?v=${id}`,
      }
    })
  } catch {
    return []
  }
}

export async function GET() {
  const videos = await fetchMyVideos()
  return NextResponse.json(videos)
}
