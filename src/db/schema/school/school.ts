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

import { classesTable } from "../classSection/class";
import { sessionsTable } from "./sessions";
import { subjectsTable } from "../school/subject";
import { usersTable } from "./user";
import { teacherClassSubjectSectionTable } from "../teacher/teacherClassSubSec";
import { studentsTable } from "../student/student";
import { feeStructuresTable } from "./feeStructure";
import { studentClassSectionTable } from "../student/studentClassSec";
import { teachersTable } from "../teacher/teacher";
import { notification_Table } from "../notification/notification";
import { notificationCategory_Table } from "../notification/notificationCategory";
import { notificationTemplate_Table } from "../notification/notificationTemplate";
import { notifPurchasedChannelWise_Table } from "../notificationBilling/planPurchased";
import { notifPlanTrans_Table } from "../notificationBilling/planTransaction";
import { notifAggregateBal_Table } from "../notificationUsages/aggregateBalance";
import { notifPlanInstance_Table } from "../notificationBilling/planInstance";

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
  studentClass: many(studentClassSectionTable),
  notification: many(notification_Table),
  notificationCategory: many(notificationCategory_Table),
  notificationTemplate: many(notificationTemplate_Table),
  notifAggBal : many(notifAggregateBal_Table),
  planInstances : many(notifPlanInstance_Table)
}));
