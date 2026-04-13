'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { videos, type Video } from '@/data/videos'

function VideoFacade({ video, onPlay }: { video: Video; onPlay: () => void }) {
  return (
    <button
      onClick={onPlay}
      aria-label="play"
      className="relative w-full aspect-video rounded-xl overflow-hidden group"
    >
      <Image
        src={video.thumbnail}
        alt={video.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <Play className="w-6 h-6 text-white fill-white ml-1" />
        </div>
      </div>
    </button>
  )
}

function VideoPlayer({ video }: { video: Video }) {
  return (
    <iframe
      title="YouTube player"
      className="w-full aspect-video rounded-xl"
      src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
      allow="autoplay; encrypted-media; fullscreen"
      allowFullScreen
    />
  )
}

export function YouTubeSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const activeVideo = videos[activeIndex]

  const go = (dir: -1 | 1) => {
    const next = activeIndex + dir
    if (next < 0 || next >= videos.length) return
    setActiveIndex(next)
    setPlaying(false)
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 max-w-5xl mx-auto">
      <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-6">
        YouTube
      </p>

      <div className="w-full mb-6">
        {playing ? (
          <VideoPlayer video={activeVideo} />
        ) : (
          <VideoFacade video={activeVideo} onPlay={() => setPlaying(true)} />
        )}
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-white">{activeVideo.title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            disabled={activeIndex === 0}
            aria-label="previous"
            className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-zinc-600 w-12 text-center tabular-nums">
            {activeIndex + 1} / {videos.length}
          </span>
          <button
            onClick={() => go(1)}
            disabled={activeIndex === videos.length - 1}
            aria-label="next"
            className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thumbnail rail */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {videos.map((video, i) => (
          <button
            key={video.id}
            onClick={() => { setActiveIndex(i); setPlaying(false) }}
            className={`relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              i === activeIndex
                ? 'border-white/60'
                : 'border-transparent opacity-50 hover:opacity-75'
            }`}
          >
            <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
