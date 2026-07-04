"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  target: number;
  suffix: string;
  label: string;
};

// TODO(dashboard): confirm these numbers are current — flagged in core.md
// as needing reconfirmation, not yet dashboard-wired.
const STATS: Stat[] = [
  { target: 6, suffix: "+", label: "Years" },
  { target: 600, suffix: "+", label: "Designs" },
  { target: 11, suffix: "", label: "Clients" },
  { target: 100, suffix: "%", label: "Satisfaction" },
];

const DURATION_MS = 1600;

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setValue(Math.round(target * easeOutExpo(progress)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return value;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const value = useCountUp(stat.target, active);

  return (
    <div className="text-center">
      <p className="font-display text-4xl font-bold text-white md:text-5xl">
        {value}
        {stat.suffix}
      </p>
      <p className="mt-2 font-mono text-sm text-accent md:text-base">
        {stat.label}
      </p>
    </div>
  );
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-y border-line bg-bg-alt py-14 md:py-16"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-10 px-6 md:grid-cols-4 md:gap-y-0 md:px-10">
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  );
}
