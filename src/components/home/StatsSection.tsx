import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";

const stats = [
  { value: 6, suffix: "+", label: "Years Experience" },
  { value: 600, suffix: "+", label: "Designs Created" },
  { value: 11, suffix: "", label: "Happy Clients" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

function StatItem({ value, suffix, label, isInView, delay }: {
  value: number;
  suffix: string;
  label: string;
  isInView: boolean;
  delay: number;
}) {
  const count = useCountUp(value, 2000, isInView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary">
        {count}{suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground uppercase tracking-wider font-display">{label}</p>
    </motion.div>
  );
}

export function StatsSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} isInView={isInView} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
