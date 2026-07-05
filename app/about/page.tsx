import { Navbar } from "@/components/sections/navbar";
import { AboutHero } from "@/components/sections/about-hero";
import { AboutIntroTimeline } from "@/components/sections/about-intro-timeline";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { Footer } from "@/components/sections/footer";

export const metadata = {
  title: "About | Mahtamun Designs",
  description: "Learn more about Mahtamun's journey as a designer and developer.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutHero />
      <AboutIntroTimeline />
      <SecondaryCta />
      <Footer />
    </main>
  );
}
