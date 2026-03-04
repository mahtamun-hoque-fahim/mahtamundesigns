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
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-6">
            {c('home', 'cta', 'title', 'Still Thinking?')}
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            {c('home', 'cta', 'description', "Great design doesn't wait. Let's have a quick chat about your vision — no commitment, just a conversation.")}
          </p>
          <Button variant="hero" size="lg" asChild className="h-14 px-10 text-base">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              {c('home', 'cta', 'button_text', 'Book a Meeting')}
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
