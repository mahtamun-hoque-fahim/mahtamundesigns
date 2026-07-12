export const dynamic = "force-dynamic";

import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { TrustedBy } from "@/components/sections/trusted-by";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Reviews } from "@/components/sections/reviews";
import { Stats } from "@/components/sections/stats";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { Footer } from "@/components/sections/footer";
import { getFeaturedClients } from "@/lib/clients";
import { getFeaturedReviews } from "@/lib/data/reviews";
import { getSiteStats } from "@/lib/data/stats";
import { getMotivationCard } from "@/lib/data/motivation";
import type { ClientData } from "@/lib/clients";

const HOME_CTA = {
  eyebrow: "I'M HERE TO SOLVE",
  heading: "THE PAIN",
  buttonLabel: "DM NOW",
  buttonHref: "/contact#contact-form",
};

export default async function Home() {
  const [featuredClients, featuredReviews, stats, motivation] = await Promise.all([
    getFeaturedClients(),
    getFeaturedReviews(),
    getSiteStats(),
    getMotivationCard("home"),
  ]);

  // Map ClientData → FeaturedProject shape expected by the component
  const featuredProjects = featuredClients.map((c: ClientData) => ({
    title:       c.name,
    projectType: c.label || "Brand Identity",
    href:        `/clients/${c.slug}`,
    thumbnail:   c.gallery.find((g) => g.label === "cover" || g.label === "thumbnail")?.image ?? null,
  }));

  const homeSet = { ...HOME_CTA, motivation };

  return (
    <main>
      <Navbar />
      <Hero />
      <TrustedBy />
      <FeaturedProjects projects={featuredProjects} />
      <Reviews reviews={featuredReviews} />
      <Stats stats={stats} />
      <SecondaryCta set={homeSet} />
      <Footer />
    </main>
  );
}
