import { getDb } from "@/lib/db";
import { motivationCards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type MotivationRow = {
  name: string | null;
  role: string | null;
  quote: string | null;
  avatar: string | null;
};

const EMPTY: MotivationRow = { name: null, role: null, quote: null, avatar: null };

export async function getMotivationCard(page: string): Promise<MotivationRow> {
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(motivationCards)
      .where(eq(motivationCards.page, page));
    if (!row) return EMPTY;
    return { name: row.name ?? null, role: row.role ?? null, quote: row.quote ?? null, avatar: row.avatar ?? null };
  } catch {
    return EMPTY;
  }
}
