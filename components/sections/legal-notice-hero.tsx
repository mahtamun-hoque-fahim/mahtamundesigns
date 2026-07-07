import { Scale } from "lucide-react";

export function LegalNoticeHero() {
  return (
    <section className="relative h-screen overflow-hidden bg-bg isolate">
      {/* CSS radial glow — no image, intentionally stark for a legal page */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 52%, rgba(187,124,255,0.12) 0%, rgba(187,124,255,0.04) 45%, transparent 70%)",
        }}
      />

      {/* Very faint horizontal grid lines for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 80px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Icon mark */}
        <div className="mb-6 flex h-12 w-12 items-center justify-center border border-accent/30 bg-accent/10">
          <Scale className="h-5 w-5 text-accent" strokeWidth={1.5} />
        </div>

        {/* Law reference label */}
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-accent">
          Bangladesh Copyright Act, 2000
        </p>

        {/* Main heading */}
        <h1 className="mb-4 font-display text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
          LEGAL NOTICE
        </h1>

        {/* Divider */}
        <div className="mb-6 h-px w-16 bg-accent/40" />

        {/* Subtitle */}
        <p className="max-w-md font-mono text-sm leading-relaxed text-white/50 md:text-base">
          All original works on this site are protected by law.
          <br />
          Unauthorized use will be prosecuted.
        </p>

        {/* Scroll anchor CTA */}
        <a
          href="#legal-content"
          className="mt-10 flex items-center justify-center gap-2 rounded-none border border-white/20 bg-transparent px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:border-accent/60 hover:text-accent"
        >
          Read the full notice
        </a>
      </div>
    </section>
  );
}
