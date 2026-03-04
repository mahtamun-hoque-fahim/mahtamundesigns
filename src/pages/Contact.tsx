import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/shared/ContactForm";
import { useCompanies } from "@/hooks/useCompaniesData";
import { useCms } from "@/hooks/useSiteContent";
import { Instagram, Globe, Dribbble, Mail } from "lucide-react";

const Contact = () => {
  const companies = useCompanies();
  const c = useCms();
  const logos = companies.map(co => ({ id: co.id, name: co.name, logo: co.logo }));
  const doubled = [...logos, ...logos];

  const email = c('contact', 'form', 'email', 'mahtamunhoquefahim@pm.me');
  const whatsapp = c('contact', 'form', 'whatsapp', '+880 1795 931345');
  const whatsappUrl = c('contact', 'form', 'whatsapp_url', 'https://wa.me/8801795931345');

  const socials = [
    { icon: Instagram, label: "Instagram", href: c('global', 'footer', 'instagram_url', '#') },
    { icon: Globe, label: "Behance", href: c('global', 'footer', 'behance_url', '#') },
    { icon: Dribbble, label: "Dribbble", href: c('global', 'footer', 'dribbble_url', '#') },
    { icon: Mail, label: "Email", href: `mailto:${email}` },
  ];

  const title = c('contact', 'header', 'title', "Let's Build Something Together");
  const titleParts = title.split(' ');
  const lastWord = titleParts[titleParts.length - 1];
  const rest = titleParts.slice(0, -1).join(' ');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                {rest} <span className="text-primary">{lastWord}</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                {c('contact', 'header', 'description', "Whether you have a project in mind, want to discuss a collaboration, or just want to say hello — I'd love to hear from you.")}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 border-y border-border/50 overflow-hidden">
          <div className="container mx-auto px-6 mb-8">
            <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground font-display">
              {c('contact', 'brands', 'title', "Brands I've Worked With")}
            </p>
          </div>
          <div className="relative">
            <div className="logo-strip-scroll flex items-center gap-16 w-max">
              {doubled.map((item, i) => (
                <div key={`${item.id}-${i}`} className="flex-shrink-0 w-24 h-12 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-300">
                  <img src={item.logo} alt={item.name} loading="lazy" className="max-w-full max-h-full object-contain brightness-0 invert opacity-70" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                  {c('contact', 'form', 'title', 'Get in Touch')}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  {c('contact', 'form', 'description', "Drop me a message using the form. I'll get back to you within 24 hours. Let's discuss your vision and bring it to life.")}
                </p>
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-primary mb-1 font-display">Email</p>
                    <a href={`mailto:${email}`} className="text-sm text-foreground hover:text-primary transition-colors">{email}</a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-primary mb-1 font-display">WhatsApp</p>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-primary transition-colors">{whatsapp}</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  {socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300">
                      <s.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
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
