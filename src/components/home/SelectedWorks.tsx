import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LazyImage } from "@/components/LazyImage";
import { Button } from "@/components/ui/button";
import { companies } from "@/data/companies";
import { useInView } from "@/hooks/useInView";
import { ArrowRight } from "lucide-react";

const gridConfigs = [
  { col: "md:col-span-7 md:row-span-2", height: "h-[400px] md:h-[580px]" },
  { col: "md:col-span-5", height: "h-[280px]" },
  { col: "md:col-span-5", height: "h-[280px]" },
  { col: "md:col-span-8", height: "h-[350px]" },
  { col: "md:col-span-4", height: "h-[350px]" },
];

export function SelectedWorks() {
  const { ref, isInView } = useInView();
  const featured = companies.filter((c) => c.featured).slice(0, 5);

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            Selected <span className="text-primary">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {featured.map((company, i) => {
            const config = gridConfigs[i];
            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={config.col}
              >
                <Link to={`/clients/${company.slug}`} className="group block relative overflow-hidden rounded-lg h-full">
                  <div className={`relative ${config.height}`}>
                    <LazyImage
                      src={company.featuredImage}
                      alt={company.name}
                      className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                      fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2 font-display">{company.category}</p>
                      <h3 className="text-xl md:text-2xl font-display font-bold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {company.shortDescription}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary/20">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Button variant="heroOutline" size="lg" asChild>
            <Link to="/clients">
              View Portfolio <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
