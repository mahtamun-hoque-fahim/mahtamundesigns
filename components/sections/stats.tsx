type Stat = {
  value: string;
  label: string;
};

// TODO(dashboard): confirm these numbers are current — flagged in core.md
// as needing reconfirmation, not yet dashboard-wired.
const STATS: Stat[] = [
  { value: "6+", label: "Years" },
  { value: "600+", label: "Designs" },
  { value: "11", label: "Clients" },
  { value: "100%", label: "Satisfaction" },
];

export function Stats() {
  return (
    <section className="border-y border-line bg-bg-alt py-14 md:py-16">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-10 px-6 md:grid-cols-4 md:gap-y-0 md:px-10">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-4xl font-bold text-accent md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 font-mono text-sm text-muted md:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
