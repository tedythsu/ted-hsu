import { HomeLayout } from '@/components/HomeLayout'
import { PageTransition } from '@/components/PageTransition'

export default function Home() {
  return (
    <PageTransition>
      <HomeLayout />
    </PageTransition>
  )
}
