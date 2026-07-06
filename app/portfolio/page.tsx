export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { PortfolioHero } from "@/components/sections/portfolio-hero";
import { PortfolioIntro } from "@/components/sections/portfolio-intro";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { Footer } from "@/components/sections/footer";
import { getAllClients } from "@/lib/clients";

export const metadata: Metadata = {
  title: "Portfolio | Mahtamun",
  description: "A showcase of brand identity, rebranding, and design work.",
};

const PORTFOLIO_CTA_SET = {
  eyebrow: "DISCUSS YOUR",
  heading: "PAIN POINT",
  buttonLabel: "DM NOW",
  buttonHref: "#contact",
  motivation: { name: null, role: null, quote: null, avatar: null },
};

export default async function PortfolioPage() {
  const allClients = await getAllClients();

  return (
    <>
      <Navbar />
      <PortfolioHero />
      <PortfolioIntro />
      <PortfolioGrid clients={allClients} />
      <SecondaryCta set={PORTFOLIO_CTA_SET} />
      <Footer />
    </>
  );
}
