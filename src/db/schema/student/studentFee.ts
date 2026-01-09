import { pgTable, uuid, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { studentsTable } from "../student/student";
import { feeStructuresTable } from "../school/feeStructure";

// Student fee assignments
export const studentFeesTable = pgTable("student_fees", {
  id: serial().primaryKey(),
  studentId: uuid()
    .references(() => studentsTable.id, { onDelete: "cascade" })
    .notNull(),
  feeStructureId: uuid()
    .references(() => feeStructuresTable.id)
    .notNull(),
  amountPaid: integer().default(0).notNull(),
  dueDate: timestamp().notNull(),
  paidAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const studentFeesRelations = relations(studentFeesTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [studentFeesTable.studentId],
    references: [studentsTable.id],
  }),
  feeStructure: one(feeStructuresTable, {
    fields: [studentFeesTable.feeStructureId],
    references: [feeStructuresTable.id],
  }),
}));
