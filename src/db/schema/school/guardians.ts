import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schoolsTable } from "./school";
import { usersTable } from "./user";
import { unique } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";

export const userGuardiansTable = pgTable(
  "user_guardian",
  {
    id: uuid().primaryKey().defaultRandom(),
    schoolId: uuid()
      .references(() => schoolsTable.id, { onDelete: "cascade" })
      .notNull(),
    childUserId: uuid()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    guardianUserId: uuid()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    isPrimary: boolean().notNull(),
    isActive: boolean().default(true),
    relation: varchar({ length: 20 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    uniqueSrNoPerSchool: unique("unique_children_guardian").on(
      table.childUserId,
      table.guardianUserId
    ),
  })
);

export const userGuardiansRelations = relations(
  userGuardiansTable,
  ({ one, many }) => ({
    school: one(schoolsTable, {
      fields: [userGuardiansTable.schoolId],
      references: [schoolsTable.id],
    }),
    children: one(usersTable, {
      fields: [userGuardiansTable.childUserId],
      references: [usersTable.id],
      relationName: "children_guardian",
    }),
    guardian: one(usersTable, {
      fields: [userGuardiansTable.guardianUserId],
      references: [usersTable.id],
      relationName: "guardian_children",
    }),
  })
);
