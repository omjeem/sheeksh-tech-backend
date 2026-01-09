import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { notification_Table } from "./notification";
import Constants from "@/config/constants";

export const notificationRecipient_Table = pgTable("notification_recipient", {
  id: uuid().primaryKey().defaultRandom(),
  notificationId: uuid()
    .references(() => notification_Table.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: uuid()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),

  channel: varchar(),
  payloadVariables: jsonb(),

  status: varchar()
    .default(Constants.NOTIFICATION.SENT_STATUS.PENDING)
    .notNull(),
  sentAt: timestamp(),
  deliveredAt: timestamp(),
  failedAt: timestamp(),

  // provider identifiers (e.g., SES message-id, Twilio sid) and last error
  // providerMessageId: varchar({ length: 255 }),
  // lastError: jsonb(),

  seenOnPortalAt: timestamp(),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const notificationRecipientRelations = relations(
  notificationRecipient_Table,
  ({ one, many }) => ({
    notification: one(notification_Table, {
      fields: [notificationRecipient_Table.notificationId],
      references: [notification_Table.id],
    }),
    user: one(usersTable, {
      fields: [notificationRecipient_Table.userId],
      references: [usersTable.id],
    }),
  })
);
