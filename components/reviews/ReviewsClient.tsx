'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, X, Star, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LazyImage } from '@/components/shared/LazyImage'
import type { Review, CmsMap } from '@/lib/supabase/query-types'
import { getCms } from '@/lib/supabase/query-types'

const cardSpans = ['md:col-span-5','md:col-span-4','md:col-span-3','md:col-span-6','md:col-span-6','md:col-span-4','md:col-span-3','md:col-span-5','md:col-span-5','md:col-span-4','md:col-span-3']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
      ))}
    </div>
  )
}

export function ReviewsClient({ reviews, cms }: { reviews: Review[]; cms: CmsMap }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const whatsappUrl = getCms(cms,'showcase','cta','whatsapp_url','https://wa.me/8801795931345')
  const expandedReview = reviews.find((r) => r.id === expanded)
  const title = getCms(cms,'reviews','header','title','Client Reviews')
  const titleParts = title.split(' ')

  return (
    <div className="container mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
          {titleParts.length > 1 ? <>{titleParts.slice(0,-1).join(' ')} <span className="text-primary">{titleParts[titleParts.length-1]}</span></> : title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">{getCms(cms,'reviews','header','description',"Hear from the brands we've helped transform through design.")}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {reviews.map((review, i) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.06 }} className={cardSpans[i] || 'md:col-span-4'}>
            <div className="bg-card border border-border/50 rounded-xl p-6 cursor-pointer hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full" onClick={() => setExpanded(review.id)}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <LazyImage src={review.avatar} alt={review.clientName} aspectRatio="square" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">{review.clientName}</p>
                  <p className="text-xs text-muted-foreground">{review.role}, {review.company}</p>
                </div>
              </div>
              <StarRating rating={review.rating} />
              <p className="text-sm text-muted-foreground italic mt-3">"{review.shortText}"</p>
              <p className="text-xs text-primary mt-3 font-display">Read more →</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {expandedReview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setExpanded(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="bg-card border border-border rounded-2xl overflow-hidden w-full max-w-3xl max-h-[85vh] flex flex-col md:flex-row shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="hidden md:block w-[40%] relative flex-shrink-0">
                <img src={expandedReview.expandedImage} alt={expandedReview.company} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
              </div>
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
                <button onClick={() => setExpanded(null)} className="absolute top-4 right-4 md:relative md:top-auto md:right-auto md:self-end text-muted-foreground hover:text-foreground transition-colors mb-6">
                  <X className="w-5 h-5" />
                </button>
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-foreground leading-relaxed italic text-base md:text-lg mb-6">"{expandedReview.text}"</p>
                <StarRating rating={expandedReview.rating} />
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="font-display font-bold text-lg">{expandedReview.clientName}</p>
                  <p className="text-sm text-muted-foreground">{expandedReview.role}</p>
                  <p className="text-sm text-primary">{expandedReview.company}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-border">
                  <Button variant="hero" size="lg" asChild className="w-full h-12">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" /> Book Meeting
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
