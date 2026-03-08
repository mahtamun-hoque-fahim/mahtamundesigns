import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useCms } from "@/hooks/useSiteContent";
import { useReviews } from "@/hooks/useReviewsData";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/LazyImage";

export function CtaSection() {
  const { ref, isInView } = useInView();
  const c = useCms();
  const reviews = useReviews();
  const featured = reviews[0];

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-10 md:p-14"
        >
          {/* Bottom glow — tight neon band */}
          <div className="absolute -bottom-2 left-[10%] right-[10%] h-[6px] rounded-full bg-[hsl(280_80%_60%)] blur-[2px] pointer-events-none" />
          <div className="absolute -bottom-1 left-[15%] right-[15%] h-[4px] rounded-full bg-[hsl(320_90%_65%)] blur-[1px] pointer-events-none" />
          <div className="absolute bottom-0 left-[5%] right-[5%] h-16 pointer-events-none bg-[radial-gradient(ellipse_at_50%_100%,hsl(300_80%_55%/0.5)_0%,hsl(var(--primary)/0.3)_30%,transparent_70%)] blur-xl" />
          <div className="absolute bottom-0 left-[10%] right-[10%] h-24 pointer-events-none bg-[radial-gradient(ellipse_at_50%_100%,hsl(330_85%_60%/0.25)_0%,hsl(270_70%_50%/0.15)_40%,transparent_70%)] blur-2xl" />

          {/* Dot pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
            {/* Left: CTA content */}
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4 text-foreground">
                {c('home', 'cta', 'title', 'Still Thinking?')}
              </h2>
              <p className="text-muted-foreground text-base mb-8 max-w-md">
                {c('home', 'cta', 'description', "Great design doesn't wait. Let's have a quick chat about your vision — no commitment, just a conversation.")}
              </p>
              <div className="flex gap-3">
                <Button variant="hero" size="lg" asChild className="h-12 px-8 rounded-full text-sm">
                  <Link to="/contact">
                    {c('home', 'cta', 'button_text', 'Start a Project')}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild className="h-12 px-8 rounded-full text-sm">
                  <Link to="/clients">
                    {c('home', 'cta', 'button_secondary', 'View Work')}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Testimonial card */}
            {featured && (
              <div className="w-full md:w-[380px] flex-shrink-0 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: featured.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                  "{featured.shortText || featured.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <LazyImage src={featured.avatar} alt={featured.clientName} aspectRatio="square" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{featured.clientName}</p>
                    <p className="text-xs text-primary">{featured.role}, {featured.company}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
