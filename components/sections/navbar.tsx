"use client";

import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Showcase", href: "#showcase" },
  { label: "Reviews", href: "#reviews" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/10 backdrop-blur-lg">
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
