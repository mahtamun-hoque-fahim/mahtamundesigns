'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LazyImage } from '@/components/shared/LazyImage'
import type { Company, ProjectGroup, ProjectImage, CmsMap } from '@/lib/supabase/query-types'
import { getCms } from '@/lib/supabase/query-types'

interface Props {
  company: Company
  groups: ProjectGroup[]
  ungroupedImages: ProjectImage[]
  cms: CmsMap
}

export function CompanyShowcaseClient({ company, groups, ungroupedImages, cms }: Props) {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)
  const c = (p: string, s: string, k: string, f: string) => getCms(cms, p, s, k, f)
  const whatsappUrl = c('showcase','cta','whatsapp_url','https://wa.me/8801795931345')

  const hasProjectImages = groups.length > 0 || ungroupedImages.length > 0
  const useGroupedLayout = company.layoutMode === 'grouped' && groups.length > 0
  const simpleImages = hasProjectImages ? ungroupedImages.map(i => i.image_url) : company.designs

  const allImages: string[] = useGroupedLayout
    ? [...groups.flatMap(g => g.images.map(i => i.image_url)), ...ungroupedImages.map(i => i.image_url)]
    : simpleImages

  const openLightbox = useCallback((images: string[], index: number) => setLightbox({ images, index }), [])
  const closeLightbox = () => setLightbox(null)
  const prevImage = () => setLightbox(l => l ? { ...l, index: (l.index - 1 + l.images.length) % l.images.length } : null)
  const nextImage = () => setLightbox(l => l ? { ...l, index: (l.index + 1) % l.images.length } : null)

  return (
    <>
      {/* Hero Cover */}
      <div className="relative">
        <div className="h-[300px] md:h-[400px] relative overflow-hidden">
          <LazyImage src={company.cover} alt={company.name + ' cover'} className="w-full h-full" fill />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
        <div className="container mx-auto px-6">
          <div className="relative -mt-16 flex items-end gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-background bg-card flex items-center justify-center">
              <img src={company.logo} alt={company.name + ' logo'} className="w-full h-full object-contain p-3 brightness-0 invert" loading="lazy" />
            </div>
            <div className="pb-2">
              <h1 className="text-2xl md:text-4xl font-display font-bold">{company.name}</h1>
              <p className="text-muted-foreground">{company.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-12 pb-24">
        <Link href="/clients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">{c('showcase','about','title','About My Work')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6">{company.fullDescription}</p>
              <div className="space-y-3">
                <div><span className="text-xs uppercase tracking-wider text-muted-foreground font-display">{c('showcase','about','role_label','Role')}</span><p className="font-display font-semibold mt-1">{company.role}</p></div>
                <div><span className="text-xs uppercase tracking-wider text-muted-foreground font-display">{c('showcase','about','impact_label','Impact')}</span><p className="text-muted-foreground mt-1">{company.impact}</p></div>
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-display">{c('showcase','about','contributions_label','Contributions')}</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {company.contributions.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full border border-border text-sm font-display text-muted-foreground">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Design Gallery */}
        {allImages.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">{c('showcase','gallery','title','Design Gallery')}</h2>
            {useGroupedLayout ? (
              groups.map((group) => (
                <div key={group.id} className="mb-12">
                  <h3 className="text-xl font-display font-semibold mb-2">{group.title}</h3>
                  {group.subtitle && <p className="text-muted-foreground mb-6">{group.subtitle}</p>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.images.map((img, idx) => (
                      <button key={img.id} onClick={() => openLightbox(group.images.map(i => i.image_url), idx)} className="block overflow-hidden rounded-xl aspect-square bg-muted group">
                        <img src={img.image_url} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {simpleImages.map((url, idx) => (
                  <button key={idx} onClick={() => openLightbox(simpleImages, idx)} className="block overflow-hidden rounded-xl aspect-square bg-muted group">
                    <img src={url} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </button>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-16 pt-12 border-t border-border text-center">
          <h3 className="text-2xl font-display font-bold mb-4">{c('showcase','cta','title','Like What You See?')}</h3>
          <p className="text-muted-foreground mb-8">{c('showcase','cta','description',"Let's create something amazing for your brand.")}</p>
          <Button variant="hero" size="lg" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" /> {c('showcase','cta','button','Book a Meeting')}
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm" onClick={closeLightbox}>
            <button className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground" onClick={closeLightbox}><X className="w-6 h-6" /></button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); prevImage() }}><ChevronLeft className="w-8 h-8" /></button>
            <motion.img key={lightbox.index} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} src={lightbox.images[lightbox.index]} alt="" className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); nextImage() }}><ChevronRight className="w-8 h-8" /></button>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-muted-foreground font-display">{lightbox.index + 1} / {lightbox.images.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
