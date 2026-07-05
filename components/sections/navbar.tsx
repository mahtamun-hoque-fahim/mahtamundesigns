"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Showcase", href: "/#showcase" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hiddenForSection, setHiddenForSection] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Close the menu automatically if the viewport grows back to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/10 backdrop-blur-lg transition-all duration-300 ${
        hiddenForSection ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled || menuOpen
          ? "md:border-white/5 md:bg-black/10 md:backdrop-blur-lg"
          : "md:border-transparent md:bg-transparent md:backdrop-blur-none"
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

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-md bg-accent-dim px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent md:inline-flex"
          >
            Contact
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md text-white/80 transition-colors duration-200 hover:text-white md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 top-[73px] z-40 bg-black/60 transition-opacity md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile menu panel */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        className={`absolute inset-x-0 top-full z-40 origin-top border-b border-white/5 bg-black/10 backdrop-blur-lg transition-all duration-200 md:hidden ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-white/5 py-4 text-base text-white/80 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-6 pb-6">
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center rounded-md bg-accent-dim px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
