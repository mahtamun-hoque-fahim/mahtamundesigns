import { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { PortfolioHero } from "@/components/sections/portfolio-hero";
import { PortfolioIntro } from "@/components/sections/portfolio-intro";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Portfolio | Mahtamun",
  description: "A showcase of brand identity, rebranding, and design work across ambitious Bangladeshi brands.",
};

// TODO(dashboard): same copy pattern as Reviews page — dashboard assigns which
// set maps to which page. Portfolio uses its own named set for future flexibility.
const PORTFOLIO_CTA_SET = {
  eyebrow: "DISCUSS YOUR",
  heading: "PAIN POINT",
  buttonLabel: "DM NOW",
  buttonHref: "#contact",
  motivation: {
    name: null,
    role: null,
    quote: null,
    avatar: null,
  },
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <PortfolioHero />
      <PortfolioIntro />
      <PortfolioGrid />
      <SecondaryCta set={PORTFOLIO_CTA_SET} />
      <Footer />
    </>
  );
}
