import { notFound } from 'next/navigation'
import { getGlobalData, getCompanyBySlug, getProjectData, getCompanySlugsForStaticGeneration } from '@/lib/supabase/queries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CompanyShowcaseClient } from '@/components/clients/CompanyShowcaseClient'

export const revalidate = 60
export const dynamicParams = true // allow params not in generateStaticParams

export async function generateStaticParams() {
  try {
    // Only runs when NEXT_PUBLIC_SUPABASE_URL is set (Vercel build, not local preview)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
    const slugs = await getCompanySlugsForStaticGeneration()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const [{ cms, mediaMap }, company] = await Promise.all([
    getGlobalData(),
    getCompanyBySlug(params.slug),
  ])

  if (!company) notFound()

  const { groups, ungroupedImages } = await getProjectData(company.id)

  return (
    <div className="min-h-screen bg-background">
      <Header cms={cms} />
      <main>
        <CompanyShowcaseClient
          company={company}
          groups={groups}
          ungroupedImages={ungroupedImages}
          cms={cms}
        />
      </main>
      <Footer cms={cms} mediaMap={mediaMap} />
    </div>
  )
}
