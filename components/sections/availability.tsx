import Image from "next/image";
import { ExternalLink, ImageIcon } from "lucide-react";

type AvailabilityProps = {
  /**
   * Glow color as an "R, G, B" triplet string, e.g. "160, 83, 242".
   * This is the per-instance variable — each client/company page passes
   * its own accent here; the background image + structure stay identical.
   * Defaults to the site's own accent purple.
   */
  glow?: string;
};

const DEFAULT_GLOW = "187, 124, 255"; // --color-accent (#bb7cff)

export function Availability({ glow = DEFAULT_GLOW }: AvailabilityProps) {
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
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px]"
        style={{
          background: `radial-gradient(55% 100% at 50% 0%, rgba(${glow}, 0.9) 0%, rgba(${glow}, 0.45) 40%, transparent 75%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <AvailabilityCard quoteImage={QUOTE_IMAGE} />
      </div>
    </section>
  );
}

// TODO(dashboard): quote image is assigned per-instance from a curated pool
// of "secondary CTA quote" images maintained in the admin dashboard. Not
// wired yet — null renders a placeholder slot instead of guessing an asset.
const QUOTE_IMAGE: string | null = null;

function AvailabilityCard({ quoteImage }: { quoteImage: string | null }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col overflow-hidden bg-surface-light shadow-xl md:max-w-[1100px] md:flex-row">
      {/* Text — 45% */}
      <div className="flex flex-col justify-center gap-4 p-8 md:w-[45%] md:p-14">
        <p className="font-mono text-xs tracking-[0.2em] text-black/50">
          I&apos;M HERE TO SOLVE
        </p>
        <h2 className="font-display text-4xl font-bold leading-none tracking-tight text-ink md:text-5xl">
          THE PAIN
        </h2>
        <a
          href="#contact"
          className="mt-2 inline-flex w-fit items-center justify-center rounded-none bg-ink px-6 py-3 font-mono text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90"
        >
          DM NOW
        </a>
      </div>

      {/* Quote image — 55%, same bg as text side, image fills the column */}
      <div className="relative flex items-center justify-center p-8 md:w-[55%] md:p-12">
        <div className="relative h-56 w-full max-w-md rotate-3 border border-black/10 bg-white shadow-lg transition-transform duration-300 hover:rotate-0 md:h-64">
          <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-black/40">
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          </span>

          {quoteImage ? (
            <Image
              src={quoteImage}
              alt="Client quote"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
              <ImageIcon className="h-6 w-6 text-black/20" strokeWidth={1.5} />
              <p className="font-mono text-xs text-black/40">
                Quote image pending — assigned from dashboard
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
