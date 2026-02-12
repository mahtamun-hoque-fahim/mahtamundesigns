import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Instagram, Globe, Dribbble, Mail } from "lucide-react";
import { ContactForm } from "@/components/shared/ContactForm";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Globe, label: "Behance", href: "#" },
  { icon: Dribbble, label: "Dribbble", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:mahtamunhoquefahim@pm.me" },
];

export function ContactSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-card border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left: Info + Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Let's <span className="text-primary">Talk</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Have a project in mind or just want to say hello? I'd love to hear from you. Drop me a message and I'll get back to you soon.
            </p>

            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm className="flex flex-col" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
