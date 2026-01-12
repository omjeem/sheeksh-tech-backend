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
import { notifPlans_Table } from "./plans";
import { usersTable } from "../school/user";
import Constants from "@/config/constants";
import { relations } from "drizzle-orm";
import { notifPlanInstance_Table } from "./planInstance";

export const notifPlanTrans_Table = pgTable("notif_plan_transactions", {
  id: uuid().primaryKey().defaultRandom(),
  planInstanceId: uuid()
    .references(() => notifPlanInstance_Table.id)
    .notNull(),
  purchasedBy: uuid().references(() => usersTable.id),
  totalPrice: integer().notNull(),
  currency: varchar({ length: 10 }).default("INR"),
  paymentProvider: varchar({ length: 100 }),
  providerTxId: varchar({ length: 255 }),
  status: varchar({ length: 30 })
    .default(Constants.NOTIFICATION.BILLING.PURCHASE_STATUS.PENDING)
    .notNull(),
  requestedActivateAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  metadata: jsonb(),
});

export const notifPlanTrans_Relations = relations(
  notifPlanTrans_Table,
  ({ one }) => ({
    planInstance: one(notifPlanInstance_Table, {
      fields: [notifPlanTrans_Table.planInstanceId],
      references: [notifPlanInstance_Table.id],
    }),
    purchasedBy: one(usersTable, {
      fields: [notifPlanTrans_Table.purchasedBy],
      references: [usersTable.id],
    }),
  })
);
