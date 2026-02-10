import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Mail } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background pattern image */}
      <div className="absolute inset-0">
        <img
          src="/images/home/hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient: dark on bottom to blend with page */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
        {/* Gradient: dark on right side for person contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/60 hidden md:block" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-center md:justify-start min-h-[80vh]">
          {/* Text content — centered on mobile, offset on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 max-w-xl text-center md:text-left md:ml-[10%] lg:ml-[15%]"
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
              className="mt-10 flex gap-4 justify-center md:justify-start"
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

          {/* Right: Person image with violet glow — hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute right-0 bottom-0 md:right-[5%] z-10 pointer-events-none hidden md:block"
          >
            {/* Violet glow behind the person */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-[70%] h-[70%] rounded-full blur-[120px] opacity-50"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
              />
            </div>
            <img
              src="/images/home/hero-person.png"
              alt="Mahtamun Hoque Fahim"
              className="relative h-[85vh] object-contain object-bottom drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
