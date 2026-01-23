import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { notification_Table } from "./notification";
import { notificationRecipient_Table } from "./notificationRecipent";
import { serial } from "drizzle-orm/pg-core";

export const notificationRecipientAck_Table = pgTable(
  "notification_recipient_ack",
  {
    id: serial().primaryKey(),
    notificationId: uuid()
      .references(() => notification_Table.id, {
        onDelete: "cascade",
      })
      .notNull(),
    reciepntId: uuid()
      .references(() => notificationRecipient_Table.id, { onDelete: "cascade" })
      .notNull(),
    ackId: varchar({ length: 50 }),
    createdAt: timestamp().defaultNow().notNull(),
  }
);

export const notificationRecipientAck_Relations = relations(
  notificationRecipientAck_Table,
  ({ one }) => ({
    notification: one(notification_Table, {
      fields: [notificationRecipientAck_Table.notificationId],
      references: [notification_Table.id],
    }),
    recipent: one(notificationRecipient_Table, {
      fields: [notificationRecipientAck_Table.reciepntId],
      references: [notificationRecipient_Table.id],
    }),
  })
);
