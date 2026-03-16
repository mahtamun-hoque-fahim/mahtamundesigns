import { getGlobalData, getCompanies } from '@/lib/supabase/queries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ClientsGrid } from '@/components/clients/ClientsGrid'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const [{ cms, mediaMap }, companies] = await Promise.all([
    getGlobalData(),
    getCompanies(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header cms={cms} />
      <main className="pt-24 pb-16">
        <ClientsGrid companies={companies} cms={cms} />
      </main>
      <Footer cms={cms} mediaMap={mediaMap} />
    </div>
  )
}
