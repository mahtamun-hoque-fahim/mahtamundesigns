import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, Star, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Portfolio", path: "/clients", icon: Briefcase },
  { label: "Reviews", path: "/reviews", icon: Star },
  { label: "Contact", path: "/contact", icon: Mail },
];

type NavState = "solid" | "glass";

export function FloatingNav() {
  const location = useLocation();
  const [navState, setNavState] = useState<NavState>("solid");
  const [visible, setVisible] = useState(false);

  const getNavState = useCallback((): NavState => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Near bottom (within 200px of end) → solid
    if (scrollY + windowHeight >= docHeight - 200) {
      return "solid";
    }

    // Scrolled at all → glass
    if (scrollY > 10) {
      return "glass";
    }

    // At top → solid
    return "solid";
  }, []);

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => setVisible(true), 300);

    const handleScroll = () => {
      setNavState(getNavState());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [getNavState, location.pathname]);

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <nav
        className={cn(
          "flex items-center gap-1 rounded-full px-2 py-2 md:px-3 md:py-2.5 transition-all duration-300 ease-out",
          navState === "glass"
            ? "bg-card/50 backdrop-blur-xl border border-border/30 shadow-lg shadow-black/20"
            : "bg-card border border-border/60 shadow-xl shadow-black/30"
        )}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === "/clients" && location.pathname.startsWith("/clients"));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] md:text-xs font-display font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
