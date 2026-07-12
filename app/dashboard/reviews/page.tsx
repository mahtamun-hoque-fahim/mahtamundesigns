export const dynamic = "force-dynamic";

import { getAllReviews } from "@/lib/data/reviews";
import { ReviewsDashboard } from "./reviews-dashboard";

export default async function DashboardReviewsPage() {
  const reviews = await getAllReviews();
  return <ReviewsDashboard reviews={reviews} />;
}
