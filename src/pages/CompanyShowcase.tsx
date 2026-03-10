import { useParams, Link } from "react-router-dom";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanies } from "@/hooks/useCompaniesData";
import { useProjectGroups } from "@/hooks/useProjectData";
import { useCms } from "@/hooks/useSiteContent";
import { LazyImage } from "@/components/LazyImage";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, MessageCircle, Mail, X, ChevronLeft, ChevronRight } from "lucide-react";
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

  const hasProjectImages = groups.length > 0 || ungroupedImages.length > 0;
  const useGroupedLayout = company.layoutMode === "grouped" && groups.length > 0;
  const simpleImages = hasProjectImages ? ungroupedImages.map(i => i.image_url) : company.designs;

  // Collect all images for lightbox navigation
  const allImages: string[] = useGroupedLayout
    ? [
        ...groups.flatMap(g => g.images.map(i => i.image_url)),
        ...ungroupedImages.map(i => i.image_url),
      ]
    : simpleImages;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Cover */}
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

          {/* About */}
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

          {/* Design Showcase */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
              {c('showcase', 'designs', 'title', 'Design Showcase')}
            </h2>

            {useGroupedLayout ? (
              <div className="space-y-20">
                {groups.map((group, gi) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + gi * 0.1 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-xl md:text-2xl font-display font-semibold flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{gi + 1}</span>
                        {group.title}
                      </h3>
                      {group.subtitle && (
                        <p className="text-muted-foreground mt-1 ml-11">{group.subtitle}</p>
                      )}
                    </div>
                    <MasonryGrid images={group.images.map(i => i.image_url)} companyName={company.name} allImages={allImages} />
                  </motion.div>
                ))}

                {ungroupedImages.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 + groups.length * 0.1 }}>
                    <h3 className="text-xl md:text-2xl font-display font-semibold mb-6 text-muted-foreground">Other Designs</h3>
                    <MasonryGrid images={ungroupedImages.map(i => i.image_url)} companyName={company.name} allImages={allImages} />
                  </motion.div>
                )}
              </div>
            ) : (
              <MasonryGrid images={simpleImages} companyName={company.name} allImages={allImages} animated />
            )}
          </motion.section>

          {/* CTA */}
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

/* ─── Masonry Grid ─── */

function MasonryGrid({ images, companyName, allImages, animated }: { images: string[]; companyName: string; allImages: string[]; animated?: boolean }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((imgUrl: string) => {
    const idx = allImages.indexOf(imgUrl);
    setLightboxIndex(idx >= 0 ? idx : 0);
  }, [allImages]);

  if (images.length === 0) {
    return <p className="text-muted-foreground text-sm italic">No designs yet.</p>;
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((img, i) => {
          const card = (
            <div
              key={img + i}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => openLightbox(img)}
            >
              <div className="relative overflow-hidden rounded-xl bg-muted transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/10">
                <img
                  src={img}
                  alt={`${companyName} design ${i + 1}`}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          );

          if (animated) {
            return (
              <motion.div
                key={img + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="break-inside-avoid"
              >
                <div
                  className="group cursor-pointer"
                  onClick={() => openLightbox(img)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-muted transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/10">
                    <img
                      src={img}
                      alt={`${companyName} design ${i + 1}`}
                      loading="lazy"
                      className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </motion.div>
            );
          }

          return card;
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={allImages}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Lightbox ─── */

function Lightbox({ images, index, onClose, onNavigate }: {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const prev = () => onNavigate(index === 0 ? images.length - 1 : index - 1);
  const next = () => onNavigate(index === images.length - 1 ? 0 : index + 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-foreground transition-colors">
        <X className="w-5 h-5" />
      </button>

      {/* Nav prev */}
      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 md:left-8 z-10 w-10 h-10 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Image */}
      <motion.img
        key={images[index]}
        src={images[index]}
        alt={`Preview ${index + 1}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Nav next */}
      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 md:right-8 z-10 w-10 h-10 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-foreground transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-muted-foreground bg-muted/80 px-4 py-1.5 rounded-full">
        {index + 1} / {images.length}
      </div>
    </motion.div>
  );
}

export default CompanyShowcase;
