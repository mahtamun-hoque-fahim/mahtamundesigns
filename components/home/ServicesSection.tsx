'use client'
import { motion } from 'framer-motion'
import { Palette, Layers, PenTool, Globe } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import type { CmsMap } from '@/lib/supabase/query-types'
import { getCms } from '@/lib/supabase/query-types'

const icons = [Palette, Layers, PenTool, Globe]

export function ServicesSection({ cms }: { cms: CmsMap }) {
  const { ref, isInView } = useInView()
  const c = (p: string, s: string, k: string, f: string) => getCms(cms, p, s, k, f)
  const services = [
    { icon: 0, title: c('home','services','service_1_title','Logo Design'), desc: c('home','services','service_1_desc','Custom, memorable logos that capture the essence of your brand.') },
    { icon: 1, title: c('home','services','service_2_title','Brand Identity'), desc: c('home','services','service_2_desc','Complete brand systems including color palettes, typography, and visual guidelines.') },
    { icon: 2, title: c('home','services','service_3_title','Social Media Design'), desc: c('home','services','service_3_desc','Scroll-stopping social media graphics that maintain brand consistency.') },
    { icon: 3, title: c('home','services','service_4_title','Web & UI Design'), desc: c('home','services','service_4_desc','Modern, conversion-focused website and app interfaces that bring your brand digital.') },
  ]

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-display mb-4">{c('home','services','eyebrow','What I Do')}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">{c('home','services','title','Services That Build Brands')}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{c('home','services','subtitle','Every project gets a tailored approach — no cookie-cutter templates, just intentional design.')}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = icons[service.icon]
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
