"use client";

import Link from "next/link";
import { ExternalLink, ImageOff, ChevronDown } from "lucide-react";
import { ClientData } from "@/lib/clients";

type PortfolioProject = {
  id: string;
  title: string;
  projectType: string;
  href: string;
  thumbnail: string | null;
};

function toProject(c: ClientData): PortfolioProject {
  return {
    id:          c.slug,
    title:       c.name,
    projectType: c.label,
    href:        `/clients/${c.slug}`,
    thumbnail:   c.gallery[0]?.image ?? null,
  };
}

function getColSpan(index: number): string {
  return index % 3 === 2 ? "md:col-span-2" : "";
}
function getMinHeight(index: number): string {
  return index % 3 === 2 ? "min-h-[420px]" : "min-h-[300px]";
}

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const isFullWidth = index % 3 === 2;
  return (
    <Link
      href={project.href}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-none border border-line bg-surface transition-all duration-300 hover:border-white/20 ${getColSpan(index)} ${getMinHeight(index)}`}
    >
      {project.thumbnail ? (
        <div className="absolute inset-0">
          <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover brightness-75 grayscale transition-all duration-500 group-hover:brightness-100 group-hover:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_12px)]">
          <div className="flex flex-col items-center gap-2 text-white/20">
            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
            <span className="font-mono text-[10px] tracking-wider">THUMBNAIL PENDING</span>
          </div>
        </div>
      )}
      <span className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center text-white/50 transition-all duration-300 group-hover:text-white">
        <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="relative z-10 p-5 md:p-6">
        <p className="mb-1 font-mono text-[11px] tracking-wider text-accent">{project.projectType}</p>
        <h3 className={`font-display font-bold tracking-tight text-white ${isFullWidth ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>
          {project.title.toUpperCase()}
        </h3>
      </div>
    </Link>
  );
}

export function PortfolioGrid({ clients }: { clients: ClientData[] }) {
  const projects = clients.map(toProject);

  return (
    <section id="portfolio-grid" className="bg-bg px-6 py-16 md:px-10 md:py-20">
      {projects.length === 0 ? (
        <p className="text-center font-mono text-sm text-white/30">No projects yet.</p>
      ) : (
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
      <div className="mt-14 flex justify-center">
        <button type="button" className="inline-flex items-center gap-2 rounded-none border border-white/25 bg-transparent px-10 py-3.5 font-mono text-sm font-medium text-white transition-all duration-200 hover:border-white/50 hover:bg-white/5">
          See More
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
