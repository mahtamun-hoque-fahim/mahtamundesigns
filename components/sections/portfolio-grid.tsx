"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ImageOff, ChevronDown } from "lucide-react";
import { CLIENTS } from "@/lib/clients";

// Single source of truth — portfolio cards are derived directly from CLIENTS.
// Dashboard creates one entry → card appears here AND /clients/[slug] page exists.
// No manual wiring ever needed.
const PORTFOLIO_PROJECTS = Object.values(CLIENTS).map((c) => ({
  id:          c.slug,
  title:       c.name,
  projectType: c.label,
  href:        `/clients/${c.slug}`,
  thumbnail:   c.gallery[0]?.image ?? null,
}));

type PortfolioProject = (typeof PORTFOLIO_PROJECTS)[number];
//   index % 3 === 0 → col-span-1 (left half of equal pair)
//   index % 3 === 1 → col-span-1 (right half of equal pair)
//   index % 3 === 2 → col-span-2 (full-width covering card)
// Pattern repeats: [half][half][full][half][half][full]...
function getColSpan(index: number): string {
  return index % 3 === 2 ? "md:col-span-2" : "";
}

function getMinHeight(index: number): string {
  return index % 3 === 2 ? "min-h-[420px]" : "min-h-[300px]";
}

function ProjectCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  const isFullWidth = index % 3 === 2;

  return (
    <Link
      href={project.href}
      className={`
        group relative flex flex-col justify-end overflow-hidden rounded-none
        border border-line bg-surface
        transition-all duration-300 hover:border-white/20
        ${getColSpan(index)} ${getMinHeight(index)}
      `}
    >
      {/* Thumbnail */}
      {project.thumbnail ? (
        <div className="absolute inset-0">
          <Image
            src={project.thumbnail}
            alt={`${project.title} thumbnail`}
            fill
            className="object-cover object-center grayscale brightness-75 transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_12px)]">
          <div className="flex flex-col items-center gap-2 text-white/20">
            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
            <span className="font-mono text-[10px] tracking-wider">
              THUMBNAIL PENDING
            </span>
          </div>
        </div>
      )}

      {/* External link icon — top-right */}
      <span className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center text-white/50 transition-all duration-300 group-hover:text-white">
        <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
      </span>

      {/* Card text — bottom-left */}
      <div className="relative z-10 p-5 md:p-6">
        <p className="mb-1 font-mono text-[11px] tracking-wider text-accent">
          {project.projectType}
        </p>
        <h3
          className={`font-display font-bold tracking-tight text-white ${
            isFullWidth ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
          }`}
        >
          {project.title.toUpperCase()}
        </h3>
      </div>
    </Link>
  );
}

export function PortfolioGrid() {
  return (
    <section
      id="portfolio-grid"
      className="bg-bg px-6 py-16 md:px-10 md:py-20"
    >
      {/* Grid — 2-col desktop, 1-col mobile */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {PORTFOLIO_PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* See More — TODO(dashboard): triggers load-more or pagination */}
      <div className="mt-14 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-none border border-white/25 bg-transparent px-10 py-3.5 font-mono text-sm font-medium text-white transition-all duration-200 hover:border-white/50 hover:bg-white/5"
        >
          See More
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
