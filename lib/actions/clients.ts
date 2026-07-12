"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { clients, galleryItems } from "@/lib/db/schema";
import { uploadImage } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Client Actions ────────────────────────────────────────────────────────

export async function createClient(formData: FormData) {
  const db = getDb();
  const name = formData.get("name") as string;
  const slug = slugify(name);

  // Upload logo if provided
  let logoUrl: string | null = null;
  const logoFile = formData.get("logo") as File | null;
  if (logoFile && logoFile.size > 0) {
    logoUrl = await uploadImage(logoFile, "mahtamundesigns/logos");
  }

  await db.insert(clients).values({
    slug,
    name,
    label:       (formData.get("label")       as string) || "",
    tagline:     (formData.get("tagline")      as string) || "",
    logo:        logoUrl,
    accentColor: (formData.get("accentColor")  as string) || "#bb7cff",
    about:       (formData.get("about")        as string) || "",
    role:        (formData.get("role")         as string) || "",
    timeline:    (formData.get("timeline")     as string) || "",
    type:        (formData.get("type")         as string) || "",
    contributions:(formData.get("contributions")as string) || "",
    rating:      (formData.get("rating")       as string) || "0",
    statYears:   Number(formData.get("statYears"))   || 0,
    statDesigns: Number(formData.get("statDesigns")) || 0,
    statProjects:Number(formData.get("statProjects"))|| 0,
    sortOrder:     Number(formData.get("sortOrder"))     || 0,
    isFeatured:    formData.get("isFeatured") === "on",
    featuredOrder: Number(formData.get("featuredOrder")) || 0,
  });

  revalidateTag("clients", "max");
  redirect(`/dashboard/clients/${slug}`);
}

export async function updateClient(slug: string, formData: FormData) {
  const db = getDb();

  let logoUrl: string | undefined = undefined;
  const logoFile = formData.get("logo") as File | null;
  if (logoFile && logoFile.size > 0) {
    logoUrl = await uploadImage(logoFile, "mahtamundesigns/logos");
  }

  await db
    .update(clients)
    .set({
      name:         (formData.get("name")         as string),
      label:        (formData.get("label")         as string),
      tagline:      (formData.get("tagline")       as string),
      accentColor:  (formData.get("accentColor")   as string),
      about:        (formData.get("about")         as string),
      role:         (formData.get("role")          as string),
      timeline:     (formData.get("timeline")      as string),
      type:         (formData.get("type")          as string),
      contributions:(formData.get("contributions") as string),
      rating:       (formData.get("rating")        as string),
      statYears:    Number(formData.get("statYears")),
      statDesigns:  Number(formData.get("statDesigns")),
      statProjects: Number(formData.get("statProjects")),
      sortOrder:     Number(formData.get("sortOrder")),
      isFeatured:    formData.get("isFeatured") === "on",
      featuredOrder: Number(formData.get("featuredOrder")) || 0,
      ...(logoUrl ? { logo: logoUrl } : {}),
      updatedAt:     new Date(),
    })
    .where(eq(clients.slug, slug));

  revalidateTag("clients", "max");
}

export async function deleteClient(slug: string) {
  const db = getDb();
  await db.delete(clients).where(eq(clients.slug, slug));
  revalidateTag("clients", "max");
  redirect("/dashboard/clients");
}

// ── Gallery Actions ───────────────────────────────────────────────────────

export async function addGalleryItem(clientId: string, formData: FormData) {
  const db = getDb();

  let imageUrl: string | null = null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile, "mahtamundesigns/gallery");
  }

  const label = (formData.get("label") as string) || "cover";

  // Get next sort order
  const existing = await db
    .select({ sortOrder: galleryItems.sortOrder })
    .from(galleryItems)
    .where(eq(galleryItems.clientId, clientId));
  const nextOrder = existing.length > 0
    ? Math.max(...existing.map((i) => i.sortOrder)) + 1
    : 0;

  await db.insert(galleryItems).values({
    clientId,
    image: imageUrl,
    label,
    sortOrder: nextOrder,
  });

  revalidateTag("clients", "max");
}

export async function deleteGalleryItem(id: string) {
  const db = getDb();
  await db.delete(galleryItems).where(eq(galleryItems.id, id));
  revalidateTag("clients", "max");
}

export async function updateGalleryItemLabel(id: string, label: string) {
  const db = getDb();
  await db
    .update(galleryItems)
    .set({ label })
    .where(eq(galleryItems.id, id));
  revalidateTag("clients", "max");
}
