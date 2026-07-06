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
  id:                   text("id").primaryKey(),
  accountId:            text("account_id").notNull(),
  providerId:           text("provider_id").notNull(),
  userId:               text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken:          text("access_token"),
  refreshToken:         text("refresh_token"),
  idToken:              text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt:timestamp("refresh_token_expires_at"),
  scope:                text("scope"),
  password:             text("password"),
  createdAt:            timestamp("created_at").notNull().defaultNow(),
  updatedAt:            timestamp("updated_at").notNull().defaultNow(),
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
  label:         text("label").notNull().default(""),        // portfolio card eyebrow
  tagline:       text("tagline").notNull().default(""),      // hero tagline
  logo:          text("logo"),                               // Cloudinary URL
  accentColor:   text("accent_color").notNull().default("#bb7cff"),
  about:         text("about").notNull().default(""),
  // role, contributions stored as comma-separated (simpler than array for now)
  role:          text("role").notNull().default(""),         // "Intern Designer,Junior Designer"
  timeline:      text("timeline").notNull().default(""),
  type:          text("type").notNull().default(""),
  contributions: text("contributions").notNull().default(""),// "Logo Design,Brand Identity"
  rating:        numeric("rating", { precision: 3, scale: 1 }).notNull().default("0"),
  statYears:     integer("stat_years").notNull().default(0),
  statDesigns:   integer("stat_designs").notNull().default(0),
  statProjects:  integer("stat_projects").notNull().default(0),
  sortOrder:     integer("sort_order").notNull().default(0),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
  updatedAt:     timestamp("updated_at").notNull().defaultNow(),
});

export const galleryItems = pgTable("gallery_items", {
  id:        uuid("id").primaryKey().defaultRandom(),
  clientId:  uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  image:     text("image"),                    // Cloudinary URL
  label:     text("label").notNull(),          // cover | story | poster | banner | thumbnail | logo | custom
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Type exports
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;
