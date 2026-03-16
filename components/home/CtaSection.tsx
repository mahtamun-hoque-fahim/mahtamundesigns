'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInView } from '@/hooks/useInView'
import type { CmsMap, MediaMap } from '@/lib/supabase/query-types'
import { getCms, getMedia } from '@/lib/supabase/query-types'

export function CtaSection({ cms, mediaMap }: { cms: CmsMap; mediaMap: MediaMap }) {
  const { ref, isInView } = useInView()
  const c = (p: string, s: string, k: string, f: string) => getCms(cms, p, s, k, f)
  const heroBg = getMedia(mediaMap, 'hero-bg', '/images/home/hero-bg.png')
  const ctaSideImage = getMedia(mediaMap, 'cta-side-image', '/images/reviews/client-1.jpg')
  const whatsappUrl = c('home','cta','whatsapp_url','https://wa.me/8801795931345')

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-3xl border border-border/40 p-10 md:p-14 max-w-5xl mx-auto min-h-[320px]">
          {heroBg && <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />}
          <div className="absolute inset-0 bg-background/60" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 min-w-0 md:pl-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4 text-foreground">{c('home','cta','title','Still Thinking?')}</h2>
              <p className="text-muted-foreground text-base mb-8 max-w-md">{c('home','cta','description',"Great design doesn't wait. Let's have a quick chat about your vision.")}</p>
              <div className="flex gap-3">
                <Button asChild className="h-12 px-8 text-sm font-display font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    {c('home','cta','button_text','Book a Meeting')}
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8 text-sm font-display font-semibold rounded-full border-border/60 hover:bg-accent/50 transition-all duration-300">
                  <Link href="/clients">{c('home','cta','button_secondary','View Portfolio')}</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block flex-shrink-0">
              {ctaSideImage && <img src={ctaSideImage} alt="Client review" className="w-[280px] h-auto rounded-2xl border border-border/30 shadow-2xl rotate-3" />}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
