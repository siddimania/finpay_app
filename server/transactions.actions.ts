"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db/index";
import { transactions } from "@/db/schema/schema";

export type TransactionListItem = {
  transactionId: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string | null;
};

export type TransactionDetails = TransactionListItem & {
  userId: string;
};

export async function getAllTransactions() {
  try {
    const rows = await db
      .select({
        transactionId: transactions.transaction_id,
        merchantId: transactions.merchant_id,
        amount: transactions.amount,
        currency: transactions.currency,
        status: transactions.status,
        paymentMethod: transactions.payment_method,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .orderBy(desc(transactions.createdAt));

    const data: TransactionListItem[] = rows.map((row) => ({
      transactionId: row.transactionId,
      merchantId: row.merchantId,
      amount: Number(row.amount),
      currency: row.currency,
      status: row.status,
      paymentMethod: row.paymentMethod,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return { success: false, data: [], error: "Failed to fetch transactions." };
  }
}

export async function getTransactionById(transactionId: string) {
  try {
    const [row] = await db
      .select({
        transactionId: transactions.transaction_id,
        userId: transactions.user_id,
        merchantId: transactions.merchant_id,
        amount: transactions.amount,
        currency: transactions.currency,
        status: transactions.status,
        paymentMethod: transactions.payment_method,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .where(eq(transactions.transaction_id, transactionId))
      .limit(1);

    if (!row) {
      return { success: false, data: null, error: "Transaction not found." };
    }

    const data: TransactionDetails = {
      transactionId: row.transactionId,
      userId: row.userId,
      merchantId: row.merchantId,
      amount: Number(row.amount),
      currency: row.currency,
      status: row.status,
      paymentMethod: row.paymentMethod,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    };

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch transaction details:", error);
    return { success: false, data: null, error: "Failed to fetch transaction details." };
  }
}
