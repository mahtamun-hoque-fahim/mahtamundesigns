import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Mail } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/home/hero-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-left md:object-center"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between min-h-[80vh]">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 max-w-2xl text-center md:text-left mx-auto md:mx-0 md:ml-[5%]"
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
                className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-md bg-white text-background font-display font-semibold tracking-wide hover:bg-white/90 transition-all duration-300 text-sm shadow-lg"
              >
                <Briefcase className="w-4 h-4" />
                Portfolio
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-md border border-white/30 bg-transparent text-foreground font-display font-semibold tracking-wide hover:bg-white/10 transition-all duration-300 text-sm"
              >
                <Mail className="w-4 h-4" />
                Contact
              </Link>
            </motion.div>
          </motion.div>

          {/* Personal image — hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden md:block relative flex-shrink-0 mr-[5%]"
          >
            <div className="w-[480px] lg:w-[580px] h-[560px] lg:h-[680px] relative">
              <img
                src="/images/home/hero-person.png"
                alt="Mahtamun"
                className="w-full h-full object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
