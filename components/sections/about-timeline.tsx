export function AboutTimeline() {
  const milestones = [
    {
      year: "2016",
      title: "Started Learning",
      description:
        "Started learning graphic design as a hobby while taking up web & Technology office applications and graphic design.",
    },
    {
      year: "2018",
      title: "First Competition",
      description:
        "Completed a creative project for a design competition. Got recognized for bold logo of course community.",
    },
    {
      year: "2020",
      title: "First Appearance",
      description:
        "Designed fresh logo for client website. Published case study on my e-portfolio page.",
    },
    {
      year: "2022",
      title: "First Client",
      description:
        "Started working for a digital agency. Led brand identity projects for multiple clients.",
    },
    {
      year: "2025",
      title: "First 10K",
      description:
        "Milestone in earnings crossed the first quarter — Top freelancer in the community.",
    },
    {
      year: "2026",
      title: "Gaining Velocity",
      description:
        "Started selling services directly. First product design ideation complete with solid team and platform.",
    },
  ];

  return (
    <section className="relative w-full bg-bg py-20 md:py-24 lg:py-32">
      {/* Section heading */}
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <h2 className="border-b border-white/20 pb-6 text-center font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          HOW IT ALL STARTED
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative mt-16 md:mt-20">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-accent via-accent to-transparent" />

        {/* Timeline items */}
        <div className="mx-auto max-w-4xl space-y-12 px-6 md:px-10 md:space-y-16">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-12 md:gap-16">
              {/* Left: Card content */}
              <div className="flex-1 md:pr-12">
                <div className="rounded-lg bg-surface px-6 py-5">
                  <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                    {milestone.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/70 md:text-base">
                    {milestone.description}
                  </p>
                </div>
              </div>

              {/* Center: Dot on line */}
              <div className="flex flex-shrink-0 items-start justify-center pt-2">
                <div className="h-5 w-5 rounded-full border-4 border-bg bg-accent" />
              </div>

              {/* Right: Year label */}
              <div className="flex-1 md:pl-12">
                <p className="text-right font-display text-lg font-bold text-accent md:text-xl">
                  {milestone.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
