import { Navbar } from "@/components/sections/navbar";
import { AboutHero } from "@/components/sections/about-hero";
import { AboutIntro } from "@/components/sections/about-intro";
import { AboutTimeline } from "@/components/sections/about-timeline";

export const metadata = {
  title: "About | Mahtamun Designs",
  description: "Learn more about Mahtamun's journey as a designer and developer.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutHero />
      <AboutIntro />
      <AboutTimeline />
    </main>
  );
}
