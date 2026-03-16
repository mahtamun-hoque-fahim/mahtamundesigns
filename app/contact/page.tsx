import { getGlobalData, getLogoStrip } from '@/lib/supabase/queries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactPageClient } from '@/components/contact/ContactPageClient'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const [{ cms, mediaMap }, logoItems] = await Promise.all([
    getGlobalData(),
    getLogoStrip(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header cms={cms} />
      <main>
        <ContactPageClient logoItems={logoItems} cms={cms} />
      </main>
      <Footer cms={cms} mediaMap={mediaMap} />
    </div>
  )
}
