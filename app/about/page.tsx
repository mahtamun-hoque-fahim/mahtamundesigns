import { Navbar } from "@/components/sections/navbar";
import { AboutHero } from "@/components/sections/about-hero";
import { AboutIntro } from "@/components/sections/about-intro";
import { AboutTimeline } from "@/components/sections/about-timeline";
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
      <AboutIntro />
      <AboutTimeline />
      <SecondaryCta />
      <Footer />
    </main>
  );
}
