import Image from "next/image";
import Link from "next/link";
import { Briefcase, Mail } from "lucide-react";

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex h-screen flex-col justify-center overflow-hidden bg-bg"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.webp"
          alt=""
          fill
          priority
          className="object-cover object-right md:object-center"
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col justify-center px-6 md:pl-20 md:pr-10 lg:pl-28">
        <div className="flex w-full translate-y-2 flex-col items-start justify-center md:max-w-lg md:translate-y-6">
          <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-8xl">
            MAHTAMUN
          </h1>

          <p className="mt-3 text-base text-white/70 md:mt-4 md:text-lg">
            Lead Designer @interting.digital
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
            <Link
              href="#showcase"
              className="flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-white/90"
            >
              <Briefcase className="h-4 w-4" strokeWidth={2} />
              PORTFOLIO
            </Link>
            <Link
              href="#contact"
              className="flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/5"
            >
              <Mail className="h-4 w-4" strokeWidth={2} />
              CONTACT
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[46%] md:block">
        <Image
          src="/images/hero-portrait.webp"
          alt="Mahtamun Hoque Fahim, Lead Designer"
          fill
          priority
          className="object-contain object-bottom"
        />
      </div>
    </section>
  );
}
