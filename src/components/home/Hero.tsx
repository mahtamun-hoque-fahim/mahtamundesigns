import { Link } from "react-router-dom";
import { LazyImage } from "@/components/LazyImage";
import { motion } from "framer-motion";
import { Briefcase, Mail } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background pattern image */}
      <div className="absolute inset-0">
        <LazyImage
          src="/images/home/hero.jpg"
          alt="Background pattern"
          className="w-full h-full"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl md:w-1/2"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] tracking-tight"
            >
              Mahtamun
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-4 text-base md:text-lg text-muted-foreground font-mono tracking-wide"
            >
              Lead Designer @interting.digital
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex gap-4"
            >
              <Link
                to="/clients"
                className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-md border border-foreground/80 bg-transparent text-foreground font-display font-semibold tracking-wide hover:bg-foreground hover:text-background transition-all duration-300 text-sm"
              >
                <Briefcase className="w-4 h-4" />
                Portfolio
              </Link>
              <Link
                to="/reviews"
                className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-md border border-foreground/80 bg-transparent text-foreground font-display font-semibold tracking-wide hover:bg-foreground hover:text-background transition-all duration-300 text-sm"
              >
                <Mail className="w-4 h-4" />
                Contact
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Person image with violet glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative md:w-1/2 flex justify-center md:justify-end"
          >
            {/* Violet glow behind the person */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-[80%] h-[80%] rounded-full blur-[100px] opacity-40"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
              />
            </div>
            <img
              src="/images/home/hero-person.png"
              alt="Mahtamun Hoque Fahim"
              className="relative z-10 h-[60vh] md:h-[75vh] object-contain object-bottom drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
