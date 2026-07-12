"use server";

import { revalidateTag } from "next/cache";
import { getDb } from "@/lib/db";
import { siteStats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function upsertStats(formData: FormData) {
  const db = getDb();
  const values = {
    id:              "main",
    yearsExperience: Number(formData.get("yearsExperience")) || 0,
    totalDesigns:    Number(formData.get("totalDesigns"))    || 0,
    clientCount:     Number(formData.get("clientCount"))     || 0,
    satisfaction:    Number(formData.get("satisfaction"))    || 0,
    updatedAt:       new Date(),
  };

  const db2 = getDb();
  const [existing] = await db2.select().from(siteStats).where(eq(siteStats.id, "main"));
  if (existing) {
    await db.update(siteStats).set(values).where(eq(siteStats.id, "main"));
  } else {
    await db.insert(siteStats).values(values);
  }

  revalidateTag("stats", "max");
}
