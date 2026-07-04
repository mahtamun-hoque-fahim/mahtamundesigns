import Image from "next/image";
import { ExternalLink, UserRound } from "lucide-react";

type SecondaryCtaProps = {
  /**
   * Glow color as an "R, G, B" triplet string, e.g. "160, 83, 242".
   * This is the per-instance variable — each client/company page passes
   * its own accent here; the background image + structure stay identical.
   * Defaults to the site's own accent purple.
   */
  glow?: string;
  /**
   * The full content set for this page's Secondary CTA Section Card —
   * Secondary Quotes (eyebrow, heading, button) + Secondary Motivation
   * (name, role, quote, avatar), bundled as one unit.
   *
   * TODO(dashboard): multiple sets will exist. Each page's Secondary CTA
   * Section Card gets exactly one set assigned to it from the admin
   * dashboard — this component is reused across many pages, only the
   * set changes. Defaults to the homepage's own set below.
   */
  set?: SecondaryCtaSet;
};

type SecondaryMotivation = {
  name: string | null;
  role: string | null;
  quote: string | null;
  avatar: string | null;
};

type SecondaryCtaSet = {
  eyebrow: string | null;
  heading: string | null;
  buttonLabel: string | null;
  buttonHref: string | null;
  motivation: SecondaryMotivation;
};

const DEFAULT_GLOW = "187, 124, 255"; // --color-accent (#bb7cff)

// Homepage's own set — real, approved copy, not a dashboard placeholder.
// Once the dashboard exists, this becomes one named set among several,
// each assigned to a specific page's Secondary CTA Section Card.
const HOME_SET: SecondaryCtaSet = {
  eyebrow: "I'M HERE TO SOLVE",
  heading: "THE PAIN",
  buttonLabel: "DM NOW",
  buttonHref: "#contact",
  motivation: {
    name: null,
    role: null,
    quote: null,
    avatar: null,
  },
};

export function SecondaryCta({
  glow = DEFAULT_GLOW,
  set = HOME_SET,
}: SecondaryCtaProps) {
  return (
    <section className="relative isolate overflow-hidden bg-bg py-24 md:py-32">
      {/* Pattern texture — dedicated asset for this section, colorless by design */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/images/secondary-cta-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      />

      {/* Tint layer — recolors the pattern via CSS blend mode "color",
          keeping the image's own luminosity/fade-to-black intact. This is
          the per-instance variable: same asset, different hue per client. */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundColor: `rgb(${glow})`,
          mixBlendMode: "color",
        }}
      />

      {/* Glow — pure CSS, not baked into the image, primary accent color only.
          Brightness comes from opacity falloff at the core, not from mixing
          in white — keeps it reading as an accent-colored light, not a
          washed-out blob. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[320px]"
        style={{
          background: `radial-gradient(35% 100% at 50% 0%, rgba(${glow}, 0.9) 0%, rgba(${glow}, 0.45) 40%, transparent 75%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <SecondaryCtaCard set={set} />
      </div>
    </section>
  );
}

function SecondaryCtaCard({ set }: { set: SecondaryCtaSet }) {
  const { motivation } = set;

  return (
    <div className="mx-auto flex max-w-3xl flex-col overflow-hidden bg-surface-light shadow-xl md:max-w-[1100px] md:flex-row">
      {/* Secondary Quotes — left on desktop, second on mobile */}
      <div className="order-2 flex flex-col justify-center gap-4 p-8 md:order-none md:w-[45%] md:p-14">
        <p className="font-mono text-xs tracking-[0.2em] text-black/50">
          {set.eyebrow ?? "Eyebrow pending"}
        </p>
        <h2 className="font-display text-4xl font-bold leading-none tracking-tight text-ink md:text-5xl">
          {set.heading ?? "Heading pending"}
        </h2>
        <a
          href={set.buttonHref ?? "#"}
          className="mt-2 inline-flex w-fit items-center justify-center rounded-none bg-ink px-6 py-3 font-mono text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90"
        >
          {set.buttonLabel ?? "Button pending"}
        </a>
      </div>

      {/* Secondary Motivation — right on desktop, first on mobile, cropped by the column */}
      <div className="relative order-1 flex items-center justify-center overflow-hidden p-8 md:order-none md:w-[55%] md:p-12">
        <div className="relative w-full max-w-md rotate-3 border border-black/10 bg-white p-6 shadow-lg transition-transform duration-300 hover:rotate-0 md:p-7">
          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-black/40">
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          </span>

          <div className="mb-4 flex items-center gap-3 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/5 text-black/30">
              {motivation.avatar ? (
                <Image
                  src={motivation.avatar}
                  alt={motivation.name ?? "Client"}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <UserRound className="h-6 w-6" strokeWidth={1.5} />
              )}
            </div>
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-tight text-ink">
                {motivation.name ?? "Client Name"}
              </p>
              <p className="font-mono text-xs text-black/50">
                {motivation.role ?? "Role, Company"}
              </p>
            </div>
          </div>

          <p className="font-mono text-xs leading-relaxed text-black/70">
            {motivation.quote ??
              "This quote is pending — content will be assigned from the dashboard."}
          </p>
        </div>
      </div>
    </div>
  );
}
