'use client'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { useCountUp } from '@/hooks/useCountUp'
import type { CmsMap } from '@/lib/supabase/query-types'
import { getCms } from '@/lib/supabase/query-types'

function StatItem({ value, suffix, label, isInView, delay }: { value: number; suffix: string; label: string; isInView: boolean; delay: number }) {
  const count = useCountUp(value, 2000, isInView)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className="text-center">
      <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary">{count}{suffix}</p>
      <p className="mt-2 text-sm text-muted-foreground uppercase tracking-wider font-display">{label}</p>
    </motion.div>
  )
}

export function StatsSection({ cms }: { cms: CmsMap }) {
  const { ref, isInView } = useInView()
  const c = (p: string, s: string, k: string, f: string) => getCms(cms, p, s, k, f)
  const stats = [
    { value: parseInt(c('home','stats','stat_1_value','6')) || 6, suffix: c('home','stats','stat_1_suffix','+'), label: c('home','stats','stat_1_label','Years Experience') },
    { value: parseInt(c('home','stats','stat_2_value','600')) || 600, suffix: c('home','stats','stat_2_suffix','+'), label: c('home','stats','stat_2_label','Designs Created') },
    { value: parseInt(c('home','stats','stat_3_value','11')) || 11, suffix: c('home','stats','stat_3_suffix',''), label: c('home','stats','stat_3_label','Happy Clients') },
    { value: parseInt(c('home','stats','stat_4_value','100')) || 100, suffix: c('home','stats','stat_4_suffix','%'), label: c('home','stats','stat_4_label','Client Satisfaction') },
  ]

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => <StatItem key={stat.label} {...stat} isInView={isInView} delay={i * 0.15} />)}
        </div>
      </div>
    </section>
  )
}
