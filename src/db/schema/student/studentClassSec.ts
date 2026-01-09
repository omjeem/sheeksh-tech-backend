import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "../school/school";
import { classesTable } from "../classSection/class";
import { sessionsTable } from "../school/sessions";
import { sectionsTable } from "../classSection/sections";
import { studentsTable } from "./student";

export const studentClassSectionTable = pgTable(
  "student_classes",
  {
    id: uuid().primaryKey().defaultRandom(),
    schoolId: uuid()
      .references(() => schoolsTable.id)
      .notNull(),
    studentId: uuid()
      .references(() => studentsTable.id)
      .notNull(),
    classId: uuid()
      .references(() => classesTable.id, { onDelete: "cascade" })
      .notNull(),
    sectionId: uuid()
      .references(() => sectionsTable.id)
      .notNull(),
    sessionId: uuid()
      .references(() => sessionsTable.id)
      .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    uniqueStudentPerSession: unique("unique_student_per_session").on(
      table.studentId,
      table.sessionId
    ),
  })
);

export const studentClassesRelations = relations(
  studentClassSectionTable,
  ({ one }) => ({
    student: one(studentsTable, {
      fields: [studentClassSectionTable.studentId],
      references: [studentsTable.id],
    }),
    class: one(classesTable, {
      fields: [studentClassSectionTable.classId],
      references: [classesTable.id],
    }),
    section: one(sectionsTable, {
      fields: [studentClassSectionTable.sectionId],
      references: [sectionsTable.id],
    }),
    session: one(sessionsTable, {
      fields: [studentClassSectionTable.sessionId],
      references: [sessionsTable.id],
    }),
    school: one(schoolsTable, {
      fields: [studentClassSectionTable.schoolId],
      references: [schoolsTable.id],
    }),
  })
);
