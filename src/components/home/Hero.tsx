import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCms } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";

export function Hero() {
  const c = useCms();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={c('home', 'hero', 'bg_image', '/images/home/hero-bg.png')} alt="" className="absolute inset-0 w-full h-full object-cover object-left md:object-center" />
        <div className="absolute inset-0 bg-background/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between min-h-[80vh]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-20 max-w-2xl text-center md:text-left mx-auto md:mx-0 md:ml-[5%]">
            
            {/* Eyebrow tag */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-display font-medium tracking-wider text-primary uppercase">
                {c('home', 'hero', 'eyebrow', 'Available for New Projects')}
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.95] tracking-tight">
              {c('home', 'hero', 'title', 'Logo & Brand Identity Designer')}
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg">
              {c('home', 'hero', 'subtitle', 'Helping startups and businesses build memorable brands that stand out. From logo concepts to full brand identity systems.')}
            </motion.p>

            {/* Trust badges inline */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }} className="mt-5 flex items-center gap-4 justify-center md:justify-start text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {c('home', 'hero', 'badge_1', '50+ Projects Delivered')}
              </span>
              <span className="text-border">|</span>
              <span>{c('home', 'hero', 'badge_2', '6+ Years Experience')}</span>
              <span className="text-border hidden sm:inline">|</span>
              <span className="hidden sm:inline">{c('home', 'hero', 'badge_3', '100% Satisfaction')}</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }} className="mt-8 flex gap-4 justify-center md:justify-start">
              <Button variant="hero" size="lg" asChild className="h-13 px-8 text-sm">
                <Link to="/clients">
                  {c('home', 'hero', 'button_portfolio', 'View Portfolio')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild className="h-13 px-8 text-sm">
                <Link to="/contact">
                  {c('home', 'hero', 'button_contact', 'Start a Project')}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden md:block relative flex-shrink-0 mr-[5%]">
            <div className="w-[480px] lg:w-[580px] h-[560px] lg:h-[680px] relative">
              <img src={c('home', 'hero', 'person_image', '/images/home/hero-person.png')} alt={c('home', 'hero', 'person_alt', 'Mahtamun')} className="w-full h-full object-contain object-bottom drop-shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
