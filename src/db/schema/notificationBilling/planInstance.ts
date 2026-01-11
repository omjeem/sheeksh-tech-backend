import Constants from "@/config/constants";
import {
  varchar,
  jsonb,
  timestamp,
  integer,
  text,
  uuid,
  pgTable,
  boolean,
} from "drizzle-orm/pg-core";
import { notifPlans_Table } from "./plans";
import { relations } from "drizzle-orm";
import { schoolsTable } from "../school/school";
import { notifPurchasedChannelWise_Table } from "./planPurchased";

export const notifPlanInstance_Table = pgTable("notif_plan_instance", {
  id: uuid().primaryKey().defaultRandom(),
  planId: uuid()
    .references(() => notifPlans_Table.id)
    .notNull(),
  schoolId: uuid()
    .references(() => schoolsTable.id)
    .notNull(),
  key: varchar({ length: 191 }), // e.g., "default", "pro", "enterprise-custom"
  name: varchar({ length: 255 }),
  description: text(),
  metadata: jsonb(),
  // durationDays: integer(),
  // startAt: timestamp(),
  // endAt: timestamp(),
  isActive: boolean().default(false).notNull(),
  isQueued: boolean().default(false).notNull(),
  queuedOrder: integer().default(0).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const notifPlanInstance_Relations = relations(
  notifPlanInstance_Table,
  ({ one, many }) => ({
    plan: one(notifPlans_Table, {
      fields: [notifPlanInstance_Table.planId],
      references: [notifPlans_Table.id],
    }),
    school: one(schoolsTable, {
      fields: [notifPlanInstance_Table.schoolId],
      references: [schoolsTable.id],
    }),
    puchansedChannels: many(notifPurchasedChannelWise_Table),
  })
);
