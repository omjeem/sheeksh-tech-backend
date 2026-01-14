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

export const notifiSystemInventory_Table = pgTable(
  "notif_system_inventory",
  {
    id: uuid().primaryKey().defaultRandom(),
    channel: varchar({ length: 20 }).notNull(),
    provider: varchar({ length: 191 }),
    providerInvoiceId: varchar({ length: 255 }),
    unitsPurchased: integer().notNull(),
    unitsConsumed: integer().default(0).notNull(),
    available: integer().notNull(),
    purchasedAt: timestamp().defaultNow().notNull(),
    metadata: jsonb(),
    isActive : boolean().default(false).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  }
);
