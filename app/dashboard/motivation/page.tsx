export const dynamic = "force-dynamic";

import { getDb } from "@/lib/db";
import { motivationCards } from "@/lib/db/schema";
import { MotivationDashboard } from "./motivation-dashboard";

const PAGES = ["home", "reviews", "portfolio", "about"] as const;

export default async function DashboardMotivationPage() {
  // Fetch all existing cards keyed by page
  let cards: Record<string, { name: string | null; role: string | null; quote: string | null; avatar: string | null }> = {};
  try {
    const db = getDb();
    const rows = await db.select().from(motivationCards);
    for (const r of rows) {
      cards[r.page] = { name: r.name ?? null, role: r.role ?? null, quote: r.quote ?? null, avatar: r.avatar ?? null };
    }
  } catch { /* DB not ready yet */ }

  return <MotivationDashboard pages={PAGES as unknown as string[]} cards={cards} />;
}
