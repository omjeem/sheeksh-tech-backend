import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "./school";
import { classesTable } from "./class";
import { sessionsTable } from "./sessions";
import { sectionsTable } from "./sections";
import { studentsTable } from "./student";

export const studentClassesTable = pgTable(
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
  studentClassesTable,
  ({ one }) => ({
    student: one(studentsTable, {
      fields: [studentClassesTable.studentId],
      references: [studentsTable.id],
    }),
    class: one(classesTable, {
      fields: [studentClassesTable.classId],
      references: [classesTable.id],
    }),
    section: one(sectionsTable, {
      fields: [studentClassesTable.sectionId],
      references: [sectionsTable.id],
    }),
    session: one(sessionsTable, {
      fields: [studentClassesTable.sessionId],
      references: [sessionsTable.id],
    }),
    school: one(schoolsTable, {
      fields: [studentClassesTable.schoolId],
      references: [schoolsTable.id],
    }),
  })
);
