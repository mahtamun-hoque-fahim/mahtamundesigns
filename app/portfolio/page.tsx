export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { PortfolioHero } from "@/components/sections/portfolio-hero";
import { PortfolioIntro } from "@/components/sections/portfolio-intro";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { Footer } from "@/components/sections/footer";
import { getAllClients } from "@/lib/clients";
import { getMotivationCard } from "@/lib/data/motivation";

export const metadata: Metadata = {
  title: "Portfolio | Mahtamun",
  description: "A showcase of brand identity, rebranding, and design work.",
};

const PORTFOLIO_CTA = {
  eyebrow: "DISCUSS YOUR",
  heading: "PAIN POINT",
  buttonLabel: "DM NOW",
  buttonHref: "/contact#contact-form",
};

export default async function PortfolioPage() {
  const [allClients, motivation] = await Promise.all([
    getAllClients(),
    getMotivationCard("portfolio"),
  ]);

  const portfolioSet = { ...PORTFOLIO_CTA, motivation };

  return (
    <>
      <Navbar />
      <PortfolioHero />
      <PortfolioIntro />
      <PortfolioGrid clients={allClients} />
      <SecondaryCta set={portfolioSet} />
      <Footer />
    </>
  );
}
