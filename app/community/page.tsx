'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PageTransition } from '@/components/PageTransition'
import { site } from '@/data/site'
import type { BahaPost } from '@/app/api/bahamut/route'

export default function CommunityPage() {
  const [posts, setPosts] = useState<BahaPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bahamut')
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <div className="px-8 md:px-16 pt-24 pb-20">
        <p className="text-[11px] tracking-[0.22em] uppercase text-zinc-600 mb-4">社群討論</p>
        <h1 className="font-[family-name:var(--font-dm-serif)] italic text-white text-5xl md:text-7xl leading-none mb-16">
          Community
        </h1>

        {/* Bahamut */}
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-8">
            <div className="flex items-baseline gap-3">
              <span className="text-[10px] text-zinc-700 font-mono">01</span>
              <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-600">巴哈姆特哈啦板</span>
            </div>
            <a
              href={`https://forum.gamer.com.tw/B.php?bsn=${site.bahamutBsn}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
            >
              前往板塊 <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {loading && <p className="text-xs text-zinc-700">載入中…</p>}
          {!loading && posts.length === 0 && (
            <p className="text-xs text-zinc-700">暫時無法取得資料，請稍後再試。</p>
          )}
          {posts.map((post, i) => (
            <a
              key={i}
              href={post.link}
              target="_blank" rel="noopener noreferrer"
              className="group flex items-start justify-between py-4 border-b border-zinc-800/40 hover:border-zinc-700/50 transition-colors gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors mb-1 truncate">
                  {post.title}
                </p>
                {post.description && (
                  <p className="text-xs text-zinc-700 leading-relaxed line-clamp-1">{post.description}</p>
                )}
                <p className="text-xs text-zinc-800 mt-1">
                  {post.author && <span className="mr-3">{post.author}</span>}
                  {post.pubDate && <span>{new Date(post.pubDate).toLocaleDateString('zh-TW')}</span>}
                </p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-800 group-hover:text-zinc-500 transition-colors flex-shrink-0 mt-0.5" />
            </a>
          ))}
        </section>

        {/* Facebook */}
        <section>
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-[10px] text-zinc-700 font-mono">02</span>
            <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-600">官方 Facebook</span>
          </div>
          <div className="overflow-hidden">
            <iframe
              src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(site.facebook)}&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`}
              width="500"
              height="600"
              style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
