// app/guides/page.tsx
import { guides } from '@/data/guides'
import { PageTransition } from '@/components/PageTransition'
import { ArrowUpRight } from 'lucide-react'

const categoryColor: Record<string, string> = {
  '新手入門': 'text-amber-600',
  '角色': 'text-sky-600',
  '副本': 'text-rose-600',
  '系統': 'text-emerald-600',
  '進階': 'text-purple-600',
}

export default function GuidesPage() {
  const categories = [...new Set(guides.map((g) => g.category))]

  return (
    <PageTransition>
      <div className="px-8 md:px-16 pt-24 pb-20">
        <p className="text-[11px] tracking-[0.22em] uppercase text-zinc-600 mb-4">精選攻略</p>
        <h1 className="font-[family-name:var(--font-dm-serif)] italic text-white text-5xl md:text-7xl leading-none mb-4">
          Guides
        </h1>
        <a
          href="https://forum.gamer.com.tw/B.php?bsn=75703"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-16"
        >
          前往巴哈姆特板塊 <ArrowUpRight className="w-3 h-3" />
        </a>

        {categories.map((cat) => (
          <div key={cat} className="mb-14">
            <p className={`text-[10px] tracking-widest uppercase mb-6 ${categoryColor[cat] ?? 'text-zinc-600'}`}>
              {cat}
            </p>
            <div>
              {guides.filter((g) => g.category === cat).map((guide) => (
                <a
                  key={guide.title}
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-5 border-b border-zinc-800/40 hover:border-zinc-700/50 transition-colors"
                >
                  <div>
                    <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors mb-1">
                      {guide.title}
                    </p>
                    <p className="text-xs text-zinc-700 leading-relaxed max-w-lg">{guide.summary}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-[10px] text-zinc-700 border border-zinc-800 rounded px-2 py-0.5">
                      {guide.source}
                    </span>
                    <span className="text-xs text-zinc-800">{guide.updatedAt}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  )
}
