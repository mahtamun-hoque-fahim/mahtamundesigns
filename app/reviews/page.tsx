import { getGlobalData, getReviews } from '@/lib/supabase/queries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ReviewsClient } from '@/components/reviews/ReviewsClient'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
  const [{ cms, mediaMap }, reviews] = await Promise.all([
    getGlobalData(),
    getReviews(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header cms={cms} />
      <main className="pt-24 pb-16">
        <ReviewsClient reviews={reviews} cms={cms} />
      </main>
      <Footer cms={cms} mediaMap={mediaMap} />
    </div>
  )
}
