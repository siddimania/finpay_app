"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type MerchantRow = {
  merchant_id: string;
  merchant_name: string;
  merchant_email: string;
  merchant_phone: string;
  merchant_address: string;
  created_at: string | null;
};

type TransactionRow = {
  transaction_id: string;
  merchant_id: string | null;
  amount: number | string;
  currency: string;
  status: string;
  payment_method: string;
  payment_date: string | null;
  created_at: string | null;
};

export type MerchantListItem = {
  merchantId: string;
  merchantName: string;
  merchantEmail: string;
  merchantPhone: string;
  merchantAddress: string;
  createdAt: string | null;
};

export type MerchantCreateInput = {
  merchantName: string;
  merchantEmail: string;
  merchantPhone: string;
  merchantAddress: string;
};

function normalizeMerchant(row: MerchantRow): MerchantListItem {
  return {
    merchantId: row.merchant_id,
    merchantName: row.merchant_name,
    merchantEmail: row.merchant_email,
    merchantPhone: row.merchant_phone,
    merchantAddress: row.merchant_address,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  };
}

export async function getAllMerchants() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("merchants")
      .select("merchant_id, merchant_name, merchant_email, merchant_phone, merchant_address, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data: (data ?? []).map(normalizeMerchant) };
  } catch (error) {
    console.error("Failed to fetch merchants:", error);
    return { success: false, data: [], error: "Failed to fetch merchants." };
  }
}

export async function getMerchantsCount() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("merchants")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw error;
    }

    return { success: true, count: count ?? 0 };
  } catch (error) {
    console.error("Failed to fetch merchants count:", error);
    return { success: false, count: 0, error: "Failed to fetch merchants count." };
  }
}

export async function getMerchantById(merchantId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("merchants")
      .select("merchant_id, merchant_name, merchant_email, merchant_phone, merchant_address, created_at")
      .eq("merchant_id", merchantId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return { success: false, data: null, error: "Merchant not found." };
    }

    return { success: true, data: normalizeMerchant(data) };
  } catch (error) {
    console.error("Failed to fetch merchant details:", error);
    return { success: false, data: null, error: "Failed to fetch merchant details." };
  }
}

export async function getMerchantTransactions(merchantId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .select("transaction_id, merchant_id, amount, currency, status, payment_method, payment_date, created_at")
      .eq("merchant_id", merchantId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: (data ?? []).map((row: TransactionRow) => ({
        transactionId: row.transaction_id,
        merchantId: row.merchant_id,
        amount: Number(row.amount),
        currency: row.currency,
        status: row.status,
        paymentMethod: row.payment_method,
        payment_date: row.payment_date,
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch merchant transactions:", error);
    return { success: false, data: [], error: "Failed to fetch merchant transactions." };
  }
}

export async function createMerchant(input: MerchantCreateInput) {
  try {
    const supabase = await createClient();
    const payload = {
      merchant_id: `MER-${Date.now()}`,
      merchant_name: input.merchantName,
      merchant_email: input.merchantEmail,
      merchant_phone: input.merchantPhone,
      merchant_address: input.merchantAddress,
    };

    const { error } = await supabase.from("merchants").insert(payload);

    if (error) {
      throw error;
    }

    revalidatePath("/merchants");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to create merchant:", error);
    return { success: false, error: "Failed to create merchant." };
  }
}
