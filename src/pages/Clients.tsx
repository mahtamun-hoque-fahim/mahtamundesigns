import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { companies } from "@/data/companies";
import { LazyImage } from "@/components/LazyImage";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

const Clients = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              Our <span className="text-primary">Clients</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Brands we've had the pleasure of working with, creating lasting visual impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/clients/${company.slug}`}
                  className="group block bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <LazyImage
                      src={company.featuredImage}
                      alt={company.name}
                      className="w-full h-full"
                      fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-contain p-1 brightness-0 invert"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-lg">{company.name}</h3>
                        <p className="text-xs text-muted-foreground">{company.tagline}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{company.shortDescription}</p>
                    <div className="mt-4 flex items-center gap-2 text-primary text-sm font-display opacity-0 group-hover:opacity-100 transition-opacity">
                      View Project <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Clients;
