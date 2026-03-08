import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useCms } from "@/hooks/useSiteContent";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          className="relative overflow-hidden rounded-3xl bg-card p-10 md:p-16 max-w-4xl mx-auto"
        >
          {/* Gradient blob */}
          <div className="absolute top-0 right-0 w-[70%] h-full pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,hsl(var(--primary)/0.5)_0%,hsl(var(--primary)/0.2)_40%,transparent_75%)] blur-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_65%,hsl(var(--primary)/0.3)_0%,hsl(var(--primary)/0.1)_45%,transparent_70%)] blur-3xl" />
          </div>

          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4 text-foreground">
              {c('home', 'cta', 'title', 'Still Thinking?')}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8">
              {c('home', 'cta', 'description', "Great design doesn't wait. Let's have a quick chat about your vision — no commitment, just a conversation.")}
            </p>
            <Button
              asChild
              className="h-14 px-10 text-base font-display font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                {c('home', 'cta', 'button_text', 'Book a Meeting')}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
