type AvailabilityProps = {
  /**
   * Glow color as an "R, G, B" triplet string, e.g. "160, 83, 242".
   * This is the per-instance variable — each client/company page passes
   * its own accent here; the background image + structure stay identical.
   * Defaults to the site's own accent purple.
   */
  glow?: string;
};

const DEFAULT_GLOW = "160, 83, 242"; // matches --color-accent family used elsewhere

export function Availability({ glow = DEFAULT_GLOW }: AvailabilityProps) {
  return (
    <section className="relative isolate overflow-hidden bg-bg py-24 md:py-32">
      {/* Pattern texture — same asset/treatment as Featured Projects, colorless */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.15]"
        style={{
          backgroundImage: "url(/images/featured-projects-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      />

      {/* Top glow blob — this is the variable-colored layer */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px]"
        style={{
          background: `radial-gradient(60% 100% at 50% 0%, rgba(${glow}, 0.55), transparent 70%)`,
        }}
      />

      {/* Full-section tint wash so the color reads at the edges too, not just the blob */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `linear-gradient(180deg, rgba(${glow}, 0.10) 0%, rgba(${glow}, 0.22) 55%, rgba(0,0,0,0.92) 100%)`,
        }}
      />

      {/* TODO: CTA card + tilted testimonial content — next pass */}
      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1400px] items-center justify-center px-6 md:px-10">
        <p className="font-mono text-sm text-muted">
          Availability Section — background locked, content pending
        </p>
      </div>
    </section>
  );
}
