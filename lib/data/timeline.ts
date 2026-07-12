import { getDb } from "@/lib/db";
import { timelineItems } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export type TimelineRow = {
  id: string;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
};

const DEFAULTS: TimelineRow[] = [
  { id: "1", year: "2016", title: "Started Learning", description: "Started learning graphic design as a hobby while taking up web & Technology office applications and graphic design.", sortOrder: 0 },
  { id: "2", year: "2018", title: "First Competition", description: "Completed a creative project for a design competition. Got recognized for bold logo of course community.", sortOrder: 1 },
  { id: "3", year: "2020", title: "First Appearance", description: "Designed fresh logo for client website. Published case study on my e-portfolio page.", sortOrder: 2 },
  { id: "4", year: "2022", title: "First Client", description: "Started working for a digital agency. Led brand identity projects for multiple clients.", sortOrder: 3 },
  { id: "5", year: "2025", title: "First 10K", description: "Milestone in earnings crossed the first quarter — Top freelancer in the community.", sortOrder: 4 },
  { id: "6", year: "2026", title: "Gaining Velocity", description: "Started selling services directly. First product design ideation complete with solid team and platform.", sortOrder: 5 },
];

export async function getAllTimelineItems(): Promise<TimelineRow[]> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(timelineItems)
      .orderBy(asc(timelineItems.sortOrder));
    if (rows.length === 0) return DEFAULTS;
    return rows.map((r) => ({
      id: r.id,
      year: r.year,
      title: r.title,
      description: r.description,
      sortOrder: r.sortOrder,
    }));
  } catch {
    return DEFAULTS;
  }
}
