'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { site } from '@/data/site'
import { guides } from '@/data/guides'
import { videos } from '@/data/videos'
import type { BahaPost } from '@/app/api/bahamut/route'

const categoryColor: Record<string, string> = {
  '新手入門': 'text-amber-500',
  '角色':    'text-sky-400',
  '副本':    'text-rose-400',
  '系統':    'text-emerald-400',
  '進階':    'text-purple-400',
}

const categories = [...new Set(guides.map((g) => g.category))]

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
  const dateStr = useDateString()

  useEffect(() => {
    fetch('/api/bahamut')
      .then((r) => r.json())
      .then((data) => { setPosts(data); setPostsLoading(false) })
      .catch(() => setPostsLoading(false))
  }, [])

  return (
    <div className="pt-14"> {/* offset for fixed navbar */}

      {/* ── Masthead ── */}
      <div className="px-8 md:px-16 py-3 flex items-center justify-between border-b border-zinc-800/60">
        <span className="text-xs font-medium text-zinc-300 tracking-wide">WWM Guide</span>
        <span className="text-xs text-zinc-400 hidden md:block">燕雲十六聲 攻略資訊站</span>
        <span className="text-[11px] text-zinc-500 font-mono">{dateStr}</span>
      </div>

      {/* ── Category strip ── */}
      <div className="px-8 md:px-16 py-3 flex items-center gap-6 border-b border-zinc-800/40 overflow-x-auto">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest flex-shrink-0">攻略分類</span>
        {categories.map((cat) => (
          <Link
            key={cat}
            href="/guides"
            className={`text-xs flex-shrink-0 transition-colors hover:text-white ${categoryColor[cat] ?? 'text-zinc-400'}`}
          >
            {cat}
          </Link>
        ))}
        <Link href="/guides" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-auto flex-shrink-0 flex items-center gap-1">
          全部 <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ── Main two-column grid ── */}
      <div className="px-8 md:px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10">

        {/* Left: Guides (2/3) */}
        <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-zinc-800/40 pb-10 md:pb-0 md:pr-10">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="font-mono">01</span> 攻略指南
          </p>

          <div className="space-y-0">
            {guides.map((guide, i) => (
              <motion.div
                key={guide.slug}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Link
                  href={guide.ready ? `/guides/${guide.slug}` : '/guides'}
                  className="group flex gap-5 py-5 border-b border-zinc-800/30 hover:border-zinc-700/40 transition-colors"
                >
                  {/* Index number */}
                  <span className="text-[11px] text-zinc-600 font-mono w-5 flex-shrink-0 pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <p className={`text-sm transition-colors leading-snug ${guide.ready ? 'text-zinc-200 group-hover:text-white' : 'text-zinc-400'}`}>
                        {guide.title}
                      </p>
                      {!guide.ready && (
                        <span className="text-[10px] text-zinc-500 border border-zinc-700 rounded px-1.5 py-0.5 flex-shrink-0">
                          準備中
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{guide.summary}</p>
                    <p className={`text-[10px] mt-2 ${categoryColor[guide.category] ?? 'text-zinc-700'}`}>
                      {guide.category}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* YouTube — inside left col on desktop */}
          <div className="mt-12">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="font-mono">03</span> YouTube 影片
              <a
                href={site.youtube}
                target="_blank" rel="noopener noreferrer"
                className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 normal-case"
              >
                前往頻道 <ArrowUpRight className="w-3 h-3" />
              </a>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {videos.slice(0, 2).map((video) => (
                <Link key={video.id} href="/youtube" className="group">
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
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Bahamut (1/3) */}
        <div className="md:col-span-1 pt-10 md:pt-0">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="font-mono">02</span> 巴哈 即時討論
            <a
              href={`https://forum.gamer.com.tw/B.php?bsn=${site.bahamutBsn}`}
              target="_blank" rel="noopener noreferrer"
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
                target="_blank" rel="noopener noreferrer"
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
              target="_blank" rel="noopener noreferrer"
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
