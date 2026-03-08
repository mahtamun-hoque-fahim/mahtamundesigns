import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useCms } from "@/hooks/useSiteContent";
import { MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CtaSection() {
  const { ref, isInView } = useInView();
  const c = useCms();
  const whatsappUrl = c('home', 'cta', 'whatsapp_url', 'https://wa.me/8801795931345');

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-10 md:p-14 max-w-5xl mx-auto"
        >
          {/* Dot pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

          {/* Bottom purple glow */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-48 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,hsl(263_70%_58%/0.8)_0%,hsl(263_60%_55%/0.5)_30%,hsl(263_50%_50%/0.2)_60%,transparent_80%)] blur-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,hsl(263_80%_65%/0.4)_0%,transparent_60%)] blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
            {/* Left: Headline + CTAs */}
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4 text-foreground">
                {c('home', 'cta', 'title', 'Still Thinking?')}
              </h2>
              <p className="text-muted-foreground text-base mb-8 max-w-md">
                {c('home', 'cta', 'description', "Great design doesn't wait. Let's have a quick chat about your vision — no commitment, just a conversation.")}
              </p>
              <div className="flex gap-3">
                <Button
                  asChild
                  className="h-12 px-8 text-sm font-display font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    {c('home', 'cta', 'button_text', 'Book a Meeting')}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 px-8 text-sm font-display font-semibold rounded-full border-border/60 hover:bg-accent/50 transition-all duration-300"
                >
                  <Link to="/clients">
                    {c('home', 'cta', 'button_secondary', 'View Portfolio')}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Testimonial card */}
            <div className="flex-shrink-0 w-full md:w-[380px] rounded-2xl border border-border/40 bg-background/40 backdrop-blur-sm p-6">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {c('home', 'cta', 'testimonial_text', '"Mahtamun delivered an exceptional brand identity that truly captured our vision. The attention to detail and creative process was outstanding. Highly recommend for any brand project."')}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted overflow-hidden">
                  <img
                    src={c('home', 'cta', 'testimonial_avatar', '/images/reviews/client-1.jpg')}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-display font-semibold text-foreground">
                    {c('home', 'cta', 'testimonial_name', 'James Cooper')}
                  </p>
                  <p className="text-xs text-primary">
                    {c('home', 'cta', 'testimonial_role', 'Chief Marketing Officer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
