import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCompanies } from "@/hooks/useCompaniesData";
import { useProjectGroups } from "@/hooks/useProjectData";
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

  const { groups, ungroupedImages, loading: projectsLoading } = useProjectGroups(company?.id);

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

  // Determine which images to show: new project_images system or legacy design_urls
  const hasProjectImages = groups.length > 0 || ungroupedImages.length > 0;
  const useGroupedLayout = company.layoutMode === "grouped" && groups.length > 0;
  const simpleImages = hasProjectImages ? ungroupedImages.map(i => i.image_url) : company.designs;

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

          {/* Design Showcase - Grouped or Simple */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
              {c('showcase', 'designs', 'title', 'Design Showcase')}
            </h2>

            {useGroupedLayout ? (
              /* Grouped Layout - Stacked Sections */
              <div className="space-y-16">
                {groups.map((group, gi) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + gi * 0.1 }}
                  >
                    <h3 className="text-xl md:text-2xl font-display font-semibold mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{gi + 1}</span>
                      {group.title}
                    </h3>
                    <ImageGrid images={group.images.map(i => i.image_url)} companyName={company.name} />
                  </motion.div>
                ))}

                {/* Show ungrouped images if any exist alongside groups */}
                {ungroupedImages.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 + groups.length * 0.1 }}>
                    <h3 className="text-xl md:text-2xl font-display font-semibold mb-6 text-muted-foreground">Other Designs</h3>
                    <ImageGrid images={ungroupedImages.map(i => i.image_url)} companyName={company.name} />
                  </motion.div>
                )}
              </div>
            ) : (
              /* Simple Layout */
              <ImageGrid images={simpleImages} companyName={company.name} animated />
            )}
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

function ImageGrid({ images, companyName, animated }: { images: string[]; companyName: string; animated?: boolean }) {
  const isComplexGrid = images.length > 2;
  const gridClasses = ["md:col-span-8", "md:col-span-4", "md:col-span-6", "md:col-span-6", "md:col-span-12"];

  if (images.length === 0) {
    return <p className="text-muted-foreground text-sm italic">No designs yet.</p>;
  }

  return (
    <div className={isComplexGrid ? "grid grid-cols-1 md:grid-cols-12 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
      {images.map((img, i) => {
        const complexGridClass = gridClasses[i % 5];
        const content = (
          <div className="relative overflow-hidden rounded-lg bg-card h-[300px] md:h-[400px]">
            <LazyImage src={img} alt={`${companyName} design ${i + 1}`} className="w-full h-full" fill />
          </div>
        );

        if (animated) {
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }} className={isComplexGrid ? complexGridClass : ""}>
              {content}
            </motion.div>
          );
        }

        return (
          <div key={i} className={isComplexGrid ? complexGridClass : ""}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

export default CompanyShowcase;
