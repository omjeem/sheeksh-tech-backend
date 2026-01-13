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
import { notifPurchasedChannelWise_Table } from "../notificationBilling/planPurchased";
import { notification_Table } from "../notification/notification";
import { relations } from "drizzle-orm";
import { notifPlanInstance_Table } from "../notificationBilling/planInstance";

export const notifSchoolLedger_table = pgTable("notif_school_ledger", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id)
    .notNull(),
  planInstanceId: uuid().references(() => notifPlanInstance_Table.id),
  channelId: uuid().references(() => notifPurchasedChannelWise_Table.id),
  notificationId: uuid().references(() => notification_Table.id),
  operation: varchar({ length: 40 }).notNull(),
  creditsUsed: integer().default(0).notNull(),
  metadata: jsonb(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const notifSchoolLedger_Relations = relations(
  notifSchoolLedger_table,
  ({ one }) => ({
    school: one(schoolsTable, {
      fields: [notifSchoolLedger_table.schoolId],
      references: [schoolsTable.id],
    }),
    channel: one(notifPurchasedChannelWise_Table, {
      fields: [notifSchoolLedger_table.channelId],
      references: [notifPurchasedChannelWise_Table.id],
    }),
    notification: one(notification_Table, {
      fields: [notifSchoolLedger_table.notificationId],
      references: [notification_Table.id],
    }),
    planInstance: one(notifPlanInstance_Table, {
      fields: [notifSchoolLedger_table.planInstanceId],
      references: [notifPlanInstance_Table.id],
    }),
  })
);
