import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCompanies } from "@/hooks/useCompaniesData";
import { useCms } from "@/hooks/useSiteContent";
import { LazyImage } from "@/components/LazyImage";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompanyShowcase = () => {
  const { slug } = useParams();
  const companies = useCompanies();
  const c = useCms();
  const company = companies.find((co) => co.slug === slug);
  const whatsappUrl = c('showcase', 'cta', 'whatsapp_url', 'https://wa.me/8801795931345');

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-display font-bold">Company not found</h1>
            <Link to="/clients" className="text-primary mt-4 inline-block">← Back to clients</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isComplexGrid = company.designs.length > 2;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="relative">
          <div className="h-[300px] md:h-[400px] relative overflow-hidden">
            <LazyImage src={company.cover} alt={`${company.name} cover`} className="w-full h-full" fill />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
          <div className="container mx-auto px-6">
            <div className="relative -mt-16 flex items-end gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-background bg-card flex items-center justify-center">
                <img src={company.logo} alt={`${company.name} logo`} className="w-full h-full object-contain p-3 brightness-0 invert" loading="lazy" />
              </div>
              <div className="pb-2">
                <h1 className="text-2xl md:text-4xl font-display font-bold">{company.name}</h1>
                <p className="text-muted-foreground">{company.tagline}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pt-12 pb-24">
          <Link to="/clients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Clients
          </Link>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
              {c('showcase', 'about', 'title', 'About My Work')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-muted-foreground leading-relaxed">{company.fullDescription}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary mb-2 font-display">Role</p>
                  <p className="text-sm font-medium">{company.role}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary mb-2 font-display">Contributions</p>
                  <div className="flex flex-wrap gap-2">
                    {company.contributions.map((co) => (
                      <span key={co} className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">{co}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary mb-2 font-display">Impact</p>
                  <p className="text-sm text-muted-foreground">{company.impact}</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
              {c('showcase', 'designs', 'title', 'Design Showcase')}
            </h2>
            <div className={isComplexGrid ? "grid grid-cols-1 md:grid-cols-12 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
              {company.designs.map((design, i) => {
                const complexGridClass = ["md:col-span-8", "md:col-span-4", "md:col-span-6", "md:col-span-6", "md:col-span-12"][i % 5];
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }} className={isComplexGrid ? complexGridClass : ""}>
                    <div className="relative overflow-hidden rounded-lg bg-card h-[300px] md:h-[400px]">
                      <LazyImage src={design} alt={`${company.name} design ${i + 1}`} className="w-full h-full" fill />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              {c('showcase', 'cta', 'title', 'Interested in working together?')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {c('showcase', 'cta', 'description', "Let's discuss your project and bring your vision to life.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild className="h-12 px-8">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {c('showcase', 'cta', 'button_meeting', 'Book Meeting')}
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild className="h-12 px-8">
                <Link to="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  {c('showcase', 'cta', 'button_contact', 'Contact')}
                </Link>
              </Button>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyShowcase;
