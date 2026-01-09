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

export const notifPlanInstance_Table = pgTable("notif_plan_instance", {
  id: uuid().primaryKey().defaultRandom(),
  planId: uuid()
    .references(() => notifPlans_Table.id)
    .notNull(),
  key: varchar({ length: 191 }), // e.g., "default", "pro", "enterprise-custom"
  displayName: varchar({ length: 255 }),
  durationDays: integer(),
  isQueued: boolean().default(false).notNull(),
  price: integer().notNull(),
  queuedPriority: integer().default(100).notNull(),
  metadata: jsonb(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const notifPlanInstance_Relations = relations(
  notifPlanInstance_Table,
  ({ one }) => ({
    plan: one(notifPlans_Table, {
      fields: [notifPlanInstance_Table.planId],
      references: [notifPlans_Table.id],
    }),
  })
);
