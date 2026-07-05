import { ClientData } from "@/lib/clients";
import { Star } from "lucide-react";

type Props = { client: ClientData };

export function ClientAbout({ client }: Props) {
  const { accentColor, about, role, timeline, type, contributions, rating, stats } = client;

  return (
    <section className="bg-bg px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

        {/* ── Left: About + Stats ──────────────────────────────── */}
        <div className="flex flex-col justify-between gap-10">
          <div>
            <h2 className="mb-5 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              ABOUT
            </h2>
            <p className="font-mono text-sm leading-relaxed text-white/60">
              {about}
            </p>
          </div>

          {/* Mini stats bar */}
          <div className="flex items-center gap-8 border-t border-line pt-8">
            <Stat value={stats.years} label="Years" accentColor={accentColor} />
            <div className="h-10 w-px bg-line" />
            <Stat value={stats.designs} label="Designs" accentColor={accentColor} />
            <div className="h-10 w-px bg-line" />
            <Stat value={stats.projects} label="Project" accentColor={accentColor} />
          </div>
        </div>

        {/* ── Right: At a Glance card ──────────────────────────── */}
        <div
          className="rounded-none border bg-surface p-6 md:p-8"
          style={{ borderColor: accentColor }}
        >
          {/* Card heading */}
          <h3
            className="mb-6 font-mono text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: accentColor }}
          >
            At a Glance
          </h3>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            <GlanceRow label="Role:" accentColor={accentColor}>
              <div className="flex flex-col gap-0.5">
                {role.map((r) => (
                  <span key={r} className="font-mono text-sm text-white/80">
                    {r}
                  </span>
                ))}
              </div>
            </GlanceRow>

            <GlanceRow label="Timeline:" accentColor={accentColor}>
              <span className="font-mono text-sm text-white/80">{timeline}</span>
            </GlanceRow>

            <GlanceRow label="Type:" accentColor={accentColor}>
              <span className="font-mono text-sm text-white/80">{type}</span>
            </GlanceRow>

            {/* Contributions */}
            <div className="mt-2 flex flex-col gap-3">
              <span
                className="inline-block w-fit rounded-none px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-black"
                style={{ backgroundColor: accentColor }}
              >
                Contributions:
              </span>
              <ul className="flex flex-col gap-1.5 pl-1">
                {contributions.map((c) => (
                  <li key={c} className="font-mono text-sm text-white/70">
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-3 border-t border-line pt-4">
              <span
                className="rounded-none px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-black"
                style={{ backgroundColor: accentColor }}
              >
                Rating:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold text-white">
                  {rating}
                </span>
                <StarRating value={rating} color={accentColor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function GlanceRow({
  label,
  accentColor,
  children,
}: {
  label: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 shrink-0 rounded-none px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-black"
        style={{ backgroundColor: accentColor }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Stat({
  value,
  label,
  accentColor,
}: {
  value: number;
  label: string;
  accentColor: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="font-display text-3xl font-bold md:text-4xl"
        style={{ color: accentColor }}
      >
        {value}
      </span>
      <span className="font-mono text-xs text-white/50">{label}</span>
    </div>
  );
}

function StarRating({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          strokeWidth={1.5}
          style={{
            color,
            fill: i <= Math.floor(value) ? color : "transparent",
            opacity: i <= Math.ceil(value) ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
