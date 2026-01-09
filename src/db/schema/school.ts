import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";

import { classesTable } from "./class";
import { sessionsTable } from "./sessions";
import { subjectsTable } from "./subject";
import { usersTable } from "./user";
import { teacherClassSubjectSectionTable } from "./teacherClassSubSec";
import { studentsTable } from "./student";
import { feeStructuresTable } from "./feeStructure";
import { studentClassesTable } from "./studentClass";
import { teachersTable } from "./teacher";
import { notification_Table } from "./notification";
import { notificationCategory_Table } from "./notificationCategory";
import { notificationTemplate_Table } from "./notificationTemplate";

export const schoolsTable = pgTable("schools", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  url: varchar({ length: 255 }).unique().notNull(),
  city: varchar().notNull(),
  state: varchar().notNull(),
  address: text().notNull(),
  phone: varchar().notNull(),
  meta: jsonb(),
  isApproved: boolean().default(false),
  isSuspended: boolean().default(false),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const schoolsRelations = relations(schoolsTable, ({ many }) => ({
  users: many(usersTable),
  students: many(studentsTable),
  teachers: many(teachersTable),
  sessions: many(sessionsTable),
  classes: many(classesTable),
  feeStructures: many(feeStructuresTable),
  subjects: many(subjectsTable),
  teacherClass: many(teacherClassSubjectSectionTable),
  studentClass: many(studentClassesTable),
  notification: many(notification_Table),
  notificationCategory: many(notificationCategory_Table),
  notificationTemplate: many(notificationTemplate_Table),
}));
