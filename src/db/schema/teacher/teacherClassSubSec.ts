import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "../school/school";
import { teachersTable } from "./teacher";
import { classesTable } from "../classSection/class";
import { sessionsTable } from "../school/sessions";
import { sectionsTable } from "../classSection/sections";
import { subjectsTable } from "../school/subject";

export const teacherClassSubjectSectionTable = pgTable(
  "teacherClassSubjectSection",
  {
    id: uuid().primaryKey().defaultRandom(),
    schoolId: uuid()
      .references(() => schoolsTable.id)
      .notNull(),
    teacherId: uuid()
      .references(() => teachersTable.id)
      .notNull(),
    classId: uuid()
      .references(() => classesTable.id)
      .notNull(),
    sessionId: uuid()
      .references(() => sessionsTable.id)
      .notNull(),
    sectionId: uuid()
      .references(() => sectionsTable.id)
      .notNull(),
    subjectId: uuid()
      .references(() => subjectsTable.id)
      .notNull(),
    fromDate: timestamp().notNull(),
    endDate: timestamp(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  }
);

export const teacherClassSubjectSectionRelations = relations(
  teacherClassSubjectSectionTable,
  ({ one }) => ({
    teacher: one(teachersTable, {
      fields: [teacherClassSubjectSectionTable.teacherId],
      references: [teachersTable.id],
    }),
    class: one(classesTable, {
      fields: [teacherClassSubjectSectionTable.classId],
      references: [classesTable.id],
    }),
    section: one(sectionsTable, {
      fields: [teacherClassSubjectSectionTable.sectionId],
      references: [sectionsTable.id],
    }),
    session: one(sessionsTable, {
      fields: [teacherClassSubjectSectionTable.sessionId],
      references: [sessionsTable.id],
    }),
    subject: one(subjectsTable, {
      fields: [teacherClassSubjectSectionTable.subjectId],
      references: [subjectsTable.id],
    }),
    school: one(schoolsTable, {
      fields: [teacherClassSubjectSectionTable.schoolId],
      references: [schoolsTable.id],
    }),
  })
);
