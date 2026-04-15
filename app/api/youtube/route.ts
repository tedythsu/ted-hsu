// app/api/youtube/route.ts
import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'

export interface YTVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
}

// Channel ID for @WhereWindsMeetHMT (official 燕雲十六聲 channel)
const CHANNEL_ID = 'UCIg76vZz1n2iITdQARIxxsQ'

async function fetchYTVideos(): Promise<YTVideo[]> {
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
  } catch {
    return []
  }
}

export async function GET() {
  const videos = await fetchYTVideos()
  return NextResponse.json(videos)
}
