// Safe for both client and server components — no next/headers dependency

export interface Company {
  id: string
  slug: string
  name: string
  tagline: string
  shortDescription: string
  fullDescription: string
  role: string
  contributions: string[]
  impact: string
  logo: string
  cover: string
  designs: string[]
  featured: boolean
  featuredImage: string
  category: string
  layoutMode: 'grouped' | 'simple'
}

export interface Review {
  id: string
  clientName: string
  role: string
  company: string
  avatar: string
  expandedImage: string
  text: string
  shortText: string
  rating: number
}

export interface LogoStripItem {
  id: string
  name: string
  logo_url: string
  sort_order: number
  active: boolean
}

export interface ProjectGroup {
  id: string
  company_id: string
  title: string
  subtitle: string
  sort_order: number
  images: ProjectImage[]
}

export interface ProjectImage {
  id: string
  company_id: string
  group_id: string | null
  image_url: string
  sort_order: number
}

export type CmsMap = Record<string, string>
export type MediaMap = Record<string, string>

export function getCms(map: CmsMap, page: string, section: string, key: string, fallback: string): string {
  return map[`${page}.${section}.${key}`] ?? fallback
}

export function getMedia(map: MediaMap, slot: string, fallback: string): string {
  return map[slot] ?? fallback
}
