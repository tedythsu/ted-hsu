import { Suspense } from 'react'
import { ProjectFlip } from '@/components/ProjectFlip'
import { PageTransition } from '@/components/PageTransition'

export default function ProjectsPage() {
  return (
    <PageTransition>
      <Suspense>
        <ProjectFlip />
      </Suspense>
    </PageTransition>
  )
}
