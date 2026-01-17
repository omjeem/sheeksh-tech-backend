import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "./school";
import { teacherClassSubjectSectionTable } from "../teacher/teacherClassSubSec";
import { feeStructuresTable } from "./feeStructure";
import { studentClassSectionTable } from "../student/studentClassSec";

// Academic sessions (e.g., 2025-2026)
export const sessionsTable = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar({ length: 100 }).notNull(),
  startDate: timestamp().notNull(),
  endDate: timestamp().notNull(),
  isActive: boolean().default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const sessionsRelations = relations(sessionsTable, ({ one, many }) => ({
  school: one(schoolsTable, {
    fields: [sessionsTable.schoolId],
    references: [schoolsTable.id],
  }),
  studentClasses: many(studentClassSectionTable),
  feeStructures: many(feeStructuresTable),
  teacherClassSubject: many(teacherClassSubjectSectionTable),
}));
