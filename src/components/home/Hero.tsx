import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/LazyImage";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <LazyImage
          src="/images/home/hero.jpg"
          alt="Creative workspace"
          className="w-full h-full"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary font-display text-sm uppercase tracking-[0.3em] mb-6"
          >
            Graphic Designer & Creative Director
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight"
          >
            Design that
            <br />
            <span className="text-primary">speaks</span>
            <br />
            louder.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-lg text-muted-foreground max-w-md leading-relaxed"
          >
            Crafting bold visual identities and memorable brand experiences for ambitious companies across Bangladesh.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex gap-4"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/clients">Portfolio</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/reviews">Contact</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
