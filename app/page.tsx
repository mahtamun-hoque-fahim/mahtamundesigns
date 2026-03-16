import { getGlobalData, getCompanies, getReviews, getLogoStrip } from '@/lib/supabase/queries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { LogoStrip } from '@/components/home/LogoStrip'
import { ServicesSection } from '@/components/home/ServicesSection'
import { SelectedWorks } from '@/components/home/SelectedWorks'
import { ProcessSection } from '@/components/home/ProcessSection'
import { ReviewsPreview } from '@/components/home/ReviewsPreview'
import { StatsSection } from '@/components/home/StatsSection'
import { MidPageCta } from '@/components/home/MidPageCta'
import { CtaSection } from '@/components/home/CtaSection'

export const revalidate = 60
export const dynamic = 'force-dynamic' // ISR: revalidate every 60s

export default async function HomePage() {
  const [{ cms, mediaMap }, companies, reviews, logoItems] = await Promise.all([
    getGlobalData(),
    getCompanies(),
    getReviews(),
    getLogoStrip(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header cms={cms} />
      <main>
        <Hero cms={cms} mediaMap={mediaMap} />
        <LogoStrip items={logoItems} cms={cms} />
        <ServicesSection cms={cms} />
        <SelectedWorks companies={companies} cms={cms} />
        <MidPageCta cms={cms} />
        <ProcessSection cms={cms} mediaMap={mediaMap} />
        <ReviewsPreview reviews={reviews} cms={cms} />
        <StatsSection cms={cms} />
        <CtaSection cms={cms} mediaMap={mediaMap} />
      </main>
      <Footer cms={cms} mediaMap={mediaMap} />
    </div>
  )
}
