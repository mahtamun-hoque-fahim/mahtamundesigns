import { logoStripItems } from "@/data/companies";

export function LogoStrip() {
  const doubled = [...logoStripItems, ...logoStripItems];

  return (
    <section className="py-20 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-6 mb-10">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground font-display">
          Trusted by Rising Brands of Bangladesh
        </p>
      </div>
      <div className="relative">
        <div className="logo-strip-scroll flex items-center gap-16 w-max">
          {doubled.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="flex-shrink-0 w-24 h-12 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-300"
            >
              <img
                src={item.logo}
                alt={item.name}
                loading="lazy"
                className="max-w-full max-h-full object-contain brightness-0 invert opacity-70"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
