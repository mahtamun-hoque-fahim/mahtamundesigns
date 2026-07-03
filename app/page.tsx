import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { TrustedBy } from "@/components/sections/trusted-by";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustedBy />
    </main>
  );
}
