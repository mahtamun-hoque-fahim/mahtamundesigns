"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const LOGOS: Logo[] = [
  { src: "/logos/acs.webp", alt: "ACS", width: 297, height: 120 },
  { src: "/logos/fahads-tutorial.webp", alt: "Fahad's Tutorial", width: 332, height: 120 },
  { src: "/logos/interting.webp", alt: "Interting", width: 105, height: 120 },
  { src: "/logos/privatune.webp", alt: "Privatune", width: 313, height: 120 },
  { src: "/logos/apars.webp", alt: "Apars", width: 554, height: 121 },
  { src: "/logos/aimers-academy.webp", alt: "Aimers Academy", width: 398, height: 120 },
  { src: "/logos/chemshifu.webp", alt: "Chemshifu", width: 353, height: 120 },
  { src: "/logos/motovessel.webp", alt: "Motovessel", width: 624, height: 120 },
  { src: "/logos/pi-to-infinity.webp", alt: "Pi to Infinity", width: 394, height: 120 },
  { src: "/logos/tradefigur.webp", alt: "Tradefigur", width: 383, height: 120 },
  { src: "/logos/coxmc-original.webp", alt: "Cox's Bazar Medical College", width: 122, height: 120 },
  { src: "/logos/coxmc-ds.webp", alt: "CoXMC Debating Society", width: 120, height: 120 },
  { src: "/logos/apars-classroom.webp", alt: "Apars Classroom", width: 415, height: 120 },
  { src: "/logos/abrotune.webp", alt: "Abrotune", width: 287, height: 120 },
  { src: "/logos/sulphuric-bench.webp", alt: "Sulphuric Bench", width: 366, height: 120 },
  { src: "/logos/lobdhi.webp", alt: "Lobdhi", width: 331, height: 120 },
  { src: "/logos/apurba-physics.webp", alt: "Apurba Physics", width: 152, height: 120 },
  { src: "/logos/arunodoy45.webp", alt: "Arunodoy45", width: 154, height: 120 },
  { src: "/logos/bbu.webp", alt: "BBU", width: 154, height: 120 },
  { src: "/logos/cg.webp", alt: "CG", width: 420, height: 120 },
  { src: "/logos/datos.webp", alt: "Datos", width: 124, height: 120 },
  { src: "/logos/dmc-dreamers-logo-1.webp", alt: "DMC Dreamers", width: 120, height: 120 },
  { src: "/logos/ezionic.webp", alt: "Ezionic", width: 179, height: 120 },
  { src: "/logos/fcs.webp", alt: "FCS", width: 161, height: 120 },
  { src: "/logos/halo-and-hues.webp", alt: "Halo and Hues", width: 105, height: 120 },
  { src: "/logos/lwh.webp", alt: "LWH", width: 199, height: 120 },
  { src: "/logos/m-s.webp", alt: "M&S", width: 150, height: 120 },
  { src: "/logos/one-one.webp", alt: "One-One", width: 118, height: 120 },
  { src: "/logos/rombus-logo.webp", alt: "Rombus", width: 315, height: 120 },
  { src: "/logos/silent-grind.webp", alt: "Silent Grind", width: 133, height: 120 },
  { src: "/logos/trust-take.webp", alt: "Trust & Take", width: 199, height: 120 },
  { src: "/logos/joynal-academy.webp", alt: "Joynal Academy", width: 288, height: 120 },
];

function LogoItem({ logo }: { logo: Logo }) {
  return (
    <div className="flex h-10 shrink-0 items-center px-8 md:h-12 md:px-10">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className="h-full w-auto object-contain opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
      />
    </div>
  );
}

const FAST_DURATION = 40; // seconds for one full loop — matches the original CSS animation
const SLOW_DURATION = 120; // seconds for one full loop, on hover — matches the original CSS animation
const EASE = 3; // higher = snappier transition between speeds

export function TrustedBy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const currentSpeedRef = useRef(0);
  const targetSpeedRef = useRef(0);
  const fastSpeedRef = useRef(0);
  const slowSpeedRef = useRef(0);
  const loopWidthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Content is duplicated once, so half the scrollWidth is one full loop.
    const loopWidth = track.scrollWidth / 2;
    loopWidthRef.current = loopWidth;

    // Derive px/s speeds from the same duration values the original
    // CSS animation used, so the perceived speed matches exactly.
    fastSpeedRef.current = loopWidth / FAST_DURATION;
    slowSpeedRef.current = loopWidth / SLOW_DURATION;
    currentSpeedRef.current = fastSpeedRef.current;
    targetSpeedRef.current = fastSpeedRef.current;

    let frameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Smoothly ease current speed toward target speed — never jumps.
      currentSpeedRef.current +=
        (targetSpeedRef.current - currentSpeedRef.current) * Math.min(EASE * dt, 1);

      positionRef.current += currentSpeedRef.current * dt;

      if (loopWidthRef.current > 0 && positionRef.current >= loopWidthRef.current) {
        positionRef.current -= loopWidthRef.current;
      }

      if (track) {
        track.style.transform = `translateX(-${positionRef.current}px)`;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="border-y border-line bg-bg-alt py-14 md:py-16">
      <p className="mb-10 text-center text-xs tracking-[0.2em] text-muted md:text-sm">
        TRUSTED BY RISING BANGLADESHI BRANDS
      </p>

      <div
        className="relative flex w-full overflow-hidden"
        onMouseEnter={() => {
          targetSpeedRef.current = slowSpeedRef.current;
        }}
        onMouseLeave={() => {
          targetSpeedRef.current = fastSpeedRef.current;
        }}
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div ref={trackRef} className="flex w-max shrink-0 items-center will-change-transform">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <LogoItem key={`${logo.src}-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
