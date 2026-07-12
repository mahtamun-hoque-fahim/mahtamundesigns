"use server";

import { revalidateTag } from "next/cache";
import { getDb } from "@/lib/db";
import { timelineItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createTimelineItem(formData: FormData) {
  const db = getDb();
  await db.insert(timelineItems).values({
    year:        (formData.get("year") as string).trim(),
    title:       (formData.get("title") as string).trim(),
    description: (formData.get("description") as string).trim(),
    sortOrder:   Number(formData.get("sortOrder")) || 0,
  });
  revalidateTag("timeline", "max");
}

export async function updateTimelineItem(id: string, formData: FormData) {
  const db = getDb();
  await db
    .update(timelineItems)
    .set({
      year:        (formData.get("year") as string).trim(),
      title:       (formData.get("title") as string).trim(),
      description: (formData.get("description") as string).trim(),
      sortOrder:   Number(formData.get("sortOrder")) || 0,
    })
    .where(eq(timelineItems.id, id));
  revalidateTag("timeline", "max");
}

export async function deleteTimelineItem(id: string) {
  const db = getDb();
  await db.delete(timelineItems).where(eq(timelineItems.id, id));
  revalidateTag("timeline", "max");
}
