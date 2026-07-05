"use client";

import { ArrowRight, Eye } from "lucide-react";
import Image from "next/image";

export function ReviewsHero() {
  return (
    <section className="relative h-screen overflow-hidden bg-bg">
      {/* Background image — full-bleed */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/review-hero.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          REVIEWS
        </h1>
        <p className="mb-8 font-mono text-sm text-white/80">
          Are people satisfied with my service ?
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#reviews-grid"
            className="flex items-center justify-center gap-2 rounded-none bg-white px-6 py-3 font-mono text-sm font-medium text-black transition-opacity duration-200 hover:opacity-90"
          >
            <Star className="h-4 w-4" strokeWidth={2} fill="currentColor" />
            SEE REVIEWS
          </a>
          <a
            href="/portfolio"
            className="flex items-center justify-center gap-2 rounded-none border border-white/30 bg-transparent px-6 py-3 font-mono text-sm font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/5"
          >
            <Eye className="h-4 w-4" strokeWidth={2} />
            VIEW PROJECTS
          </a>
        </div>
      </div>
    </section>
  );
}

function Star({ className, strokeWidth, fill }: { className?: string; strokeWidth?: number; fill?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={fill || "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth || 2}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="12 2 15.09 10.26 24 10.35 17.55 16.54 19.64 24.83 12 19.77 4.36 24.83 6.45 16.54 0 10.35 8.91 10.26 12 2" />
    </svg>
  );
}
