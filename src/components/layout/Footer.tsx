import { Link } from "react-router-dom";
import { useCms } from "@/hooks/useSiteContent";

export function Footer() {
  const c = useCms();
  const brandName = c('global', 'footer', 'brand_name', 'MAHTAMUN');
  const description = c('global', 'footer', 'description', 'Crafting bold visual identities and memorable brand experiences for ambitious companies across Bangladesh.');
  const email = c('global', 'footer', 'email', 'mahtamunhoquefahim@pm.me');
  const ctaUrl = c('global', 'header', 'cta_url', 'https://wa.me/8801795931345');
  const ctaText = c('global', 'header', 'cta_text', 'Book a Meeting');

  return (
    <footer className="relative border-t border-border overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/home/hero-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.08]" />
        <div className="absolute inset-0 bg-card/90" />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
              {brandName}<span className="text-primary">.</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">{description}</p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {c('global', 'footer', 'nav_title', 'Navigation')}
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: c('global', 'header', 'nav_home', 'Home'), path: "/" },
                { label: c('global', 'header', 'nav_portfolio', 'Portfolio'), path: "/clients" },
                { label: c('global', 'header', 'nav_reviews', 'Reviews'), path: "/reviews" },
                { label: c('global', 'header', 'nav_contact', 'Contact'), path: "/contact" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {ctaText}
              </a>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {c('global', 'footer', 'connect_title', 'Connect')}
            </h4>
            <div className="flex flex-col gap-3">
              <a href={c('global', 'footer', 'instagram_url', '#')} className="text-sm text-muted-foreground hover:text-primary transition-colors">Instagram</a>
              <a href={c('global', 'footer', 'behance_url', '#')} className="text-sm text-muted-foreground hover:text-primary transition-colors">Behance</a>
              <a href={c('global', 'footer', 'dribbble_url', '#')} className="text-sm text-muted-foreground hover:text-primary transition-colors">Dribbble</a>
              <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{email}</a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">{c('global', 'footer', 'copyright', '© 2024 Mahtamun. All rights reserved.')}</p>
          <p className="text-xs text-muted-foreground">{c('global', 'footer', 'tagline', 'Designed with passion in Bangladesh')}</p>
        </div>
      </div>
    </footer>
  );
}
