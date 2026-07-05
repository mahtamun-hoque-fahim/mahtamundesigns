import Image from "next/image";
import { ClientData } from "@/lib/clients";
import { UserRound } from "lucide-react";

type Props = { client: ClientData };

export function ClientHero({ client }: Props) {
  const { name, tagline, logo, accentColor } = client;

  return (
    <section className="isolate relative h-screen w-full overflow-hidden bg-black">
      {/* ── Layer 1: background image ───────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/company-hero-bg.webp"
          alt=""
          fill
          priority
          className="object-cover"
          quality={90}
        />
      </div>

      {/* ── Layer 2: accent color overlay via mix-blend-mode: color ─
           Shifts the image's hue to the company's accent color.
           Same mechanism as secondary-cta.tsx glow layer.         */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: accentColor,
          mixBlendMode: "color",
        }}
      />

      {/* ── Layer 3: decorative UI elements ─────────────────────── */}

      {/* Document card — top-right */}
      <div
        className="absolute right-[8%] top-[12%] z-20 h-32 w-24 rotate-6 rounded-sm opacity-90 md:h-40 md:w-32"
        style={{ backgroundColor: "rgba(255,255,255,0.12)", border: `1.5px solid ${accentColor}` }}
      >
        {/* Simulated content lines */}
        <div className="flex flex-col gap-2 p-3 pt-4">
          {[70, 90, 55, 80, 60].map((w, i) => (
            <div
              key={i}
              className="h-[3px] rounded-full opacity-60"
              style={{ width: `${w}%`, backgroundColor: accentColor }}
            />
          ))}
        </div>
      </div>

      {/* Folder — bottom-right of center (matching reference position) */}
      <div
        className="absolute bottom-[22%] right-[28%] z-20 -rotate-6 md:right-[32%]"
      >
        <FolderShape color={accentColor} />
      </div>

      {/* Small card — left side */}
      <div
        className="absolute left-[6%] top-[38%] z-20 h-20 w-20 -rotate-12 rounded-full opacity-80 md:h-24 md:w-24"
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          border: `1.5px solid ${accentColor}`,
        }}
      >
        <div className="flex h-full items-center justify-center">
          <div
            className="h-7 w-7 rounded-full"
            style={{ backgroundColor: accentColor, opacity: 0.7 }}
          />
        </div>
      </div>

      {/* ── Layer 4: hero content ────────────────────────────────── */}
      <div className="relative z-30 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Logo + name + tagline lockup */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          {/* Circular logo */}
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 md:h-20 md:w-20"
            style={{ borderColor: accentColor, backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            {logo ? (
              <Image
                src={logo}
                alt={`${name} logo`}
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            ) : (
              <UserRound
                className="h-8 w-8 opacity-60"
                style={{ color: accentColor }}
                strokeWidth={1.5}
              />
            )}
          </div>

          {/* Name + tagline */}
          <div className="text-left">
            <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              {name.toUpperCase()}
            </h1>
            <p className="mt-1 font-mono text-sm" style={{ color: accentColor }}>
              {tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Folder SVG shape — accent-colored, matches reference */
function FolderShape({ color }: { color: string }) {
  return (
    <svg
      width="72"
      height="60"
      viewBox="0 0 72 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Folder tab */}
      <rect x="0" y="8" width="28" height="8" rx="4" fill={color} />
      {/* Folder body */}
      <rect x="0" y="14" width="72" height="46" rx="5" fill={color} />
    </svg>
  );
}
