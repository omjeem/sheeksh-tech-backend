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
import { notifPlanTrans_Table } from "./planTransaction";
import { notifSchoolLedger_table } from "../notificationUsages/schoolLedger";

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
  isExhausted: boolean().default(false).notNull(),
  isActive: boolean().default(true).notNull(),
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
    purchasedChannels: many(notifPurchasedChannelWise_Table),
    transaction: many(notifPlanTrans_Table),
    notifLedger: many(notifSchoolLedger_table),
  })
);
