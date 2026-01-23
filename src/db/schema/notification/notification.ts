import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";
import { schoolsTable } from "../school/school";
import { usersTable } from "../school/user";
import { notificationCategory_Table } from "./notificationCategory";
import { notificationTemplate_Table } from "./notificationTemplate";
import { notificationStatus_Table } from "./notificationStatus";
import { notificationRecipient_Table } from "./notificationRecipent";
import { notifSchoolLedger_table } from "../notificationUsages/schoolLedger";
import { notificationRecipientAck_Table } from "./notificationRecipentAck";

export const notification_Table = pgTable("notification", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  templateId: uuid()
    .references(() => notificationTemplate_Table.id)
    .notNull(),
  categoryId: uuid()
    .references(() => notificationCategory_Table.id)
    .notNull(),
  payload: jsonb(),
  channels: jsonb(),
  isDeleted: boolean().default(false),
  createdBy: uuid()
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const notificationRelations = relations(
  notification_Table,
  ({ one, many }) => ({
    school: one(schoolsTable, {
      fields: [notification_Table.schoolId],
      references: [schoolsTable.id],
    }),
    template: one(notificationTemplate_Table, {
      fields: [notification_Table.templateId],
      references: [notificationTemplate_Table.id],
    }),
    category: one(notificationCategory_Table, {
      fields: [notification_Table.categoryId],
      references: [notificationCategory_Table.id],
    }),
    status: many(notificationStatus_Table),
    recipents: many(notificationRecipient_Table),
    createdBy: one(usersTable, {
      fields: [notification_Table.createdBy],
      references: [usersTable.id],
    }),
    notifLedger: many(notifSchoolLedger_table),
    notifAck : many(notificationRecipientAck_Table)
  })
);
