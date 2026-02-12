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

  // Extract company slug if on a company page
  const isCompanyPage = path.startsWith("/clients/");
  const segments = path.split("/").filter(Boolean);

  const crumbs: { label: string; path: string }[] = [];

  if (path === "/") return null; // Don't show on home

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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-20 left-6 z-40"
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
