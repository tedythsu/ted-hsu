'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Code2 } from 'lucide-react'
import { projects } from '@/data/projects'

export function ProjectFlip() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const go = (dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= projects.length) return
    setDirection(dir)
    setIndex(next)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [index]) // re-registers on index change so go() has fresh index

  const project = projects[index]

  return (
    <div className="fixed inset-0 flex flex-col" style={{ top: '56px' }}>
      {/* Fake browser chrome bar */}
      <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-3 z-10 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
        </div>
        <div className="flex-1 mx-2 bg-zinc-800 rounded text-xs text-zinc-500 px-3 py-1 text-center truncate">
          {project.url}
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <Code2 className="w-4 h-4" />
        </a>
      </div>

      {/* Project name + tags overlay */}
      <div className="absolute top-[66px] left-4 z-20 pointer-events-none">
        <h2 className="text-white font-semibold text-sm bg-zinc-950/70 backdrop-blur-sm px-2 py-1 rounded">
          {project.name}
        </h2>
        <div className="flex gap-1 mt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-zinc-400 bg-zinc-950/70 backdrop-blur-sm border border-zinc-800 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Animated iframe */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.iframe
            key={project.url}
            src={project.url}
            title={project.name}
            className="absolute inset-0 w-full h-full border-0"
            initial={{ x: `${direction * 100}%`, opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: `${direction * -100}%`, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          />
        </AnimatePresence>
      </div>

      {/* Left arrow */}
      <button
        onClick={() => go(-1)}
        disabled={index === 0}
        aria-label="Previous project"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => go(1)}
        disabled={index === projects.length - 1}
        aria-label="Next project"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Page indicator dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
            aria-label={`Go to project ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
