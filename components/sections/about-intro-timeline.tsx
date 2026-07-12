import Image from "next/image";
import { Mail } from "lucide-react";

type Milestone = { year: string; title: string; description: string };

const DEFAULT_MILESTONES: Milestone[] = [
  { year: "2016", title: "Started Learning", description: "Started learning graphic design as a hobby while taking up web & Technology office applications and graphic design." },
  { year: "2018", title: "First Competition", description: "Completed a creative project for a design competition. Got recognized for bold logo of course community." },
  { year: "2020", title: "First Appearance", description: "Designed fresh logo for client website. Published case study on my e-portfolio page." },
  { year: "2022", title: "First Client", description: "Started working for a digital agency. Led brand identity projects for multiple clients." },
  { year: "2025", title: "First 10K", description: "Milestone in earnings crossed the first quarter — Top freelancer in the community." },
  { year: "2026", title: "Gaining Velocity", description: "Started selling services directly. First product design ideation complete with solid team and platform." },
];

export function AboutIntroTimeline({ milestones: propMilestones }: { milestones?: Milestone[] }) {
  const milestones = propMilestones && propMilestones.length > 0 ? propMilestones : DEFAULT_MILESTONES;

  return (
    <section className="isolate relative w-full overflow-hidden bg-bg py-16 md:py-20 lg:py-24" id="story">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about-intro-timeline-bg.webp"
          alt="About intro and timeline background"
          fill
          className="object-cover"
          quality={85}
        />
      </div>

      {/* 40% black overlay */}
      <div className="absolute inset-0 z-[1] bg-black/40" />

      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        {/* Intro Section */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
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

        {/* Timeline Section */}
        <div className="relative mt-20 md:mt-24">
          {/* Section heading */}
          <h3 className="border-b border-white/20 pb-6 text-center font-display text-3xl font-bold text-white md:text-4xl">
            HOW IT ALL STARTED
          </h3>

          {/* Center line */}
          <div className="absolute left-1/2 top-20 h-[calc(100%-80px)] w-0.5 -translate-x-1/2 bg-gradient-to-b from-accent via-accent to-transparent" />

          {/* Timeline items */}
          <div className="relative mt-16 space-y-12 md:space-y-16">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row md:items-start ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-4 md:gap-12`}
              >
                {/* Content + Year */}
                <div className="flex-1">
                  {/* Year - aligned based on position */}
                  <p
                    className={`mb-3 font-display text-base font-bold text-accent md:text-lg ${
                      index % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    {milestone.year}
                  </p>
                  {/* Message card */}
                  <div className="rounded-lg bg-surface px-6 py-5">
                    <h4 className="font-display text-xl font-bold text-white md:text-2xl">
                      {milestone.title}
                    </h4>
                    <p className="mt-3 text-sm text-white/70 md:text-base">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Center: Dot */}
                <div className="hidden flex-shrink-0 md:flex md:items-start md:pt-12">
                  <div className="h-5 w-5 rounded-full border-4 border-bg bg-accent" />
                </div>

                {/* Empty space for right side on left-content items */}
                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
