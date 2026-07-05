import { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { PortfolioHero } from "@/components/sections/portfolio-hero";
import { PortfolioIntro } from "@/components/sections/portfolio-intro";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";

export const metadata: Metadata = {
  title: "Portfolio | Mahtamun",
  description: "A showcase of brand identity, rebranding, and design work across ambitious Bangladeshi brands.",
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <PortfolioHero />
      <PortfolioIntro />
      <PortfolioGrid />
      {/* Secondary CTA + Footer — added section-by-section */}
    </>
  );
}
