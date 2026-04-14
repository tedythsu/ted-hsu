'use client'

import { useEffect, useState } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { ArrowUpRight } from 'lucide-react'

const GITHUB_USERNAME = 'tedythsu'

const calendarTheme = {
  dark: ['#18181b', '#3f3f46', '#52525b', '#a1a1aa', '#e4e4e7'],
}

interface GitHubStats {
  public_repos: number
  followers: number
  following: number
}

export function GitHubSection() {
  const [stats, setStats] = useState<GitHubStats | null>(null)

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
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

  return (
    <section className="px-8 md:px-16 py-16 border-t border-zinc-800/40">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-10">
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] text-zinc-700 font-mono">04</span>
          <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-600">GitHub</span>
        </div>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
        >
          {GITHUB_USERNAME} <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Contribution Calendar */}
      <div className="overflow-x-auto">
        <GitHubCalendar
          username={GITHUB_USERNAME}
          colorScheme="dark"
          theme={calendarTheme}
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
