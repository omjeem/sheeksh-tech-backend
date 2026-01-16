import {
  varchar,
  jsonb,
  timestamp,
  integer,
  text,
  uuid,
  pgTable,
  boolean,
} from "drizzle-orm/pg-core";
import { schoolsTable } from "../school/school";
import { relations } from "drizzle-orm";

export const notifChannelUsageLimit_Table = pgTable(
  "notif_channel_usage_limit",
  {
    id: uuid().primaryKey().defaultRandom(),
    schoolId: uuid().references(() => schoolsTable.id),
    orgType: varchar({ length: 30 }).notNull(),
    channel: varchar({ length: 30 }),
    frequency: varchar({ length: 30 }).notNull(),
    limit: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  }
);

export const notifChannelLimit_Relations = relations(
  notifChannelUsageLimit_Table,
  ({ one }) => ({
    school: one(schoolsTable, {
      fields: [notifChannelUsageLimit_Table.schoolId],
      references: [schoolsTable.id],
    }),
  })
);
