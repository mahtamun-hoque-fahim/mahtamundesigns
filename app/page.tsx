import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { TrustedBy } from "@/components/sections/trusted-by";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Reviews } from "@/components/sections/reviews";
import { Stats } from "@/components/sections/stats";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustedBy />
      <FeaturedProjects />
      <Reviews />
      <Stats />
    </main>
  );
}
