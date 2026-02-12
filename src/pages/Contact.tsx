import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/shared/ContactForm";
import { logoStripItems } from "@/data/companies";
import { Instagram, Globe, Dribbble, Mail } from "lucide-react";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Globe, label: "Behance", href: "#" },
  { icon: Dribbble, label: "Dribbble", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:mahtamunhoquefahim@pm.me" },
];

const Contact = () => {
  const doubled = [...logoStripItems, ...logoStripItems];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Header Section */}
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                Let's Build Something <span className="text-primary">Together</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                Whether you have a project in mind, want to discuss a collaboration, or just want to say hello — I'd love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Brand Loop Section */}
        <section className="py-12 border-y border-border/50 overflow-hidden">
          <div className="container mx-auto px-6 mb-8">
            <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground font-display">
              Brands I've Worked With
            </p>
          </div>
          <div className="relative">
            <div className="logo-strip-scroll flex items-center gap-16 w-max">
              {doubled.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="flex-shrink-0 w-24 h-12 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-300"
                >
                  <img
                    src={item.logo}
                    alt={item.name}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain brightness-0 invert opacity-70"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
              {/* Left: Info + Socials */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                  Get in <span className="text-primary">Touch</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Drop me a message using the form. I'll get back to you within 24 hours. Let's discuss your vision and bring it to life.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-primary mb-1 font-display">Email</p>
                    <a href="mailto:mahtamunhoquefahim@pm.me" className="text-sm text-foreground hover:text-primary transition-colors">
                      mahtamunhoquefahim@pm.me
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-primary mb-1 font-display">WhatsApp</p>
                    <a href="https://wa.me/8801795931345" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-primary transition-colors">
                      +880 1795 931345
                    </a>
                  </div>
                </div>

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
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <ContactForm className="flex flex-col" />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
