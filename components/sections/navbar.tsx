"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Showcase", href: "#showcase" },
  { label: "Reviews", href: "#reviews" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hiddenForSection, setHiddenForSection] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 12);

      // Auto-hide while any section marked data-nav-hide="true" covers the
      // viewport (currently just Reviews — its light bg clashes with the nav).
      const hideTargets = document.querySelectorAll('[data-nav-hide="true"]');
      let shouldHide = false;
      hideTargets.forEach((el) => {
        const top = (el as HTMLElement).offsetTop;
        const bottom = top + (el as HTMLElement).offsetHeight;
        if (window.scrollY >= top - 4 && window.scrollY < bottom - 4) {
          shouldHide = true;
        }
      });
      setHiddenForSection(shouldHide);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        hiddenForSection ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "border-white/5 bg-black/10 backdrop-blur-lg"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-10">
        <Link href="#home" className="shrink-0" aria-label="Mahtamun — home">
          <Image
            src="/logo/mahtamun-wordmark.svg"
            alt="Mahtamun"
            width={112}
            height={43}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <ul className="hidden items-center gap-10 text-sm text-white/80 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="#contact"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-dim"
        >
          Book Meeting
        </Link>
      </nav>
    </header>
  );
}
