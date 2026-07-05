import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export function AboutHero() {
  return (
    <section className="isolate relative w-full overflow-hidden bg-bg pt-[88px]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about-bg.webp"
          alt="About page background"
          fill
          priority
          className="object-cover"
          quality={85}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 md:px-10">
        <div className="text-center">
          {/* Heading */}
          <h1 className="font-display text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            ABOUT ME
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base text-white/70 md:text-lg">
            You're interested about me ?
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center md:gap-6">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-none bg-white px-8 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-white/90"
            >
              <Mail size={18} />
              CONTACT
            </Link>
            <Link
              href="#story"
              className="inline-flex items-center gap-2 rounded-none border border-white/30 px-8 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-white hover:bg-white/5"
            >
              READ THE STORY
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
