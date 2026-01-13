import Constants from "@/config/constants";
import { relations } from "drizzle-orm";
import {
  varchar,
  jsonb,
  timestamp,
  integer,
  text,
  uuid,
  pgTable,
} from "drizzle-orm/pg-core";
import { notifPlanFeatures_Table } from "./planFeatures";
import { notifPlanTrans_Table } from "./planTransaction";
import { notifPurchasedChannelWise_Table } from "./planPurchased";
import { notifPlanInstance_Table } from "./planInstance";
import { systemAdmin_Table } from "../school/systemAdmin";
import { boolean } from "drizzle-orm/pg-core";

export const notifPlans_Table = pgTable("notif_plans", {
  id: uuid().primaryKey().defaultRandom(),
  key: varchar({ length: 191 }).unique().notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  planType: varchar({ length: 255 })
    .default(Constants.NOTIFICATION.BILLING.PLAN_TYPES.PUBLIC)
    .notNull(),
  basePrice: integer().notNull(),
  currency: varchar({ length: 10 }).default("INR"),
  metadata: jsonb(),
  isActive: boolean().default(true),
  createdBy: uuid()
    .references(() => systemAdmin_Table.id)
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const notifPlans_Relations = relations(
  notifPlans_Table,
  ({ one, many }) => ({
    feature: many(notifPlanFeatures_Table),
    instance: many(notifPlanInstance_Table),
    createdBy: one(systemAdmin_Table, {
      fields: [notifPlans_Table.createdBy],
      references: [systemAdmin_Table.id],
    }),
  })
);
