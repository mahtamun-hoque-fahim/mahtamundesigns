import { useLogoStrip } from "@/hooks/useLogoStrip";
import { useCms } from "@/hooks/useSiteContent";

export function LogoStrip() {
  const items = useLogoStrip();
  const c = useCms();
  // Need at least enough to fill the strip visually - double for seamless scroll
  const doubled = [...items, ...items];

  if (items.length === 0) return null;

  return (
    <section className="py-20 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-6 mb-10">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground font-display">
          {c('home', 'logostrip', 'title', 'Trusted by Rising Brands of Bangladesh')}
        </p>
      </div>
      <div className="relative">
        <div className="logo-strip-scroll flex items-center gap-16 w-max">
          {doubled.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="flex-shrink-0 w-24 h-12 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-300"
            >
              {item.logo_url ? (
                <img
                  src={item.logo_url}
                  alt={item.name}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain brightness-0 invert opacity-70"
                />
              ) : (
                <div className="w-16 h-8 rounded bg-muted-foreground/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
