import Link from 'next/link'
import { guides } from '@/data/guides'
import { PageTransition } from '@/components/PageTransition'

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
        <p className="text-[11px] tracking-[0.22em] uppercase text-zinc-600 mb-4">攻略指南</p>
        <h1 className="font-[family-name:var(--font-dm-serif)] italic text-white text-5xl md:text-7xl leading-none mb-16">
          Guides
        </h1>

        {categories.map((cat) => (
          <div key={cat} className="mb-14">
            <p className={`text-[10px] tracking-widest uppercase mb-6 ${categoryColor[cat] ?? 'text-zinc-600'}`}>
              {cat}
            </p>
            <div>
              {guides.filter((g) => g.category === cat).map((guide) => (
                <Link
                  key={guide.url}
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-5 border-b border-zinc-800/40 transition-colors hover:border-zinc-700/50"
                >
                  <div>
                    <p className="text-sm mb-1 transition-colors text-zinc-400 group-hover:text-zinc-200">
                      {guide.title}
                    </p>
                    <p className="text-xs text-zinc-700 leading-relaxed max-w-lg">{guide.summary}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-[10px] text-zinc-700 bg-zinc-900/50 rounded px-2 py-0.5">
                      {guide.source}
                    </span>
                    <span className="text-xs text-zinc-800">{guide.updatedAt}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  )
}
