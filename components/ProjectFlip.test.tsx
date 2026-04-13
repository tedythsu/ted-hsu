import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectFlip } from './ProjectFlip'

vi.mock('@/data/projects', () => ({
  projects: [
    { name: 'App One', url: 'https://one.example.com', github: 'https://github.com/x/one', tags: ['React'], screenshot: '' },
    { name: 'App Two', url: 'https://two.example.com', github: 'https://github.com/x/two', tags: ['Angular'], screenshot: '' },
    { name: 'App Three', url: 'https://three.example.com', github: 'https://github.com/x/three', tags: ['TS'], screenshot: '' },
  ],
}))

vi.mock('framer-motion', () => ({
  motion: {
    iframe: ({ title, src, className }: { title: string; src: string; className: string }) => (
      <iframe title={title} src={src} className={className} />
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('ProjectFlip', () => {
  it('shows the first project name initially', () => {
    render(<ProjectFlip />)
    expect(screen.getByText('App One')).toBeInTheDocument()
  })

  it('navigates to next project on ArrowRight keypress', () => {
    render(<ProjectFlip />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('App Two')).toBeInTheDocument()
  })

  it('navigates to previous project on ArrowLeft keypress', () => {
    render(<ProjectFlip />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('App One')).toBeInTheDocument()
  })

  it('does not navigate past the last project', () => {
    render(<ProjectFlip />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('App Three')).toBeInTheDocument()
  })
})
