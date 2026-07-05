import { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { ReviewsHero } from "@/components/sections/reviews-hero";
import { ReviewsGrid } from "@/components/sections/reviews-grid";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Reviews | Mahtamun",
  description: "Client reviews and feedback about my design work and services.",
};

// Reviews page Secondary CTA Set — different from homepage
const REVIEWS_PAGE_CTA_SET = {
  eyebrow: "DISCUSS YOUR",
  heading: "PAIN POINT",
  buttonLabel: "DM NOW",
  buttonHref: "#contact",
  motivation: {
    name: null,
    role: null,
    quote: null,
    avatar: null,
  },
};

export default function ReviewsPage() {
  return (
    <>
      <Navbar />
      <ReviewsHero />
      <ReviewsGrid />
      <SecondaryCta set={REVIEWS_PAGE_CTA_SET} />
      <Footer />
    </>
  );
}
