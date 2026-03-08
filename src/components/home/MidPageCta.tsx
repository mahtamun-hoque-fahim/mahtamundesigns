import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useCms } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function MidPageCta() {
  const { ref, isInView } = useInView();
  const c = useCms();

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-10 md:p-14 text-center"
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight mb-4">
            {c('home', 'midcta', 'title', 'Ready to Build Your Brand?')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            {c('home', 'midcta', 'description', "Let's have a quick chat about your vision — no commitment, just a conversation about what's possible.")}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                {c('home', 'midcta', 'button_primary', 'Start Your Project')}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/clients">
                {c('home', 'midcta', 'button_secondary', 'See My Work')}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
