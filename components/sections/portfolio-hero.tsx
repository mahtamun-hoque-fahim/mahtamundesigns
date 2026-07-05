import Image from "next/image";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

export function PortfolioHero() {
  return (
    <section className="isolate relative h-screen w-full overflow-hidden bg-bg">
      {/* Background image — full-bleed */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/portfolio-hero.webp"
          alt="Portfolio page background — designer at laptop with tribal pattern"
          fill
          priority
          className="object-cover"
          quality={90}
        />
      </div>

      {/* Content — centered vertically and horizontally */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Heading */}
        <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          PORTFOLIO
        </h1>

        {/* Subtitle */}
        <p className="mt-3 font-mono text-sm text-white/70 md:text-base">
          Memory for me, a checklist for you
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="#portfolio-grid"
            className="inline-flex items-center justify-center gap-2 rounded-none border border-white/40 bg-transparent px-7 py-3 font-mono text-sm font-medium text-white transition-all duration-200 hover:border-white/70 hover:bg-white/5"
          >
            <FolderOpen size={16} strokeWidth={2} />
            VIEW PROJECTS
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center gap-2 rounded-none border border-white/40 bg-transparent px-7 py-3 font-mono text-sm font-medium text-white transition-all duration-200 hover:border-white/70 hover:bg-white/5"
          >
            <StarIcon className="h-4 w-4" />
            SEE REVIEWS
          </Link>
        </div>
      </div>
    </section>
  );
}

/* Inline star — filled, consistent with reviews-hero pattern */
function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="12 2 15.09 10.26 24 10.35 17.55 16.54 19.64 24.83 12 19.77 4.36 24.83 6.45 16.54 0 10.35 8.91 10.26 12 2" />
    </svg>
  );
}
