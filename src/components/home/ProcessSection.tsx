import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useCms } from "@/hooks/useSiteContent";

export function ProcessSection() {
  const { ref, isInView } = useInView();
  const c = useCms();

  const steps = [
    {
      num: "01",
      title: c('home', 'process', 'step_1_title', 'Discovery Call'),
      desc: c('home', 'process', 'step_1_desc', 'We discuss your brand vision, target audience, and project goals to create a clear creative brief.'),
    },
    {
      num: "02",
      title: c('home', 'process', 'step_2_title', 'Research & Concepts'),
      desc: c('home', 'process', 'step_2_desc', 'Deep dive into your industry, competitors, and audience. Then craft initial design concepts.'),
    },
    {
      num: "03",
      title: c('home', 'process', 'step_3_title', 'Design & Refine'),
      desc: c('home', 'process', 'step_3_desc', 'Develop the chosen direction with revisions until every detail is perfect for your brand.'),
    },
    {
      num: "04",
      title: c('home', 'process', 'step_4_title', 'Final Delivery'),
      desc: c('home', 'process', 'step_4_desc', 'Receive all files, brand guidelines, and assets ready for immediate use across all platforms.'),
    },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-display mb-4">
            {c('home', 'process', 'eyebrow', 'How It Works')}
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
            {c('home', 'process', 'title', 'Simple. Transparent. Effective.')}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {c('home', 'process', 'subtitle', 'A proven 4-step process that turns your ideas into a brand you\'re proud of.')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-20 h-20 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="font-display font-bold text-primary text-lg">{step.num}</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
