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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

const categoryColor: Record<string, string> = {
  '新手入門': 'text-amber-600',
  '角色': 'text-sky-600',
  '副本': 'text-rose-600',
  '系統': 'text-emerald-600',
  '進階': 'text-purple-600',
}

export function SiteHome() {
  const [posts, setPosts] = useState<BahaPost[]>([])

  useEffect(() => {
    fetch('/api/bahamut')
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col px-8 md:px-16 pt-20 pb-8">
        <motion.p
          custom={0} initial="hidden" animate="visible" variants={fadeUp}
          className="text-[11px] tracking-[0.22em] uppercase text-zinc-600"
        >
          Where Winds Meet · 燕雲十六聲
        </motion.p>

        <div className="flex-1 flex items-center py-8">
          <div>
            <motion.h1
              custom={1} initial="hidden" animate="visible" variants={fadeUp}
              className="font-[family-name:var(--font-dm-serif)] italic text-white leading-[0.9] tracking-tight"
              style={{ fontSize: 'clamp(64px, 12vw, 176px)' }}
            >
              WWM Guide
            </motion.h1>
            <motion.p
              custom={2} initial="hidden" animate="visible" variants={fadeUp}
              className="text-sm text-zinc-500 max-w-sm leading-relaxed mt-6"
            >
              {site.tagline}
            </motion.p>
          </div>
        </div>

        <motion.div
          custom={3} initial="hidden" animate="visible" variants={fadeUp}
          className="border-t border-zinc-800/50 pt-5 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-6">
            <Link href="/guides" className="text-xs text-zinc-400 hover:text-white transition-colors">
              攻略指南 →
            </Link>
            <Link href="/community" className="text-xs text-zinc-400 hover:text-white transition-colors">
              社群討論 →
            </Link>
            <Link href="/youtube" className="text-xs text-zinc-400 hover:text-white transition-colors">
              YouTube →
            </Link>
          </div>
          <a
            href={site.facebook}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            官方 Facebook <ArrowUpRight className="w-3 h-3" />
          </a>
        </motion.div>
      </section>

      {/* ── 攻略精選 ── */}
      <section className="px-8 md:px-16 py-16 border-t border-zinc-800/40">
        <div className="flex items-baseline justify-between mb-10">
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] text-zinc-700 font-mono">01</span>
            <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-600">攻略指南</span>
          </div>
          <Link href="/guides" className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors">
            全部攻略 <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800/40">
          {guides.slice(0, 3).map((guide) => (
            <Link
              key={guide.slug}
              href={guide.ready ? `/guides/${guide.slug}` : '/guides'}
              className="group bg-zinc-950 p-6 hover:bg-zinc-900/50 transition-colors"
            >
              <p className={`text-[10px] tracking-widest uppercase mb-3 ${categoryColor[guide.category] ?? 'text-zinc-600'}`}>
                {guide.category}
              </p>
              <p className="text-sm text-zinc-300 group-hover:text-white transition-colors mb-2 leading-snug">
                {guide.title}
              </p>
              <p className="text-xs text-zinc-700 leading-relaxed">{guide.summary}</p>
              {!guide.ready && (
                <p className="text-[10px] text-zinc-800 mt-3">內容準備中</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ── 巴哈討論 ── */}
      <section className="px-8 md:px-16 py-16 border-t border-zinc-800/40">
        <div className="flex items-baseline justify-between mb-10">
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] text-zinc-700 font-mono">02</span>
            <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-600">巴哈姆特 熱門討論</span>
          </div>
          <a
            href="https://forum.gamer.com.tw/B.php?bsn=75703"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
          >
            前往板塊 <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {posts.length === 0 ? (
          <p className="text-xs text-zinc-700">載入中…</p>
        ) : (
          <div>
            {posts.slice(0, 8).map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank" rel="noopener noreferrer"
                className="group flex items-start justify-between py-4 border-b border-zinc-800/40 hover:border-zinc-700/50 transition-colors gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-zinc-700 mt-1">
                    {post.author && <span className="mr-3">{post.author}</span>}
                    {post.pubDate && <span>{new Date(post.pubDate).toLocaleDateString('zh-TW')}</span>}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-800 group-hover:text-zinc-500 transition-colors flex-shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ── YouTube ── */}
      <section className="px-8 md:px-16 py-16 border-t border-zinc-800/40">
        <div className="flex items-baseline justify-between mb-10">
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] text-zinc-700 font-mono">03</span>
            <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-600">YouTube 影片</span>
          </div>
          <a
            href={site.youtube}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
          >
            前往頻道 <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {videos.slice(0, 2).map((video) => (
            <Link key={video.id} href="/youtube" className="group">
              <div className="relative aspect-video overflow-hidden mb-4 bg-zinc-900">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-[1.02] transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-300">
                    <Play className="w-3.5 h-3.5 text-white/70 ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">
                {video.title}
              </p>
              <p className="text-xs text-zinc-700 mt-1.5 group-hover:text-zinc-500 transition-colors">
                Watch →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
