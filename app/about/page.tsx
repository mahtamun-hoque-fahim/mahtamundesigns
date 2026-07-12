export const dynamic = "force-dynamic";

import { Navbar } from "@/components/sections/navbar";
import { AboutHero } from "@/components/sections/about-hero";
import { AboutIntroTimeline } from "@/components/sections/about-intro-timeline";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { Footer } from "@/components/sections/footer";
import { getAllTimelineItems } from "@/lib/data/timeline";
import { getMotivationCard } from "@/lib/data/motivation";

export const metadata = {
  title: "About | Mahtamun Designs",
  description: "Learn more about Mahtamun's journey as a designer and developer.",
};

const ABOUT_CTA = {
  eyebrow: "I'M HERE TO SOLVE",
  heading: "THE PAIN",
  buttonLabel: "DM NOW",
  buttonHref: "/contact#contact-form",
};

export default async function AboutPage() {
  const [milestones, motivation] = await Promise.all([
    getAllTimelineItems(),
    getMotivationCard("about"),
  ]);

  const aboutSet = { ...ABOUT_CTA, motivation };

  return (
    <main>
      <Navbar />
      <AboutHero />
      <AboutIntroTimeline milestones={milestones} />
      <SecondaryCta set={aboutSet} />
      <Footer />
    </main>
  );
}
