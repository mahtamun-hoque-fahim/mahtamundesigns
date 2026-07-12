export const dynamic = "force-dynamic";

import { getSiteStats } from "@/lib/data/stats";
import { StatsDashboard } from "./stats-dashboard";

export default async function DashboardStatsPage() {
  const stats = await getSiteStats();
  return <StatsDashboard stats={stats} />;
}
