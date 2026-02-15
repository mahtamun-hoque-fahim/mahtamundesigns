import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPinned(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [path]);

  const isCompanyPage = path.startsWith("/clients/");
  const segments = path.split("/").filter(Boolean);

  const crumbs: { label: string; path: string }[] = [];

  if (path === "/") return null;

  crumbs.push({ label: "Home", path: "/" });

  if (isCompanyPage) {
    crumbs.push({ label: "Portfolio", path: "/clients" });
    const slug = segments[1] || "";
    const label = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    crumbs.push({ label, path });
  } else {
    crumbs.push({ label: routeLabels[path] || segments[0] || "", path });
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`z-40 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          pinned
            ? "absolute bottom-[calc(100%-4rem)]"
            : "fixed bottom-6"
        }`}
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-md border border-border/50 rounded-full px-4 py-2 shadow-lg">
          {crumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              {i === crumbs.length - 1 ? (
                <span className="text-xs font-display font-semibold text-primary">
                  {i === 0 ? <Home className="w-3 h-3" /> : crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-xs font-display text-muted-foreground hover:text-foreground transition-colors"
                >
                  {i === 0 ? <Home className="w-3 h-3" /> : crumb.label}
                </Link>
              )}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
