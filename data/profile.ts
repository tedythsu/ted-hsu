export const profile = {
  name: 'Ted Hsu',
  tagline: 'Frontend Engineer · YouTube Creator',
  bio: 'Frontend engineer with expertise in Angular & TypeScript. I build production web apps and share gaming content on YouTube.',
  skills: ['Angular', 'TypeScript', 'AI Tools', 'Next.js', 'RxJS'],
  primarySkill: 'Angular' as const,
  resumeUrl: '/resume.pdf',
  socials: {
    github: 'https://github.com/tedythsu/',
    youtube: 'https://www.youtube.com/@TedHsu-v6s',
  },
  seo: {
    description: 'Frontend Engineer specializing in Angular & TypeScript. YouTube creator covering gaming & dev.',
    ogImage: '/og-image.png',
  },
} as const
