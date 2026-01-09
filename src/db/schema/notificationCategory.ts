import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "./school";
import { usersTable } from "./user";
import { notification_Table } from "./notification";
import { notificationTemplate_Table } from "./notificationTemplate";

export const notificationCategory_Table = pgTable("notification_category", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  category: varchar().notNull(),
  createdBy: uuid()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const notificationCategoryRelations = relations(
  notificationCategory_Table,
  ({ one, many }) => ({
    school: one(schoolsTable, {
      fields: [notificationCategory_Table.schoolId],
      references: [schoolsTable.id],
    }),
    template: many(notificationTemplate_Table),
    notification: many(notification_Table),
    createdBy: one(usersTable, {
      fields: [notificationCategory_Table.createdBy],
      references: [usersTable.id],
    }),
  })
);
