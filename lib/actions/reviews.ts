"use server";

import { revalidateTag } from "next/cache";
import { getDb } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { uploadImage } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function createReview(formData: FormData) {
  const db = getDb();

  let avatarUrl: string | null = null;
  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    avatarUrl = await uploadImage(avatarFile, "mahtamundesigns/avatars");
  }

  let imageUrl: string | null = null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile, "mahtamundesigns/reviews");
  }

  await db.insert(reviews).values({
    name:       (formData.get("name") as string).trim(),
    role:       (formData.get("role") as string)?.trim() || "",
    quote:      (formData.get("quote") as string).trim(),
    rating:     Number(formData.get("rating")) || 5,
    avatar:     avatarUrl,
    image:      imageUrl,
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder:  Number(formData.get("sortOrder")) || 0,
  });

  revalidateTag("reviews", "max");
}

export async function updateReview(id: string, formData: FormData) {
  const db = getDb();

  let avatarUrl: string | undefined = undefined;
  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    avatarUrl = await uploadImage(avatarFile, "mahtamundesigns/avatars");
  }

  let imageUrl: string | undefined = undefined;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile, "mahtamundesigns/reviews");
  }

  await db
    .update(reviews)
    .set({
      name:       (formData.get("name") as string).trim(),
      role:       (formData.get("role") as string)?.trim() || "",
      quote:      (formData.get("quote") as string).trim(),
      rating:     Number(formData.get("rating")) || 5,
      isFeatured: formData.get("isFeatured") === "on",
      sortOrder:  Number(formData.get("sortOrder")) || 0,
      ...(avatarUrl ? { avatar: avatarUrl } : {}),
      ...(imageUrl  ? { image: imageUrl }  : {}),
    })
    .where(eq(reviews.id, id));

  revalidateTag("reviews", "max");
}

export async function deleteReview(id: string) {
  const db = getDb();
  await db.delete(reviews).where(eq(reviews.id, id));
  revalidateTag("reviews", "max");
}
