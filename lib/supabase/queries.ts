import { cache } from 'react'
import { createServerSupabase, createBuildTimeSupabase } from './server'
import type { Company, Review, LogoStripItem, ProjectGroup, ProjectImage, CmsMap, MediaMap } from './query-types'

// Re-export types so server pages can import from one place
export type { Company, Review, LogoStripItem, ProjectGroup, ProjectImage, CmsMap, MediaMap }
export { getCms, getMedia } from './query-types'

// ─── Internal mappers ─────────────────────────────────────────────────────────

function buildCmsMap(rows: { page: string; section: string; content_key: string; content_value: string }[]): CmsMap {
  const map: CmsMap = {}
  rows.forEach((r) => { map[`${r.page}.${r.section}.${r.content_key}`] = r.content_value })
  return map
}

function buildMediaMap(rows: { slot_key: string; public_url: string | null }[]): MediaMap {
  const map: MediaMap = {}
  rows.forEach((r) => { if (r.public_url) map[r.slot_key] = r.public_url })
  return map
}

function mapCompany(db: Record<string, unknown>): Company {
  return {
    id: db.id as string,
    slug: db.slug as string,
    name: db.name as string,
    tagline: db.tagline as string,
    shortDescription: db.short_description as string,
    fullDescription: db.full_description as string,
    role: db.role as string,
    contributions: (db.contributions as string[]) || [],
    impact: db.impact as string,
    logo: (db.logo_url as string) || '',
    cover: (db.cover_url as string) || '',
    designs: (db.design_urls as string[]) || [],
    featured: db.featured as boolean,
    featuredImage: (db.featured_image_url as string) || '',
    category: db.category as string,
    layoutMode: ((db.layout_mode as string) === 'grouped' ? 'grouped' : 'simple'),
  }
}

function mapReview(db: Record<string, unknown>): Review {
  return {
    id: db.id as string,
    clientName: db.client_name as string,
    role: db.role as string,
    company: db.company as string,
    avatar: (db.avatar_url as string) || '/placeholder.svg',
    expandedImage: (db.expanded_image_url as string) || '/placeholder.svg',
    text: db.review_text as string,
    shortText: db.short_text as string,
    rating: db.rating as number,
  }
}

// ─── Cached server queries (deduped per request via React cache) ──────────────

export const getGlobalData = cache(async (): Promise<{ cms: CmsMap; mediaMap: MediaMap }> => {
  const supabase = createServerSupabase()
  const [{ data: contentRows }, { data: mediaRows }] = await Promise.all([
    supabase.from('site_content').select('page, section, content_key, content_value'),
    supabase.from('media_assets').select('slot_key, public_url'),
  ])
  return {
    cms: buildCmsMap(contentRows ?? []),
    mediaMap: buildMediaMap(mediaRows ?? []),
  }
})

export const getCompanies = cache(async (): Promise<Company[]> => {
  const supabase = createServerSupabase()
  const { data } = await supabase.from('companies').select('*').order('sort_order')
  return (data ?? []).map(mapCompany)
})

export const getCompanyBySlug = cache(async (slug: string): Promise<Company | null> => {
  const companies = await getCompanies()
  return companies.find((c) => c.slug === slug) ?? null
})

export const getReviews = cache(async (): Promise<Review[]> => {
  const supabase = createServerSupabase()
  const { data } = await supabase.from('reviews').select('*').order('sort_order')
  return (data ?? []).map(mapReview)
})

export const getLogoStrip = cache(async (): Promise<LogoStripItem[]> => {
  const supabase = createServerSupabase()
  const { data } = await supabase.from('logo_strip_items').select('*').eq('active', true).order('sort_order')
  return (data ?? []) as LogoStripItem[]
})

export const getProjectData = cache(async (companyId: string): Promise<{ groups: ProjectGroup[]; ungroupedImages: ProjectImage[] }> => {
  const supabase = createServerSupabase()
  const [{ data: groupsData }, { data: imagesData }] = await Promise.all([
    supabase.from('project_groups').select('*').eq('company_id', companyId).order('sort_order'),
    supabase.from('project_images').select('*').eq('company_id', companyId).order('sort_order'),
  ])
  const images = (imagesData ?? []) as ProjectImage[]
  const groups = (groupsData ?? []).map((g: Record<string, unknown>) => ({
    ...g,
    subtitle: (g.subtitle as string) || '',
    images: images.filter((img) => img.group_id === g.id),
  })) as ProjectGroup[]
  return {
    groups,
    ungroupedImages: images.filter((img) => !img.group_id),
  }
})

// Build-time company slugs fetch (no cookies, for generateStaticParams)
export async function getCompanySlugsForStaticGeneration(): Promise<string[]> {
  const supabase = createBuildTimeSupabase()
  const { data } = await supabase.from('companies').select('slug').order('sort_order')
  return (data ?? []).map((c: { slug: string }) => c.slug)
}
