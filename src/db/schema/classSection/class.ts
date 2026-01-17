import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "../school/school";
import { sectionsTable } from "./sections";
import { teacherClassSubjectSectionTable } from "../teacher/teacherClassSubSec";

// Classes (e.g., Grade 10)
export const classesTable = pgTable("classes", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar({ length: 100 }).notNull(),
  isDeleted: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
});

export const classesRelations = relations(classesTable, ({ one, many }) => ({
  school: one(schoolsTable, {
    fields: [classesTable.schoolId],
    references: [schoolsTable.id],
  }),
  sections: many(sectionsTable),
  classSubjectSection: many(teacherClassSubjectSectionTable),
}));
