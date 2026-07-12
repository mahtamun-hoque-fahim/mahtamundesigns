export const dynamic = "force-dynamic";

import { getAllTimelineItems } from "@/lib/data/timeline";
import { TimelineDashboard } from "./timeline-dashboard";

export default async function DashboardTimelinePage() {
  const items = await getAllTimelineItems();
  return <TimelineDashboard items={items} />;
}
