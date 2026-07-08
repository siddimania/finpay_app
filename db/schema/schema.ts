import { sql, relations } from "drizzle-orm";
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
  transactionId: text('transaction_id').primaryKey().notNull(),
  userId: text('user_id').notNull(),
  merchantId: text('merchant_id').notNull(),
  amount: numeric('amount').notNull(),
  currency: text('currency').notNull(),
  status: text('status').notNull(),
  paymentMethod: text('payment_method').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
