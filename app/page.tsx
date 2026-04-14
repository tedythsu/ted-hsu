import { HomeLayout } from '@/components/HomeLayout'
import { ResumeTimeline } from '@/components/ResumeTimeline'
import { PageTransition } from '@/components/PageTransition'

export default function Home() {
  return (
    <PageTransition>
      <HomeLayout />
      <ResumeTimeline />
    </PageTransition>
  )
}
