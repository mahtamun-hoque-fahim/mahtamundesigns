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

      {/* ── Layer 3: hero content ────────────────────────────────── */}
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


