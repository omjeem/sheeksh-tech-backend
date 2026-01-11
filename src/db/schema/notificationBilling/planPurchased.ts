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
import { notifPlanInstance_Table } from "./planInstance";
import { relations } from "drizzle-orm";

export const notifPurchasedChannelWise_Table = pgTable(
  "notif_purchased_channel",
  {
    id: uuid().primaryKey().defaultRandom(),
    planInstanceId: uuid()
      .references(() => notifPlanInstance_Table.id)
      .notNull(),
    channel: varchar({ length: 20 }).notNull(),
    unitsTotal: integer().notNull(),
    unitsConsumed: integer().default(0).notNull(),
    limits: jsonb().default({}),
    metadata: jsonb(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  }
);

export const notifPurchasedChannelWise_Relations = relations(
  notifPurchasedChannelWise_Table,
  ({ one }) => ({
    planInstance: one(notifPlanInstance_Table, {
      fields: [notifPurchasedChannelWise_Table.planInstanceId],
      references: [notifPlanInstance_Table.id],
    }),
  })
);
