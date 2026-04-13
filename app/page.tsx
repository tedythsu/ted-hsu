import { BentoGrid } from '@/components/BentoGrid'
import { ResumeTimeline } from '@/components/ResumeTimeline'
import { PageTransition } from '@/components/PageTransition'

export default function Home() {
  return (
    <PageTransition>
      <BentoGrid />
      <ResumeTimeline />
    </PageTransition>
  )
}
