export const profile = {
  name: 'Ted Hsu',
  tagline: 'Frontend Engineer · YouTube Creator',
  bio: 'Self-taught frontend engineer specializing in Angular & TypeScript. Currently building financial industry systems at NEUTEC. Also a YouTube creator covering gaming content.',
  skills: ['Angular', 'TypeScript', 'RxJS', 'Next.js', 'AI Tools'],
  primarySkill: 'Angular' as const,
  resumeUrl: '/resume.pdf',
  socials: {
    github: 'https://github.com/tedythsu/',
    youtube: 'https://www.youtube.com/@TedHsu-v6s',
    linkedin: 'https://www.linkedin.com/in/ted-hsu-b28211200',
  },
  seo: {
    description: 'Frontend Engineer specializing in Angular & TypeScript. Currently at NEUTEC. YouTube creator covering gaming content.',
    ogImage: '/og-image.png',
  },
} as const
