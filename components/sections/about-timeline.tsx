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
        <h2 className="text-center font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          HOW IT ALL STARTED
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative mt-20 md:mt-24">
        {/* Center line (desktop only) */}
        <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-accent via-accent to-transparent md:block" />

        {/* Timeline items */}
        <div className="mx-auto max-w-5xl space-y-12 px-6 md:px-10 md:space-y-16">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row md:items-center ${
                index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 md:gap-12`}
            >
              {/* Left/Right content container */}
              <div className="flex-1 md:text-right">
                <p className="text-sm font-medium text-accent md:text-base">
                  {milestone.year}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
                  {milestone.title}
                </h3>
                <p className="mt-3 text-base text-white/70 md:text-sm">
                  {milestone.description}
                </p>
              </div>

              {/* Timeline dot */}
              <div className="hidden flex-shrink-0 md:flex md:h-5 md:w-5 md:items-center md:justify-center">
                <div className="h-5 w-5 rounded-full border-4 border-bg bg-accent" />
              </div>

              {/* Mobile connector (small line above dot) */}
              <div className="flex md:hidden h-6 w-0.5 -translate-x-1/2 translate-y-0 bg-accent md:hidden" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
