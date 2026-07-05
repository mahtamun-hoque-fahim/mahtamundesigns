import Image from "next/image";
import { Mail } from "lucide-react";

export function AboutIntro() {
  return (
    <section className="isolate relative w-full overflow-hidden bg-bg py-16 md:py-20 lg:py-24">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/featured-projects-bg.webp"
          alt="Intro section background"
          fill
          className="object-cover"
          quality={85}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-10 lg:flex-row lg:items-center lg:gap-16">
        {/* Left: Portrait */}
        <div className="flex-shrink-0 lg:w-2/5">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src="/images/face.webp"
              alt="Mahtamun portrait"
              fill
              className="object-cover"
              quality={90}
            />
          </div>
        </div>

        {/* Right: Bio */}
        <div className="flex flex-col gap-6 lg:w-3/5">
          {/* Heading */}
          <div>
            <h2 className="font-display text-4xl font-bold text-accent md:text-5xl">
              MAHTAMUN
            </h2>
            <p className="mt-2 text-sm text-white/70 md:text-base">
              B.Sc. in CSE Student | Aspiring Full-Stack Developer
            </p>
          </div>

          {/* Bio paragraphs */}
          <div className="space-y-4 text-white/80">
            <p className="leading-relaxed">
              Motivated second-semester Computer Science student passionate about building intuitive and impactful web experiences. Currently strengthening his foundation in CS while actively developing real projects using web dev technologies.
            </p>
            <p className="leading-relaxed">
              Beyond academics, he works as a lead designer — blending creativity with technology to craft engaging visuals and occasionally, clean UIs.
            </p>
            <p className="leading-relaxed">
              Curious, ambitious, and always shipping something new. He is eager to collaborate with developers, mentors, and innovators who want to build the future of the web.
            </p>
            <p className="leading-relaxed">
              If you're building something exciting, let's connect — I'd love to learn and grow, together.
            </p>
          </div>

          {/* Email link */}
          <a
            href="mailto:mahtamunhoquefahim@gmail.com"
            className="inline-flex items-center gap-2 text-accent transition-colors duration-200 hover:text-accent-dim"
          >
            <Mail size={18} />
            <span className="text-sm font-medium">mahtamunhoquefahim@gmail.com</span>
          </a>
        </div>
      </div>
    </section>
  );
}
