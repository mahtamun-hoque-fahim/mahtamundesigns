import { getDb } from "@/lib/db";
import { siteStats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type StatsRow = {
  yearsExperience: number;
  totalDesigns: number;
  clientCount: number;
  satisfaction: number;
};

const DEFAULTS: StatsRow = {
  yearsExperience: 6,
  totalDesigns: 600,
  clientCount: 11,
  satisfaction: 100,
};

export async function getSiteStats(): Promise<StatsRow> {
  try {
    const db = getDb();
    const [row] = await db.select().from(siteStats).where(eq(siteStats.id, "main"));
    if (!row) return DEFAULTS;
    return {
      yearsExperience: row.yearsExperience,
      totalDesigns: row.totalDesigns,
      clientCount: row.clientCount,
      satisfaction: row.satisfaction,
    };
  } catch {
    return DEFAULTS;
  }
}
