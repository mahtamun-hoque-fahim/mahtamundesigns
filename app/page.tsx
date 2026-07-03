import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { TrustedBy } from "@/components/sections/trusted-by";
import { SelectedWorks } from "@/components/sections/selected-works";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustedBy />
      <SelectedWorks />
    </main>
  );
}
