import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "./school";
import { studentsTable } from "../student/student";
import { teachersTable } from "../teacher/teacher";
import { notificationRecipient_Table } from "../notification/notificationRecipent";
import { notification_Table } from "../notification/notification";
import { notificationCategory_Table } from "../notification/notificationCategory";
import { notificationTemplate_Table } from "../notification/notificationTemplate";
import { notifPlanTrans_Table } from "../notificationBilling/planTransaction";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  phone: varchar().notNull(),
  dateOfBirth: timestamp(),
  isSuspended: boolean().default(false),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  school: one(schoolsTable, {
    fields: [usersTable.schoolId],
    references: [schoolsTable.id],
  }),
  student: one(studentsTable, {
    fields: [usersTable.id],
    references: [studentsTable.userId],
  }),
  teacher: one(teachersTable, {
    fields: [usersTable.id],
    references: [teachersTable.userId],
  }),
  notificationRecipent: many(notificationRecipient_Table),
  notificationCreated: many(notification_Table),
  categoryCreated: many(notificationCategory_Table),
  templateCreated: many(notificationTemplate_Table),
  purchasedPlan: many(notifPlanTrans_Table),
}));
