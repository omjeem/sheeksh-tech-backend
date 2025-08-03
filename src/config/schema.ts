import { pgTable, serial, varchar, timestamp, text, boolean } from "drizzle-orm/pg-core";

export const school_master = pgTable("school_master", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  website: varchar("website", { length: 255 }),

  superAdminName: varchar("super_admin_name", { length: 255 }).notNull(),
  superAdminEmail: varchar("super_admin_email", { length: 255 }).notNull().unique(),
  superAdminPasswordHash: varchar("super_admin_password_hash", { length: 255 }).notNull(),

  isVerified: boolean("is_verified").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
