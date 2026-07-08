"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import AppShell from "@/components/shared/app-shell";
import {
  getAllTransactions,
  type TransactionListItem,
} from "@/server/transactions.actions";

const statusStyles: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
  PENDING: "bg-amber-50 text-amber-600 hover:bg-amber-50",
  FAILED: "bg-red-50 text-red-500 hover:bg-red-50",
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
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

  return date.toLocaleDateString("en-US");
}

export default function Page() {
  const router = useRouter();
  const [transactions, setTransactions] = React.useState<TransactionListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function loadTransactions() {
      setIsLoading(true);
      const result = await getAllTransactions();

      if (!isMounted) {
        return;
      }

      if (result.success) {
        setTransactions(result.data);
      } else {
        setTransactions([]);
      }

      setIsLoading(false);
    }

    void loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <AppShell activeHref="/transactions">
      <Card className="w-full max-w-xs p-5">
        <p className="text-sm text-slate-500">Total Transactions Amount</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight">
          {formatCurrency(totalAmount)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {transactions.length} transaction
          {transactions.length === 1 ? "" : "s"}
        </p>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold">All Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-slate-400">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-slate-400">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => {
                  const badgeClass = statusStyles[tx.status.toUpperCase()] ?? statusStyles.PENDING;

                  return (
                    <TableRow
                      key={tx.transactionId}
                      className="cursor-pointer hover:bg-slate-50"
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/transactions/${tx.transactionId}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(`/transactions/${tx.transactionId}`);
                        }
                      }}
                    >
                      <TableCell className="font-medium">{tx.merchantId}</TableCell>
                      <TableCell>{formatCurrency(tx.amount)}</TableCell>
                      <TableCell className="text-slate-500">{tx.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("font-medium", badgeClass)}>
                          {formatStatus(tx.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">{tx.transactionId}</TableCell>
                      <TableCell className="text-slate-500">{formatDate(tx.createdAt)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  );
}