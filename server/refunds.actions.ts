"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type RefundListItem = {
  refundId: string;
  transactionId: string;
  amount: number;
  status: string;
  reason: string;
  createdAt: string | null;
};

export type RefundCreateInput = {
  transactionId: string;
  amount: number;
  reason: string;
};

type RefundRow = {
  uuid: string;
  transaction_id: string;
  amount: number | string;
  status: string;
  reason: string;
  created_at: string | null;
};

function normalizeRefund(row: RefundRow): RefundListItem {
  return {
    refundId: row.uuid,
    transactionId: row.transaction_id,
    amount: Number(row.amount),
    status: row.status,
    reason: row.reason,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  };
}

export async function getRefundsForTransaction(transactionId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("refunds")
      .select("uuid, transaction_id, amount, status, reason, created_at")
      .eq("transaction_id", transactionId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    console.log("Fetched refunds:", data);

    return { success: true, data: (data ?? []).map(normalizeRefund) };
  } catch (error) {
    console.error("Failed to fetch refunds:", error);
    return { success: false, data: [], error: "Failed to fetch refunds." };
  }
}

export async function createRefund(input: RefundCreateInput) {
  try {
    const supabase = await createClient();

    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("transaction_id", input.transactionId)
      .single();

    if (transactionError || !transaction) {
      return { success: false, error: "Transaction not found." };
    }

    const transactionAmount = Number(transaction.amount) || 0;
    const refundAmount = Number(input.amount);

    if (Number.isNaN(refundAmount) || refundAmount <= 0) {
      return { success: false, error: "Refund amount must be greater than zero." };
    }

    if (refundAmount > transactionAmount) {
      return { success: false, error: "Refund amount cannot exceed the transaction amount." };
    }

    const { data: existingRefunds, error: refundsError } = await supabase
      .from("refunds")
      .select("amount")
      .eq("transaction_id", input.transactionId);

    if (refundsError) {
      throw refundsError;
    }

    const existingRefundTotal = (existingRefunds ?? []).reduce((sum, row) => sum + Number(row.amount || 0), 0);

    if (existingRefundTotal + refundAmount > transactionAmount) {
      return {
        success: false,
        error: "Refund total cannot exceed the transaction amount.",
      };
    }

    const { error: insertError } = await supabase.from("refunds").insert({
      transaction_id: input.transactionId,
      amount: refundAmount,
      status: "successfull",
      reason: input.reason,
    });

    if (insertError) {
      throw insertError;
    }

    revalidatePath("/transactions");
    revalidatePath(`/transactions/${input.transactionId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to create refund:", error);
    return { success: false, error: "Failed to create refund." };
  }
}
