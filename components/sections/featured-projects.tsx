import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ImageOff } from "lucide-react";

type FeaturedProject = {
  title: string;
  projectType: string;
  href: string;
  thumbnail: string | null;
  featured?: boolean;
};

// Fallback shown when no featured clients exist in the database yet.
const PLACEHOLDER_PROJECTS: FeaturedProject[] = [
  { title: "Featured Project", projectType: "Brand Identity", href: "#", thumbnail: null },
  { title: "Project Two",      projectType: "Brand Identity", href: "#", thumbnail: null },
  { title: "Project Three",    projectType: "Brand Identity", href: "#", thumbnail: null },
];

function ProjectCard({
  project,
  className = "",
}: {
  project: FeaturedProject;
  className?: string;
}) {
  return (
    <Link
      href={project.href}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-white/20 ${className}`}
    >
      {/* Thumbnail: grayscale + dimmed by default, full color on hover.
          Logo/branding is baked into the thumbnail asset itself — not a separate overlay. */}
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

      <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-ink">
        <ExternalLink className="h-4 w-4" strokeWidth={2} />
      </span>

      <div className="relative z-10 p-6 md:p-8">
        <p className="mb-1 font-mono text-xs tracking-wider text-accent">
          {project.projectType}
        </p>
        <h3 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
          {project.title.toUpperCase()}
        </h3>
      </div>
    </Link>
  );
}

export function FeaturedProjects({ projects }: { projects?: FeaturedProject[] }) {
  const list = projects && projects.length > 0 ? projects : PLACEHOLDER_PROJECTS;
  const [featured, ...rest] = list;

  return (
    <section id="showcase" className="relative isolate overflow-hidden bg-black px-6 py-24 md:px-10 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0">
        <Image
          src="/images/featured-projects-bg.webp"
          alt=""
          width={1920}
          height={2485}
          priority={false}
          className="w-full h-auto object-cover object-top"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[420px] md:hidden"
        style={{
          background:
            "radial-gradient(100% 100% at 50% 100%, rgba(160,83,242,0.4), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-[420px] md:block"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, rgba(160,83,242,0.4), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-16 text-center">
          <p className="mb-2 font-mono text-xs tracking-[0.2em] text-accent">
            Showcase
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            FEATURED PROJECTS
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:px-12 xl:px-24">
          <ProjectCard project={featured} className="min-h-[377px] md:min-h-[481px] md:col-span-2" />
          {rest.map((project) => (
            <ProjectCard key={project.title} project={project} className="min-h-[377px]" />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/portfolio"
            className="flex items-center gap-2 rounded-none bg-white px-7 py-3.5 font-mono text-sm font-medium text-ink shadow-[0_0_50px_rgba(187,124,255,0.35)] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_70px_rgba(187,124,255,0.5)]"
          >
            SEE ALL
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
