import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reviews } from "@/data/reviews";
import { LazyImage } from "@/components/LazyImage";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Quote, X } from "lucide-react";

const Reviews = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              Client <span className="text-primary">Reviews</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Hear from the brands we've helped transform through design.
            </p>
          </motion.div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="break-inside-avoid"
              >
                <AnimatePresence mode="wait">
                  {expanded === review.id ? (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card border border-primary/20 rounded-xl p-8 cursor-pointer"
                      onClick={() => setExpanded(null)}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                            <LazyImage src={review.avatar} alt={review.clientName} aspectRatio="square" />
                          </div>
                          <div>
                            <p className="font-display font-semibold">{review.clientName}</p>
                            <p className="text-sm text-muted-foreground">{review.role}</p>
                            <p className="text-xs text-primary">{review.company}</p>
                          </div>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <Quote className="w-6 h-6 text-primary/30 mb-4" />
                      <p className="text-foreground leading-relaxed italic">"{review.text}"</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="collapsed"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card border border-border/50 rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-colors duration-300"
                      onClick={() => setExpanded(review.id)}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <LazyImage src={review.avatar} alt={review.clientName} aspectRatio="square" />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-sm">{review.clientName}</p>
                          <p className="text-xs text-muted-foreground">{review.role}, {review.company}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{review.shortText}"</p>
                      <p className="text-xs text-primary mt-3 font-display">Read more →</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;
