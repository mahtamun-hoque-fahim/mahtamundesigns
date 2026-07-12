import { getDb } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export type ReviewRow = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string | null;
  image: string | null;
  isFeatured: boolean;
  sortOrder: number;
};

function map(r: typeof reviews.$inferSelect): ReviewRow {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    quote: r.quote,
    rating: r.rating,
    avatar: r.avatar ?? null,
    image: r.image ?? null,
    isFeatured: r.isFeatured,
    sortOrder: r.sortOrder,
  };
}

export async function getAllReviews(): Promise<ReviewRow[]> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(reviews)
      .orderBy(asc(reviews.sortOrder), asc(reviews.createdAt));
    return rows.map(map);
  } catch {
    return [];
  }
}

export async function getFeaturedReviews(): Promise<ReviewRow[]> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(reviews)
      .where(eq(reviews.isFeatured, true))
      .orderBy(asc(reviews.sortOrder));
    return rows.map(map);
  } catch {
    return [];
  }
}
