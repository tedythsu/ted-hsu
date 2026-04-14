'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import type { Activity } from 'react-github-calendar'
import { ArrowUpRight } from 'lucide-react'

const PRIMARY = 'tedythsu'
const SECONDARY = 'tedhsuneutec'
const CONTRIB_API = 'https://github-contributions-api.jogruber.de/v4'

const calendarTheme = {
  dark: ['#18181b', '#3f3f46', '#52525b', '#a1a1aa', '#e4e4e7'],
}

interface GitHubStats {
  public_repos: number
  followers: number
  following: number
}

function calcLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= max * 0.25) return 1
  if (count <= max * 0.5) return 2
  if (count <= max * 0.75) return 3
  return 4
}

export function GitHubSection() {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  // Store secondary account's contributions in a ref so transformData always has fresh data
  const secondaryRef = useRef<Map<string, number>>(new Map())
  const [secondaryReady, setSecondaryReady] = useState(false)

  // Fetch personal GitHub stats
  useEffect(() => {
    fetch(`https://api.github.com/users/${PRIMARY}`)
      .then((r) => r.json())
      .then((data) => {
        setStats({
          public_repos: data.public_repos,
          followers: data.followers,
          following: data.following,
        })
      })
      .catch(() => {})
  }, [])

  // Fetch secondary account contributions
  useEffect(() => {
    fetch(`${CONTRIB_API}/${SECONDARY}?y=last`)
      .then((r) => r.json())
      .then((data: { contributions: Activity[] }) => {
        const map = new Map<string, number>()
        data.contributions.forEach((a) => {
          if (a.count > 0) map.set(a.date, a.count)
        })
        secondaryRef.current = map
        setSecondaryReady(true)
      })
      .catch(() => setSecondaryReady(true)) // still render even if secondary fails
  }, [])

  // Merge primary + secondary contributions and recalculate levels
  const mergeData = useCallback(
    (primary: Activity[]): Activity[] => {
      const secondary = secondaryRef.current
      if (secondary.size === 0) return primary

      const merged = primary.map((a) => ({
        ...a,
        count: a.count + (secondary.get(a.date) ?? 0),
      }))

      const max = Math.max(...merged.map((a) => a.count), 1)

      return merged.map((a) => ({
        ...a,
        level: calcLevel(a.count, max),
      }))
    },
    // re-create when secondary data arrives so the calendar re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [secondaryReady]
  )

  return (
    <section className="px-8 md:px-16 py-16 border-t border-zinc-800/40">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-10">
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] text-zinc-700 font-mono">04</span>
          <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-600">GitHub</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`https://github.com/${PRIMARY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
          >
            {PRIMARY} <ArrowUpRight className="w-3 h-3" />
          </a>
          <span className="text-zinc-800 text-xs">+</span>
          <a
            href={`https://github.com/${SECONDARY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
          >
            {SECONDARY} <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Contribution Calendar — renders once secondary data is ready */}
      <div className="overflow-x-auto">
        <GitHubCalendar
          username={PRIMARY}
          colorScheme="dark"
          theme={calendarTheme}
          transformData={mergeData}
          blockSize={11}
          blockMargin={3}
          fontSize={11}
          showTotalCount={false}
          showColorLegend={false}
          style={{ color: '#52525b', fontFamily: 'inherit' }}
        />
      </div>

      {/* Stats */}
      {stats && (
        <div className="flex items-center gap-6 mt-8">
          <div>
            <p className="text-lg text-zinc-300 font-light tabular-nums">{stats.public_repos}</p>
            <p className="text-[11px] text-zinc-700 mt-0.5">repositories</p>
          </div>
          <div className="w-px h-6 bg-zinc-800" />
          <div>
            <p className="text-lg text-zinc-300 font-light tabular-nums">{stats.followers}</p>
            <p className="text-[11px] text-zinc-700 mt-0.5">followers</p>
          </div>
          <div className="w-px h-6 bg-zinc-800" />
          <div>
            <p className="text-lg text-zinc-300 font-light tabular-nums">{stats.following}</p>
            <p className="text-[11px] text-zinc-700 mt-0.5">following</p>
          </div>
        </div>
      )}
    </section>
  )
}
