import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";
import { schoolsTable } from "../school/school";
import { usersTable } from "../school/user";
import { notificationCategory_Table } from "./notificationCategory";

export const notificationTemplate_Table = pgTable("notification_template", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid()
    .references(() => notificationCategory_Table.id)
    .notNull(),
  name: varchar({ length: 191 }),
  // template payload: { subject, bodyHtml, bodyText, defaultChannel, variables: {name, amount} }
  templatePayload: jsonb().notNull(),
  isDeleted: boolean().default(false),
  createdBy: uuid()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const notificationTemplateRelations = relations(
  notificationTemplate_Table,
  ({ one, many }) => ({
    school: one(schoolsTable, {
      fields: [notificationTemplate_Table.schoolId],
      references: [schoolsTable.id],
    }),
    category: one(notificationCategory_Table, {
      fields: [notificationTemplate_Table.categoryId],
      references: [notificationCategory_Table.id],
    }),
    createdBy: one(usersTable, {
      fields: [notificationTemplate_Table.createdBy],
      references: [usersTable.id],
    }),
  })
);
