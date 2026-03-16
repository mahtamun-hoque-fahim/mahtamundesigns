'use client'
import type { LogoStripItem, CmsMap } from '@/lib/supabase/query-types'
import { getCms } from '@/lib/supabase/query-types'

export function LogoStrip({ items, cms }: { items: LogoStripItem[]; cms: CmsMap }) {
  const doubled = [...items, ...items]
  if (items.length === 0) return null

  return (
    <section className="py-20 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-6 mb-10">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground font-display">
          {getCms(cms, 'home', 'logostrip', 'title', 'Trusted by Rising Brands of Bangladesh')}
        </p>
      </div>
      <div className="relative">
        <div className="logo-strip-scroll flex items-center gap-16 w-max">
          {doubled.map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex-shrink-0 w-24 h-12 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-300">
              {item.logo_url ? (
                <img src={item.logo_url} alt={item.name} loading="lazy" className="max-w-full max-h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
              ) : (
                <div className="w-16 h-8 rounded bg-muted-foreground/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
