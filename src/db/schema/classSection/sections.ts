import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "../school/school";
import { classesTable } from "./class";
import { teacherClassSubjectSectionTable } from "../teacher/teacherClassSubSec";
import { studentClassSectionTable } from "../student/studentClassSec";

// Sections (e.g., 10A, 10B)
export const sectionsTable = pgTable("sections", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  classId: uuid()
    .references(() => classesTable.id)
    .notNull(),
  name: varchar({ length: 50 }).notNull(),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
});

export const sectionsRelations = relations(sectionsTable, ({ one, many }) => ({
  class: one(classesTable, {
    fields: [sectionsTable.classId],
    references: [classesTable.id],
  }),
  school: one(schoolsTable, {
    fields: [sectionsTable.schoolId],
    references: [schoolsTable.id],
  }),
  studentClasses: many(studentClassSectionTable),
  classSubjectSection: many(teacherClassSubjectSectionTable),
}));
