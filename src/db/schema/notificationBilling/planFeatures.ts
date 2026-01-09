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
import { notifPlanFeatureLimit_Table } from "./planFeatureLimit";

export const notifPlanFeatures_Table = pgTable("notif_plan_features", {
  id: uuid().primaryKey().defaultRandom(),
  planId: uuid()
    .references(() => notifPlans_Table.id)
    .notNull(),
  channel: varchar({ length: 20 }).notNull(),
  metadata: jsonb(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const notifPlanFeatures_Relations = relations(
  notifPlanFeatures_Table,
  ({ one, many }) => ({
    plan: one(notifPlans_Table, {
      fields: [notifPlanFeatures_Table.planId],
      references: [notifPlans_Table.id],
    }),
    featureLimit: many(notifPlanFeatureLimit_Table),
  })
);
