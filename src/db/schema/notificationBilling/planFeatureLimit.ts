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
import { notifPlanFeatures_Table } from "./planFeatures";
import { relations } from "drizzle-orm";

export const notifPlanFeatureLimit_Table = pgTable("notif_plan_feature_limit", {
  id: uuid().primaryKey().defaultRandom(),
  planFeatureId: uuid()
    .references(() => notifPlanFeatures_Table.id)
    .notNull(),
  period: varchar({ length: 20 }).notNull(), // daily, monthly, yearly, etc
  maxUnits: integer().notNull(),
  metadata: jsonb(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const notifPlanFeatureLimit_Relations = relations(
  notifPlanFeatureLimit_Table,
  ({ one, many }) => ({
    planFeature: one(notifPlanFeatures_Table, {
      fields: [notifPlanFeatureLimit_Table.planFeatureId],
      references: [notifPlanFeatures_Table.id],
    }),
  })
);
