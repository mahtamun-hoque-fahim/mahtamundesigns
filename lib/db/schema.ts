import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";

// ── Better Auth tables ───────────────────────────────────────────────────────

export const user = pgTable("user", {
  id:            text("id").primaryKey(),
  name:          text("name").notNull(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image:         text("image"),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
  updatedAt:     timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id:             text("id").primaryKey(),
  expiresAt:      timestamp("expires_at").notNull(),
  token:          text("token").notNull().unique(),
  createdAt:      timestamp("created_at").notNull().defaultNow(),
  updatedAt:      timestamp("updated_at").notNull().defaultNow(),
  ipAddress:      text("ip_address"),
  userAgent:      text("user_agent"),
  userId:         text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id:                    text("id").primaryKey(),
  accountId:             text("account_id").notNull(),
  providerId:            text("provider_id").notNull(),
  userId:                text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken:           text("access_token"),
  refreshToken:          text("refresh_token"),
  idToken:               text("id_token"),
  accessTokenExpiresAt:  timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope:                 text("scope"),
  password:              text("password"),
  createdAt:             timestamp("created_at").notNull().defaultNow(),
  updatedAt:             timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").defaultNow(),
  updatedAt:  timestamp("updated_at").defaultNow(),
});

// ── Portfolio / Clients ──────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id:            uuid("id").primaryKey().defaultRandom(),
  slug:          text("slug").notNull().unique(),
  name:          text("name").notNull(),
  label:         text("label").notNull().default(""),
  tagline:       text("tagline").notNull().default(""),
  logo:          text("logo"),
  accentColor:   text("accent_color").notNull().default("#bb7cff"),
  about:         text("about").notNull().default(""),
  role:          text("role").notNull().default(""),
  timeline:      text("timeline").notNull().default(""),
  type:          text("type").notNull().default(""),
  contributions: text("contributions").notNull().default(""),
  rating:        numeric("rating", { precision: 3, scale: 1 }).notNull().default("0"),
  statYears:     integer("stat_years").notNull().default(0),
  statDesigns:   integer("stat_designs").notNull().default(0),
  statProjects:  integer("stat_projects").notNull().default(0),
  sortOrder:     integer("sort_order").notNull().default(0),
  // Featured projects section on homepage
  isFeatured:    boolean("is_featured").notNull().default(false),
  featuredOrder: integer("featured_order").notNull().default(0),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
  updatedAt:     timestamp("updated_at").notNull().defaultNow(),
});

export const galleryItems = pgTable("gallery_items", {
  id:        uuid("id").primaryKey().defaultRandom(),
  clientId:  uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  image:     text("image"),
  label:     text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Reviews ──────────────────────────────────────────────────────────────────
// Used by both the homepage scroll section (isFeatured=true) and /reviews grid.

export const reviews = pgTable("reviews", {
  id:         uuid("id").primaryKey().defaultRandom(),
  name:       text("name").notNull(),
  role:       text("role").notNull().default(""),        // e.g. "CEO, Motovessel"
  quote:      text("quote").notNull(),
  rating:     integer("rating").notNull().default(5),    // 1–5
  avatar:     text("avatar"),                            // Cloudinary URL, nullable
  image:      text("image"),                             // Optional modal image (Cloudinary)
  isFeatured: boolean("is_featured").notNull().default(false), // show in homepage scroll
  sortOrder:  integer("sort_order").notNull().default(0),
  createdAt:  timestamp("created_at").notNull().defaultNow(),
});

// ── Timeline items ────────────────────────────────────────────────────────────

export const timelineItems = pgTable("timeline_items", {
  id:          uuid("id").primaryKey().defaultRandom(),
  year:        text("year").notNull(),
  title:       text("title").notNull(),
  description: text("description").notNull(),
  sortOrder:   integer("sort_order").notNull().default(0),
});

// ── Site stats ────────────────────────────────────────────────────────────────
// Single row, fixed id "main".

export const siteStats = pgTable("site_stats", {
  id:              text("id").primaryKey().default("main"),
  yearsExperience: integer("years_experience").notNull().default(6),
  totalDesigns:    integer("total_designs").notNull().default(600),
  clientCount:     integer("client_count").notNull().default(11),
  satisfaction:    integer("satisfaction").notNull().default(100), // percent 0–100
  updatedAt:       timestamp("updated_at").notNull().defaultNow(),
});

// ── Motivation cards ──────────────────────────────────────────────────────────
// One card per page key for the Secondary CTA Section's right-hand testimonial.
// page values: "home" | "reviews" | "portfolio" | "about" | "contact"

export const motivationCards = pgTable("motivation_cards", {
  id:     uuid("id").primaryKey().defaultRandom(),
  page:   text("page").notNull().unique(),
  name:   text("name"),
  role:   text("role"),
  quote:  text("quote"),
  avatar: text("avatar"),  // Cloudinary URL
});

// ── Type exports ──────────────────────────────────────────────────────────────

export type Client          = typeof clients.$inferSelect;
export type NewClient       = typeof clients.$inferInsert;
export type GalleryItem     = typeof galleryItems.$inferSelect;
export type NewGalleryItem  = typeof galleryItems.$inferInsert;
export type Review          = typeof reviews.$inferSelect;
export type NewReview       = typeof reviews.$inferInsert;
export type TimelineItem    = typeof timelineItems.$inferSelect;
export type NewTimelineItem = typeof timelineItems.$inferInsert;
export type SiteStats       = typeof siteStats.$inferSelect;
export type MotivationCard  = typeof motivationCards.$inferSelect;
