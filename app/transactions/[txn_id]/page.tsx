"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppShell from "@/components/shared/app-shell";
import {
  getTransactionById,
  type TransactionDetails,
} from "@/server/transactions.actions";

const statusStyles: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
  PENDING: "bg-amber-50 text-amber-600 hover:bg-amber-50",
  FAILED: "bg-red-50 text-red-500 hover:bg-red-50",
};

function formatCurrency(value: number, currency: string) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
}

function formatStatus(status: string) {
  return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Pending";
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Page() {
  const router = useRouter();
  const params = useParams<{ txn_id: string }>();
  const [transaction, setTransaction] = React.useState<TransactionDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function loadTransaction() {
      if (!params?.txn_id) {
        return;
      }

      setIsLoading(true);
      const result = await getTransactionById(params.txn_id);

      if (!isMounted) {
        return;
      }

      if (result.success && result.data) {
        setTransaction(result.data);
      } else {
        setTransaction(null);
      }

      setIsLoading(false);
    }

    void loadTransaction();

    return () => {
      isMounted = false;
    };
  }, [params?.txn_id]);

  const badgeClass = statusStyles[transaction?.status?.toUpperCase() ?? "PENDING"] ?? statusStyles.PENDING;

  return (
    <AppShell activeHref="/transactions">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="max-w-3xl p-6">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading transaction details...</p>
        ) : !transaction ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Transaction not found</h2>
            <p className="text-sm text-slate-500">
              The requested transaction could not be loaded.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Transaction Details</p>
                <h2 className="text-2xl font-semibold tracking-tight">{transaction.transactionId}</h2>
              </div>
              <Badge variant="secondary" className={badgeClass}>
                {formatStatus(transaction.status)}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Merchant</p>
                <p className="mt-1 font-medium">{transaction.merchantId}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Amount</p>
                <p className="mt-1 font-medium">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Payment Method</p>
                <p className="mt-1 font-medium">{transaction.paymentMethod}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Currency</p>
                <p className="mt-1 font-medium">{transaction.currency}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">User ID</p>
                <p className="mt-1 font-medium break-all">{transaction.userId}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Created</p>
                <p className="mt-1 font-medium">{formatDate(transaction.createdAt)}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button">Refund</Button>
            </div>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
