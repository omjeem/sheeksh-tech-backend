import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "./school";
import { sessionsTable } from "./sessions";
import { studentFeesTable } from "./studentFee";

// Fees structure (per school)
export const feeStructuresTable = pgTable("fee_structures", {
  id: uuid().primaryKey().defaultRandom(),
  schoolId: uuid()
    .references(() => schoolsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar({ length: 100 }).notNull(),
  amount: integer().notNull(),
  sessionId: uuid()
    .references(() => sessionsTable.id)
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const feeStructuresRelations = relations(
  feeStructuresTable,
  ({ one, many }) => ({
    school: one(schoolsTable, {
      fields: [feeStructuresTable.schoolId],
      references: [schoolsTable.id],
    }),
    session: one(sessionsTable, {
      fields: [feeStructuresTable.sessionId],
      references: [sessionsTable.id],
    }),
    studentFees: many(studentFeesTable),
  })
);
