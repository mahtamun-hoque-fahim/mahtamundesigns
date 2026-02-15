import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/clients": "Portfolio",
  "/reviews": "Reviews",
  "/contact": "Contact",
};

export function RouteIndicator() {
  const location = useLocation();
  const path = location.pathname;
  const [bottomOffset, setBottomOffset] = useState(32);
  const rafRef = useRef<number>(0);

  const updatePosition = useCallback(() => {
    const footer = document.querySelector("footer");
    if (!footer) {
      setBottomOffset(32);
      return;
    }

    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const pillHeight = 48; // approximate height of the pill
    const gap = 16;

    if (footerRect.top < viewportHeight) {
      // Footer is visible — pin above it
      const newBottom = viewportHeight - footerRect.top + gap;
      setBottomOffset(Math.max(newBottom, 32));
    } else {
      setBottomOffset(32);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updatePosition, path]);

  // Build breadcrumbs
  const isCompanyPage = path.startsWith("/clients/");
  const segments = path.split("/").filter(Boolean);

  const crumbs: { label: string; path: string }[] = [];
  crumbs.push({ label: "Home", path: "/" });

  if (path !== "/") {
    if (isCompanyPage) {
      crumbs.push({ label: "Portfolio", path: "/clients" });
      const slug = segments[1] || "";
      const label = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      crumbs.push({ label, path });
    } else {
      crumbs.push({ label: routeLabels[path] || segments[0] || "", path });
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        style={{ bottom: bottomOffset }}
        className="fixed left-1/2 -translate-x-1/2 z-40 transition-[bottom] duration-300 ease-out"
      >
        <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-md border border-border/50 rounded-full px-5 py-2.5 shadow-lg">
          {crumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              {i === crumbs.length - 1 ? (
                <span className="text-xs font-display font-semibold text-primary">
                  {crumb.label === "Home" ? <Home className="w-3.5 h-3.5" /> : crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-xs font-display text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label === "Home" ? <Home className="w-3.5 h-3.5" /> : crumb.label}
                </Link>
              )}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
