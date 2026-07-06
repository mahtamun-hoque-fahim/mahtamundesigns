import Image from "next/image";
import Link from "next/link";

// TODO(dashboard): "Portfolio" points nowhere yet — that page isn't built
// (see core.md tracker). "Contact" / "Book meeting" destination is also
// still undecided (form? Calendly? mailto?) — both point at #contact for
// now, same placeholder every other CTA in the site currently uses.
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "/contact#contact-form" },
  { label: "Book meeting", href: "/contact#contact-form" },
];

// TODO(dashboard): real social URLs needed — Fahim hasn't provided these
// yet, so these are dead links (#) rather than guessed URLs.
const SOCIAL_LINKS = [
  { label: "Behance", href: "#" },
  { label: "Dribble", href: "#" },
  { label: "Figma Community", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Image
              src="/logo/mahtamun-wordmark.svg"
              alt="Mahtamun"
              width={140}
              height={54}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs font-mono text-sm leading-relaxed text-muted">
              Crafting bold visuals and memorable brand experiences for
              ambitious companies across the globe.
            </p>
          </div>

          <div>
            <p className="mb-4 border-b border-line pb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-mono text-sm text-white/80 transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 border-b border-line pb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Stay in loop
            </p>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-mono text-sm text-white/80 transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-6 font-mono text-xs text-muted md:flex-row md:items-center md:justify-between md:px-10">
          <p>© Mahtamun Hoque Fahim | 2016–2026 | All rights reserved.</p>
          {/* FLAGGED (core.md): WikiMedia CC BY-NC-ND license line from the
              reference doesn't fit a commercial design portfolio — that
              license is meant for freely shareable media, not client work.
              Left off until Fahim confirms the actual license/terms he
              wants here. */}
          <Link href="#" className="hover:text-accent">
            Legal Notice
          </Link>
        </div>
      </div>
    </footer>
  );
}
