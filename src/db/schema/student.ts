import { pgTable, uuid, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "./school";
import { usersTable } from "./user";
import { studentClassesTable } from "./studentClass";
import { studentFeesTable } from "./studentFee";

export const studentsTable = pgTable(
  "students",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .references(() => usersTable.id)
      .notNull()
      .unique(),
    schoolId: uuid()
      .references(() => schoolsTable.id, { onDelete: "cascade" })
      .notNull(),
    srNo: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    uniqueSrNoPerSchool: unique("unique_sr_no_per_school").on(
      table.schoolId,
      table.srNo
    ),
  })
);

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [studentsTable.userId],
    references: [usersTable.id],
  }),
  school: one(schoolsTable, {
    fields: [studentsTable.schoolId],
    references: [schoolsTable.id],
  }),
  studentClasses: many(studentClassesTable),
  studentFees: many(studentFeesTable),
}));
