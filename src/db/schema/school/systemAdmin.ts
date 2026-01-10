import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { notifPlans_Table } from "../notificationBilling/plans";

export const systemAdmin_Table = pgTable("system_admin", {
  id: uuid().primaryKey().defaultRandom(),
  access: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  phone: varchar().unique().notNull(),
  isSuspended: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const systemAdmin_Relations = relations(
  systemAdmin_Table,
  ({ one, many }) => ({
    plans: many(notifPlans_Table),
  })
);
