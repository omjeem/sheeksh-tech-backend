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

export const notifSchoolLedger_table = pgTable("notif_school_ledger", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id)
    .notNull(),
  purchasedChannelId: uuid().references(
    () => notifPurchasedChannelWise_Table.id
  ),
  notificationId: uuid().references(() => notification_Table.id),
  channel: varchar({ length: 20 }).notNull(),
  delta: integer().notNull(),
  creditsUsed: integer().notNull(),
  reason: varchar({ length: 40 }).notNull(),
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
    purchaseChannel: one(notifPurchasedChannelWise_Table, {
      fields: [notifSchoolLedger_table.purchasedChannelId],
      references: [notifPurchasedChannelWise_Table.id],
    }),
    notification: one(notification_Table, {
      fields: [notifSchoolLedger_table.notificationId],
      references: [notification_Table.id],
    }),
  })
);
