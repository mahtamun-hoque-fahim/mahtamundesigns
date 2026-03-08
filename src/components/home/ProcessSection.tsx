import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useCms } from "@/hooks/useSiteContent";
import { useEffect, useState } from "react";

const steps = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "We discuss your brand vision, target audience, and project goals to create a clear creative brief.",
  },
  {
    num: "02",
    title: "Research & Concepts",
    desc: "Deep dive into your industry, competitors, and audience. Then craft initial design concepts.",
  },
  {
    num: "03",
    title: "Design & Refine",
    desc: "Develop the chosen direction with revisions until every detail is perfect for your brand.",
  },
  {
    num: "04",
    title: "Final Delivery",
    desc: "Receive all files, brand guidelines, and assets ready for immediate use across all platforms.",
  },
];

function TimelineLine({ isInView }: { isInView: boolean }) {
  const progress = useMotionValue(0);
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (isInView) {
      animate(progress, 1, { duration: 1.8, ease: "easeOut", delay: 0.3 });
    }
  }, [isInView, progress]);

  return (
    <div className="absolute top-[18px] left-[calc(12.5%+10px)] right-[calc(12.5%+10px)] h-px hidden md:block">
      <div className="w-full h-full bg-border/40" />
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60"
        style={{ width }}
      />
    </div>
  );
}

function StepNode({
  step,
  index,
  isInView,
}: {
  step: (typeof steps)[0];
  index: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.2, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center text-center relative z-10 group flex-1"
    >
      {/* Number circle */}
      <motion.div
        animate={hovered ? { boxShadow: "0 0 20px 4px hsl(var(--primary) / 0.35)" } : { boxShadow: "0 0 0px 0px hsl(var(--primary) / 0)" }}
        transition={{ duration: 0.3 }}
        className="w-9 h-9 rounded-full border border-primary/40 bg-background flex items-center justify-center mb-5 transition-colors duration-300 group-hover:border-primary/70"
      >
        <span className="font-display text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors duration-300">
          {step.num}
        </span>
      </motion.div>

      {/* Title */}
      <h3 className="font-display font-semibold text-base mb-2 text-foreground/90 group-hover:text-foreground transition-colors duration-300">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
        {step.desc}
      </p>
    </motion.div>
  );
}

/* Mobile vertical timeline */
function MobileStep({
  step,
  index,
  isInView,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isInView: boolean;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.3 + index * 0.15 }}
      className="flex gap-5 group"
    >
      {/* Node + line */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full border border-primary/40 bg-background flex items-center justify-center shrink-0">
          <span className="font-display text-xs font-semibold text-primary/80">{step.num}</span>
        </div>
        {!isLast && <div className="w-px flex-1 bg-border/40 mt-2" />}
      </div>

      {/* Content */}
      <div className="pb-8">
        <h3 className="font-display font-semibold text-base mb-1 text-foreground/90">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

export function ProcessSection() {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const c = useCms();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-display mb-4">
            {c("home", "process", "eyebrow", "How It Works")}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4 text-foreground">
            {c("home", "process", "title", "Simple. Transparent. Effective.")}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
            {c("home", "process", "subtitle", "A proven 4-step process that turns your ideas into a brand you're proud of.")}
          </p>
        </motion.div>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:flex relative items-start">
          <TimelineLine isInView={isInView} />
          {steps.map((step, i) => (
            <StepNode key={i} step={step} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden pl-2">
          {steps.map((step, i) => (
            <MobileStep key={i} step={step} index={i} isInView={isInView} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
