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
import { schoolsTable } from "../school/school";
import { notifPlanTrans_Table } from "./planTransaction";
import { notifPlans_Table } from "./plans";
import { notifPlanInstance_Table } from "./planInstance";
import { relations } from "drizzle-orm";

export const notifPurchasedChannelWise_Table = pgTable(
  "notif_purchased_channel",
  {
    id: uuid().primaryKey().defaultRandom(),
    schoolId: uuid()
      .references(() => schoolsTable.id)
      .notNull(),
    purchaseId: uuid()
      .references(() => notifPlanTrans_Table.id)
      .notNull(),
    planId: uuid()
      .references(() => notifPlans_Table.id)
      .notNull(),
    planInstanceId: uuid()
      .references(() => notifPlanInstance_Table.id)
      .notNull(),
    planOptionKey: varchar({ length: 191 }),
    channel: varchar({ length: 20 }).notNull(),
    unitsTotal: integer().notNull(),
    unitsConsumed: integer().default(0).notNull(),
    unitsReserved: integer().default(0).notNull(),
    // activation window: will be set dynamically on activation; if durationDays was set on option,
    // endAt = startAt + durationDays
    startAt: timestamp(),
    endAt: timestamp(),
    isActive: boolean().default(false).notNull(),
    isQueued: boolean().default(false).notNull(),
    queuedOrder: integer().default(0).notNull(),
    metadata: jsonb(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  }
);

export const notifPurchasedChannelWise_Relations = relations(
  notifPurchasedChannelWise_Table,
  ({ one }) => ({
    school: one(schoolsTable, {
      fields: [notifPurchasedChannelWise_Table.schoolId],
      references: [schoolsTable.id],
    }),
    planTransaction: one(notifPlanTrans_Table, {
      fields: [notifPurchasedChannelWise_Table.purchaseId],
      references: [notifPlanTrans_Table.id],
    }),
    plan: one(notifPlans_Table, {
      fields: [notifPurchasedChannelWise_Table.planId],
      references: [notifPlans_Table.id],
    }),
    planInstance: one(notifPlanInstance_Table, {
      fields: [notifPurchasedChannelWise_Table.planInstanceId],
      references: [notifPlanInstance_Table.id],
    }),
  })
);
