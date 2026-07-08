import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  numeric,
  pgPolicy,
  pgRole,
  pgSchema,
  uuid,
  serial,
  real,
} from "drizzle-orm/pg-core";

export const transactions = pgTable('transactions', {
  transaction_id: text('transaction_id').primaryKey().notNull(),
  user_id: text('user_id').notNull(),
  merchant_id: text('merchant_id').notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  status: text('status').notNull(),
  payment_method: text('payment_method').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
