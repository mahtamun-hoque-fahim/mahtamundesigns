import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useReviews } from "@/hooks/useReviewsData";
import { useCms } from "@/hooks/useSiteContent";
import { LazyImage } from "@/components/LazyImage";
import { useInView } from "@/hooks/useInView";
import { Quote } from "lucide-react";

const INTERVAL = 5000;

export function ReviewsPreview() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const { ref, isInView } = useInView();
  const allReviews = useReviews();
  const c = useCms();
  const previewReviews = allReviews.slice(0, 4);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % previewReviews.length);
    setProgress(0);
  }, [previewReviews.length]);

  useEffect(() => {
    if (!isInView) return;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { next(); return 0; }
        return prev + (100 / (INTERVAL / 50));
      });
    }, 50);
    return () => clearInterval(progressInterval);
  }, [isInView, next]);

  const review = previewReviews[current];
  if (!review) return null;

  return (
    <section ref={ref} className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-display mb-4">
            {c('home', 'reviews_preview', 'subtitle', 'Client Testimonials')}
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-16">
            {c('home', 'reviews_preview', 'title', 'What Clients Say About Us')}
          </h2>

          <div className="relative min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
                <Quote className="w-10 h-10 text-primary/30 mb-6" />
                <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 italic">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <LazyImage src={review.avatar} alt={review.clientName} aspectRatio="square" />
                  </div>
                  <div className="text-left">
                    <p className="font-display font-semibold text-sm">{review.clientName}</p>
                    <p className="text-xs text-muted-foreground">{review.role}, {review.company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-2 justify-center mt-10">
            {previewReviews.map((_, i) => (
              <div key={i} className="w-16 h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-100 ease-linear" style={{ width: i === current ? `${progress}%` : i < current ? "100%" : "0%" }} />
              </div>
            ))}
          </div>

          <Link to="/reviews" className="inline-block mt-8 text-sm text-primary hover:text-primary/80 transition-colors font-display tracking-wider uppercase">
            {c('home', 'reviews_preview', 'link_text', 'Read All Reviews →')}
          </Link>
        </div>
      </div>
    </section>
  );
}
