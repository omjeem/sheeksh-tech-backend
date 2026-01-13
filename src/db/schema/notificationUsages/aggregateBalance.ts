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
import { relations } from "drizzle-orm";

export const notifAggregateBal_Table = pgTable("notif_aggregate_balance", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id)
    .notNull(),
  channel: varchar({ length: 20 }).notNull(),
  totalPurchased: integer().default(0).notNull(),
  totalConsumed: integer().default(0).notNull(),
  available: integer().default(0).notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const notifAggregateBal_Relations = relations(
  notifAggregateBal_Table,
  ({ one }) => ({
    school: one(schoolsTable, {
      fields: [notifAggregateBal_Table.schoolId],
      references: [schoolsTable.id],
    }),
  })
);
