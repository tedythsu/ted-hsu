'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Code2, Play, Download, ArrowUpRight, Briefcase } from 'lucide-react'
import { profile } from '@/data/profile'
import { videos } from '@/data/videos'
import { projects } from '@/data/projects'

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

export function HomeLayout() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col px-8 md:px-16 pt-20 pb-8">

        {/* Label */}
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[11px] tracking-[0.22em] uppercase text-zinc-600"
        >
          Frontend Engineer
        </motion.p>

        {/* Name — anchored to middle of viewport */}
        <div className="flex-1 flex items-center py-8">
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-[family-name:var(--font-dm-serif)] italic text-white leading-[0.9] tracking-tight select-none"
            style={{ fontSize: 'clamp(72px, 13vw, 192px)' }}
          >
            Ted Hsu
          </motion.h1>
        </div>

        {/* Bio */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-sm text-zinc-500 max-w-xs leading-relaxed mb-8"
        >
          {profile.bio}
        </motion.p>

        {/* Bottom bar: skills + links */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="border-t border-zinc-800/50 pt-5 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-5 flex-wrap">
            {profile.skills.map((skill, i) => (
              <span
                key={skill}
                className={`text-xs transition-colors ${
                  skill === profile.primarySkill ? 'text-zinc-300' : 'text-zinc-700'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href={profile.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              YouTube
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              LinkedIn
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Resume
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── YouTube ── */}
      <section className="px-8 md:px-16 py-16 border-t border-zinc-800/40">
        <div className="flex items-baseline justify-between mb-10">
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] text-zinc-700 font-mono">01</span>
            <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-600">YouTube</span>
          </div>
          <Link
            href="/youtube"
            className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
          >
            All videos <ArrowUpRight className="w-3 h-3" />
          </Link>
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

      {/* ── Projects ── */}
      <section className="px-8 md:px-16 py-16 border-t border-zinc-800/40">
        <div className="flex items-baseline justify-between mb-10">
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] text-zinc-700 font-mono">02</span>
            <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-600">WebApps</span>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
          >
            All projects <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div>
          {projects.map((project) => (
            <Link key={project.name} href="/projects">
              <div className="group flex items-center justify-between py-5 border-b border-zinc-800/40 hover:border-zinc-700/50 transition-colors">
                <div>
                  <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors mb-1">
                    {project.name}
                  </p>
                  {project.description && (
                    <p className="text-xs text-zinc-700 group-hover:text-zinc-600 transition-colors mb-2 max-w-sm leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  <div className="flex gap-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-zinc-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-800 group-hover:text-zinc-500 transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
