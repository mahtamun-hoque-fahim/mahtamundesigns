export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { ReviewsHero } from "@/components/sections/reviews-hero";
import { ReviewsGrid } from "@/components/sections/reviews-grid";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { Footer } from "@/components/sections/footer";
import { getAllReviews } from "@/lib/data/reviews";
import { getMotivationCard } from "@/lib/data/motivation";

export const metadata: Metadata = {
  title: "Reviews | Mahtamun",
  description: "Client reviews and feedback about my design work and services.",
};

const REVIEWS_CTA = {
  eyebrow: "DISCUSS YOUR",
  heading: "PAIN POINT",
  buttonLabel: "DM NOW",
  buttonHref: "/contact#contact-form",
};

export default async function ReviewsPage() {
  const [reviews, motivation] = await Promise.all([
    getAllReviews(),
    getMotivationCard("reviews"),
  ]);

  const reviewsSet = { ...REVIEWS_CTA, motivation };

  return (
    <>
      <Navbar />
      <ReviewsHero />
      <ReviewsGrid reviews={reviews} />
      <SecondaryCta set={reviewsSet} />
      <Footer />
    </>
  );
}
