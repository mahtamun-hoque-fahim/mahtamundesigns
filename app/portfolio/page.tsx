import { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { PortfolioHero } from "@/components/sections/portfolio-hero";

export const metadata: Metadata = {
  title: "Portfolio | Mahtamun",
  description: "A showcase of brand identity, rebranding, and design work across ambitious Bangladeshi brands.",
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <PortfolioHero />
      {/* More sections added section-by-section — do not batch */}
    </>
  );
}
