const timeline = [
  {
    role: 'Frontend Engineer',
    company: 'NEUTEC',
    period: '2024 — Present',
    description:
      'Frontend development for financial industry systems using Angular. Collaborate with designers and backend engineers to deliver UI/UX features, integrate APIs, and maintain page performance.',
    tags: ['Angular', 'TypeScript', 'RxJS'],
  },
  {
    role: 'Frontend Engineer',
    company: '三竹資訊 (Mitake)',
    period: '2023 — 2024',
    description:
      'Responsible for mobile web and RWD projects. Implemented features from design blueprints, integrated backend APIs, and wrote unit tests using Jasmine.',
    tags: ['Angular', 'RxJS', 'TypeScript', 'Jasmine'],
  },
  {
    role: 'Software Engineer',
    company: 'Wistron ITS (WITS)',
    period: '2022 — 2023',
    description:
      'Led frontend development for internal system renovation projects using Angular. Supported backend API development in C# and coordinated with product owners and UI/UX designers.',
    tags: ['Angular', 'TypeScript', 'C#'],
  },
  {
    role: 'IT Specialist',
    company: 'Dimerco Express Group',
    period: '2021 — 2022',
    description:
      'Built internal web tools with PHP for data access and reporting. Developed VBS scripts and RPA workflows to automate SAP operations and reduce repetitive tasks.',
    tags: ['PHP', 'VBS', 'RPA', 'SAP'],
  },
]

export function ResumeTimeline() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-10">
        Experience
      </p>
      <div className="relative">
        <div className="absolute left-0 top-2 bottom-0 w-px bg-zinc-800" />
        <div className="space-y-10 pl-8">
          {timeline.map((entry, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[33px] top-1.5 w-2 h-2 rounded-full bg-zinc-600 border-2 border-zinc-950" />
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-white font-medium text-sm">{entry.role}</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">{entry.company}</p>
                </div>
                <span className="text-xs text-zinc-600 font-mono shrink-0">{entry.period}</span>
              </div>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{entry.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {entry.tags.map((tag) => (
                  <span key={tag} className="text-xs text-zinc-500 border border-zinc-800 rounded px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
