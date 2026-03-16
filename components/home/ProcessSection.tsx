'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CmsMap, MediaMap } from '@/lib/supabase/query-types'
import { getCms, getMedia } from '@/lib/supabase/query-types'

export function ProcessSection({ cms, mediaMap }: { cms: CmsMap; mediaMap: MediaMap }) {
  const c = (p: string, s: string, k: string, f: string) => getCms(cms, p, s, k, f)
  const stepImages = [
    getMedia(mediaMap, 'process-step-1', '/images/home/process-step-1.jpg'),
    getMedia(mediaMap, 'process-step-2', '/images/home/process-step-2.jpg'),
    getMedia(mediaMap, 'process-step-3', '/images/home/process-step-3.jpg'),
    getMedia(mediaMap, 'process-step-4', '/images/home/process-step-4.jpg'),
  ]
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  const steps = [
    { num: '01', title: c('home','process','step_1_title','Discovery Call'), desc: c('home','process','step_1_desc','We discuss your brand vision, target audience, and project goals.') },
    { num: '02', title: c('home','process','step_2_title','Research & Concepts'), desc: c('home','process','step_2_desc','Deep dive into your industry, competitors, and audience. Then craft initial concepts.') },
    { num: '03', title: c('home','process','step_3_title','Design & Refine'), desc: c('home','process','step_3_desc','Develop the chosen direction with revisions until every detail is perfect.') },
    { num: '04', title: c('home','process','step_4_title','Final Delivery'), desc: c('home','process','step_4_desc','Receive all files, brand guidelines, and assets ready for immediate use.') },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    stepRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActiveStep(i) }, { threshold: 0.6 })
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section className="bg-card">
      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-display mb-4">{c('home','process','eyebrow','How It Works')}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">{c('home','process','title','Simple. Transparent. Effective.')}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{c('home','process','subtitle','A proven 4-step process that turns your ideas into a brand you\'re proud of.')}</p>
        </div>

        <div className="hidden md:grid md:grid-cols-2 gap-16 relative">
          <div className="relative">
            <div className="sticky top-32 h-[70vh] rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img key={activeStep} src={stepImages[activeStep]} alt={steps[activeStep].title} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full h-full object-cover" />
              </AnimatePresence>
              <div className="absolute bottom-6 left-6 flex gap-2">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === activeStep ? 'w-8 bg-primary' : 'w-3 bg-foreground/30'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div key={i} ref={(el) => { stepRefs.current[i] = el }} className="min-h-[70vh] flex items-center">
                <div className={`transition-opacity duration-500 ${i === activeStep ? 'opacity-100' : 'opacity-30'}`}>
                  <span className="text-6xl font-display font-bold text-primary/20 block mb-4">{step.num}</span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-12">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col gap-6">
              <div className="rounded-xl overflow-hidden aspect-square">
                <img src={stepImages[i]} alt={step.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-4xl font-display font-bold text-primary/20 block mb-2">{step.num}</span>
                <h3 className="text-xl font-display font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
