import Link from 'next/link'
import Image from 'next/image'
import { Code2, Play, Download } from 'lucide-react'
import { profile } from '@/data/profile'
import { videos } from '@/data/videos'
import { projects } from '@/data/projects'

function BentoCell({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 transition-all duration-300 hover:border-zinc-600 hover:shadow-[0_0_12px_rgba(255,255,255,0.04)] ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

export function BentoGrid() {
  const featuredVideo = videos[0]
  const featuredProject = projects[0]

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3 min-h-[calc(100vh-56px)] p-4 pt-[70px]">
      {/* Identity — 2 cols × 2 rows */}
      <BentoCell className="col-span-2 row-span-2 flex flex-col justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-3">
            Frontend Engineer
          </p>
          <h1 className="text-5xl font-bold text-white tracking-tight leading-none mb-3">
            Ted Hsu
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            {profile.tagline}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <Code2 className="w-4 h-4" />
            GitHub
          </a>
          <a
            href={profile.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <Play className="w-4 h-4" />
            YouTube
          </a>
          <a
            href={profile.resumeUrl}
            download
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors ml-auto"
          >
            <Download className="w-4 h-4" />
            Resume
          </a>
        </div>
      </BentoCell>

      {/* YouTube preview — 2 cols × 1 row */}
      <Link href="/youtube" className="col-span-2 row-span-1">
        <BentoCell className="h-full relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <Image
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              fill
              className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
            />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
              YouTube
            </p>
            <div>
              <p className="text-white text-sm font-medium line-clamp-2">
                {featuredVideo.title}
              </p>
              <p className="text-zinc-500 text-xs mt-1">Watch →</p>
            </div>
          </div>
        </BentoCell>
      </Link>

      {/* Projects preview — 2 cols × 1 row */}
      <Link href="/projects" className="col-span-2 row-span-1">
        <BentoCell className="h-full relative overflow-hidden group cursor-pointer">
          {featuredProject.screenshot && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src={featuredProject.screenshot}
                alt={featuredProject.name}
                fill
                className="object-cover opacity-25 group-hover:opacity-45 transition-opacity duration-300"
              />
            </div>
          )}
          <div className="relative z-10 flex flex-col h-full justify-between">
            <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
              WebApps
            </p>
            <div>
              <p className="text-white text-sm font-medium">{featuredProject.name}</p>
              <div className="flex gap-1 mt-1.5">
                {featuredProject.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-zinc-500 bg-zinc-800 rounded px-1.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </BentoCell>
      </Link>

      {/* Skills — 2 cols × 1 row */}
      <BentoCell className="col-span-2 row-span-1">
        <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-3">
          Skills
        </p>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                skill === profile.primarySkill
                  ? 'border-zinc-400 text-zinc-200 bg-zinc-800'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </BentoCell>

      {/* Bio + Resume CTA — 2 cols × 1 row */}
      <BentoCell className="col-span-2 row-span-1 flex flex-col justify-between">
        <p className="text-sm text-zinc-400 leading-relaxed">{profile.bio}</p>
        <a
          href={profile.resumeUrl}
          download
          className="inline-flex items-center gap-2 text-xs text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2 w-fit transition-colors"
        >
          <Download className="w-3 h-3" />
          Download Resume
        </a>
      </BentoCell>
    </div>
  )
}
