export interface Project {
  name: string
  url: string
  github: string
  tags: string[]
  screenshot: string
}

// Replace with real deployed URLs, GitHub links, and screenshots in public/screenshots/
export const projects: Project[] = [
  {
    name: 'Atmos: Live Like a Pro',
    url: 'https://tedythsu.github.io/atmos',
    github: 'https://github.com/tedythsu/atmos',
    tags: ['Angular', 'TypeScript', 'AI'],
    screenshot: '/screenshots/atmos.png',
  },
]
