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
  date,
} from "drizzle-orm/pg-core";

export const transactions = pgTable('transactions', {
  transaction_id: text('transaction_id').primaryKey().notNull(),
  user_id: text('user_id').notNull(),
  merchant_id: text('merchant_id').references(() => merchants.merchant_id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  status: text('status').notNull(),
  payment_method: text('payment_method').notNull(),
  payment_date: date('payment_date', { mode: 'string' }).notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const merchants = pgTable('merchants', {
  merchant_id: text('merchant_id').primaryKey().notNull(),
  merchant_name: text('merchant_name').notNull(),
  merchant_email: text('merchant_email').notNull(),
  merchant_phone: text('merchant_phone').notNull(),
  merchant_address: text('merchant_address').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const refunds = pgTable('refunds', {
  refund_id: uuid("uuid").primaryKey().defaultRandom(),
  transaction_id: text('transaction_id').references(() => transactions.transaction_id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

