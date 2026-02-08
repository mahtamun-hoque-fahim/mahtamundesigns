import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="relative border-t border-border overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0">
        <img
          src="/images/home/hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-card/90" />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
              MAHTAMUN<span className="text-primary">.</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Crafting bold visual identities and memorable brand experiences for ambitious companies across Bangladesh.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Navigation</h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Home", path: "/" },
                { label: "Clients", path: "/clients" },
                { label: "Reviews", path: "/reviews" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Connect</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Behance</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dribbble</a>
              <a href="mailto:hello@mahtamun.design" className="text-sm text-muted-foreground hover:text-primary transition-colors">hello@mahtamun.design</a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2024 Mahtamun. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Designed with passion in Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
