"use server";

import { revalidateTag } from "next/cache";
import { getDb } from "@/lib/db";
import { motivationCards } from "@/lib/db/schema";
import { uploadImage } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function upsertMotivationCard(page: string, formData: FormData) {
  const db = getDb();

  let avatarUrl: string | undefined = undefined;
  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    avatarUrl = await uploadImage(avatarFile, "mahtamundesigns/avatars");
  }

  const values = {
    page,
    name:   (formData.get("name") as string)?.trim() || null,
    role:   (formData.get("role") as string)?.trim() || null,
    quote:  (formData.get("quote") as string)?.trim() || null,
    ...(avatarUrl ? { avatar: avatarUrl } : {}),
  };

  const [existing] = await db.select().from(motivationCards).where(eq(motivationCards.page, page));
  if (existing) {
    await db.update(motivationCards).set(values).where(eq(motivationCards.page, page));
  } else {
    await db.insert(motivationCards).values(values);
  }

  revalidateTag("motivation", "max");
}
