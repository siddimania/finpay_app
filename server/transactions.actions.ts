"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type TransactionRow = {
  transaction_id: string;
  user_id: string;
  merchant_id: string | null;
  amount: number | string;
  currency: string;
  status: string;
  payment_method: string;
  payment_date: string | null;
  created_at: string | null;
};

export type TransactionListItem = {
  transactionId: string;
  merchantId: string | null;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  payment_date: string | null;
  createdAt: string | null;
};

export type TransactionDetails = TransactionListItem & {
  userId: string;
};

export type TransactionCreateInput = {
  merchantId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentDate: string;
};

function normalizeTransaction(row: TransactionRow): TransactionListItem {
  return {
    transactionId: row.transaction_id,
    merchantId: row.merchant_id,
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status,
    paymentMethod: row.payment_method,
    payment_date: row.payment_date,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  };
}

export async function getAllTransactions() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .select("transaction_id, user_id, merchant_id, amount, currency, status, payment_method, payment_date, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data: (data ?? []).map(normalizeTransaction) };
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return { success: false, data: [], error: "Failed to fetch transactions." };
  }
}

export async function getTransactionById(transactionId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .select("transaction_id, user_id, merchant_id, amount, currency, status, payment_method, payment_date, created_at")
      .eq("transaction_id", transactionId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return { success: false, data: null, error: "Transaction not found." };
    }

    const transaction: TransactionDetails = {
      transactionId: data.transaction_id,
      userId: data.user_id,
      merchantId: data.merchant_id,
      amount: Number(data.amount),
      currency: data.currency,
      status: data.status,
      paymentMethod: data.payment_method,
      payment_date: data.payment_date,
      createdAt: data.created_at ? new Date(data.created_at).toISOString() : null,
    };

    return { success: true, data: transaction };
  } catch (error) {
    console.error("Failed to fetch transaction details:", error);
    return { success: false, data: null, error: "Failed to fetch transaction details." };
  }
}

export async function getCurrentWeekTransactionsSummary() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .select("amount, payment_date, created_at")
      .order("payment_date", { ascending: true });

    if (error) {
      throw error;
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const dailyTotals = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return { x: date.toLocaleDateString("en-US", { weekday: "short" }), value: 0 };
    });

    let totalSpent = 0;

    for (const item of data ?? []) {
      const paymentDate = item.payment_date ?? item.created_at;
      if (!paymentDate) {
        continue;
      }

      const parsedDate = new Date(paymentDate);
      if (Number.isNaN(parsedDate.getTime())) {
        continue;
      }

      if (parsedDate < startOfWeek || parsedDate > endOfWeek) {
        continue;
      }

      const amount = Number(item.amount) || 0;
      totalSpent += amount;

      const dayIndex = Math.floor((parsedDate.getTime() - startOfWeek.getTime()) / 86400000);
      if (dayIndex >= 0 && dayIndex < dailyTotals.length) {
        dailyTotals[dayIndex].value += amount;
      }
    }

    return { success: true, totalSpent, chartData: dailyTotals };
  } catch (error) {
    console.error("Failed to fetch current week transactions summary:", error);
    return { success: false, totalSpent: 0, chartData: [], error: "Failed to fetch current week transactions summary." };
  }
}

export async function createTransaction(input: TransactionCreateInput) {
  try {
    const supabase = await createClient();
    const payload = {
      transaction_id: `TXN-${Date.now()}`,
      user_id: "guest-user",
      merchant_id: input.merchantId,
      amount: input.amount,
      currency: input.currency,
      status: input.status,
      payment_method: input.paymentMethod,
      payment_date: input.paymentDate || new Date().toISOString().slice(0, 10),
    };

    const { error } = await supabase.from("transactions").insert(payload);

    if (error) {
      throw error;
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return { success: false, error: "Failed to create transaction." };
  }
}
