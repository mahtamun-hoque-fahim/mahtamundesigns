'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote } from 'lucide-react'
import { LazyImage } from '@/components/shared/LazyImage'
import { useInView } from '@/hooks/useInView'
import type { Review, CmsMap } from '@/lib/supabase/query-types'
import { getCms } from '@/lib/supabase/query-types'

const INTERVAL = 5000

export function ReviewsPreview({ reviews, cms }: { reviews: Review[]; cms: CmsMap }) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const { ref, isInView } = useInView()
  const previewReviews = reviews.slice(0, 4)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % previewReviews.length)
    setProgress(0)
  }, [previewReviews.length])

  useEffect(() => {
    if (!isInView || previewReviews.length === 0) return
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { next(); return 0 }
        return prev + (100 / (INTERVAL / 50))
      })
    }, 50)
    return () => clearInterval(progressInterval)
  }, [isInView, next, previewReviews.length])

  const review = previewReviews[current]
  if (!review) return null

  return (
    <section ref={ref} className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-display mb-4">
            {getCms(cms, 'home', 'reviews_preview', 'subtitle', 'Client Testimonials')}
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-16">
            {getCms(cms, 'home', 'reviews_preview', 'title', 'What Clients Say About Us')}
          </h2>

          <div className="relative min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-center">
                <Quote className="w-8 h-8 text-primary/30 mx-auto mb-6" />
                <p className="text-lg md:text-xl text-foreground leading-relaxed italic mb-8">"{review.text}"</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <LazyImage src={review.avatar} alt={review.clientName} aspectRatio="square" />
                  </div>
                  <div className="text-left">
                    <p className="font-display font-semibold">{review.clientName}</p>
                    <p className="text-sm text-muted-foreground">{review.role}, {review.company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            {previewReviews.map((r, i) => (
              <button key={r.id} onClick={() => { setCurrent(i); setProgress(0) }} className="relative h-1 rounded-full overflow-hidden transition-all duration-300" style={{ width: i === current ? '3rem' : '0.75rem', background: 'hsl(var(--border))' }}>
                {i === current && (
                  <motion.div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${progress}%` }} />
                )}
              </button>
            ))}
          </div>

          <Link href="/reviews" className="inline-block mt-10 text-sm text-primary font-display hover:underline">
            {getCms(cms, 'home', 'reviews_preview', 'link', 'Read All Reviews')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
