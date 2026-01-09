import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { notification_Table } from "./notification";
import Constants from "@/config/constants";

export const notificationStatus_Table = pgTable("notification_status", {
  id: uuid().primaryKey().defaultRandom(),
  notificationId: uuid()
    .references(() => notification_Table.id, {
      onDelete: "cascade",
    })
    .notNull(),
  channel: varchar().notNull(),
  status: varchar().default(Constants.NOTIFICATION.SENT_STATUS.DRAFT),
  totalRecipients: integer().default(0),
  totalSuccess: integer().default(0),
  totalFailure: integer().default(0),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const notificationStatusRelations = relations(
  notificationStatus_Table,
  ({ one, many }) => ({
    notfication: one(notification_Table, {
      fields: [notificationStatus_Table.notificationId],
      references: [notification_Table.id],
    }),
  })
);
