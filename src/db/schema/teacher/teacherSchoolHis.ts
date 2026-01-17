import { pgTable, uuid, timestamp, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { teachersTable } from "./teacher";
import { schoolsTable } from "../school/school";

export const teacherSchoolHistoryTable = pgTable("teacher_school_history", {
  id: serial().primaryKey(),
  teacherId: uuid()
    .references(() => teachersTable.id)
    .notNull(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  startDate: timestamp().defaultNow().notNull(),
  endDate: timestamp(),
});

export const teacherSchoolHistoryRelations = relations(
  teacherSchoolHistoryTable,
  ({ one }) => ({
    teacher: one(teachersTable, {
      fields: [teacherSchoolHistoryTable.teacherId],
      references: [teachersTable.id],
    }),
    school: one(schoolsTable, {
      fields: [teacherSchoolHistoryTable.schoolId],
      references: [schoolsTable.id],
    }),
  })
);
