// lib/clients.ts
// Single source of truth for client/portfolio data.
// All reads come from Neon via Drizzle. Mutations via lib/actions/clients.ts.

import { getDb } from "@/lib/db";
import { clients, galleryItems } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export type DesignLabel =
  | "logo"
  | "cover"
  | "thumbnail"
  | "poster"
  | "banner"
  | "story"
  | string;

export type GalleryItem = {
  id: string;
  image: string | null;
  label: DesignLabel;
};

export type ClientData = {
  id:           string;
  slug:         string;
  name:         string;
  label:        string;
  tagline:      string;
  logo:         string | null;
  accentColor:  string;
  about:        string;
  role:         string[];
  timeline:     string;
  type:         string;
  contributions:string[];
  rating:       number;
  stats: {
    years:    number;
    designs:  number;
    projects: number;
  };
  gallery:      GalleryItem[];
};

// Split comma-separated string to array, trim whitespace, filter empty
function splitList(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

function mapRow(
  row: typeof clients.$inferSelect,
  items: typeof galleryItems.$inferSelect[]
): ClientData {
  return {
    id:           row.id,
    slug:         row.slug,
    name:         row.name,
    label:        row.label,
    tagline:      row.tagline,
    logo:         row.logo ?? null,
    accentColor:  row.accentColor,
    about:        row.about,
    role:         splitList(row.role),
    timeline:     row.timeline,
    type:         row.type,
    contributions:splitList(row.contributions),
    rating:       Number(row.rating),
    stats: {
      years:    row.statYears,
      designs:  row.statDesigns,
      projects: row.statProjects,
    },
    gallery: items.map((g) => ({
      id:    g.id,
      image: g.image ?? null,
      label: g.label,
    })),
  };
}

export async function getAllClients(): Promise<ClientData[]> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(clients)
      .orderBy(asc(clients.sortOrder), asc(clients.createdAt));

    const result: ClientData[] = [];
    for (const row of rows) {
      const items = await db
        .select()
        .from(galleryItems)
        .where(eq(galleryItems.clientId, row.id))
        .orderBy(asc(galleryItems.sortOrder));
      result.push(mapRow(row, items));
    }
    return result;
  } catch {
    // DB not configured yet — degrade gracefully rather than crash
    return [];
  }
}

export async function getClient(slug: string): Promise<ClientData | null> {
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(clients)
      .where(eq(clients.slug, slug));
    if (!row) return null;

    const items = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.clientId, row.id))
      .orderBy(asc(galleryItems.sortOrder));

    return mapRow(row, items);
  } catch {
    return null;
  }
}
