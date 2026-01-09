import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "../school/school";
import { teacherClassSubjectSectionTable } from "../teacher/teacherClassSubSec";

export const subjectsTable = pgTable("subjects", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id)
    .notNull(),
  subject: varchar().notNull(),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const subjectRelations = relations(subjectsTable, ({ one, many }) => ({
  school: one(schoolsTable, {
    fields: [subjectsTable.schoolId],
    references: [schoolsTable.id],
  }),
  classSubjectSection: many(teacherClassSubjectSectionTable),
}));
