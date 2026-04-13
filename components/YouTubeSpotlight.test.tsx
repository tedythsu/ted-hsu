import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { YouTubeSpotlight } from './YouTubeSpotlight'

vi.mock('@/data/videos', () => ({
  videos: [
    { id: 'abc123', title: 'First Video', thumbnail: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg' },
    { id: 'def456', title: 'Second Video', thumbnail: 'https://img.youtube.com/vi/def456/maxresdefault.jpg' },
  ],
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

describe('YouTubeSpotlight', () => {
  it('shows play button initially, not iframe', () => {
    render(<YouTubeSpotlight />)
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    expect(screen.queryByTitle('YouTube player')).not.toBeInTheDocument()
  })

  it('loads iframe when play button is clicked', () => {
    render(<YouTubeSpotlight />)
    fireEvent.click(screen.getByRole('button', { name: /play/i }))
    expect(screen.getByTitle('YouTube player')).toBeInTheDocument()
  })

  it('shows the first video title initially', () => {
    render(<YouTubeSpotlight />)
    expect(screen.getByText('First Video')).toBeInTheDocument()
  })

  it('switches to next video on next button click and resets to facade', () => {
    render(<YouTubeSpotlight />)
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('Second Video')).toBeInTheDocument()
    expect(screen.queryByTitle('YouTube player')).not.toBeInTheDocument()
  })
})
