import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "./school";
import { usersTable } from "./user";
import { teacherSchoolHistoryTable } from "./teacherSchoolHis";
import { teacherClassSubjectSectionTable } from "./teacherClassSubSec";

export const teachersTable = pgTable("teachers", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => usersTable.id)
    .notNull()
    .unique(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  startDate: timestamp(),
  endDate: timestamp(),
  designation: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const teachersRelations = relations(teachersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [teachersTable.userId],
    references: [usersTable.id],
  }),
  school: one(schoolsTable, {
    fields: [teachersTable.schoolId],
    references: [schoolsTable.id],
  }),
  history: many(teacherSchoolHistoryTable),
  classSubjectSection: many(teacherClassSubjectSectionTable),
}));
