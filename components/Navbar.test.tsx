import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('Ted Hsu')).toBeInTheDocument()
  })

  it('renders all three navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('YouTube')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('applies active style to the current path link', () => {
    render(<Navbar />)
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveClass('text-white')
  })

  it('applies muted style to inactive links', () => {
    render(<Navbar />)
    const youtubeLink = screen.getByText('YouTube').closest('a')
    expect(youtubeLink).toHaveClass('text-zinc-500')
  })
})
