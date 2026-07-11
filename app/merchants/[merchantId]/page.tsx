"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppShell from "@/components/shared/app-shell";
import {
  getMerchantById,
  getMerchantTransactions,
  type MerchantListItem,
} from "@/server/merchants.actions";
import { type TransactionListItem } from "@/server/transactions.actions";
import { Spinner } from "@/components/ui/spinner";

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

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
}

export default function Page() {
  const router = useRouter();
  const params = useParams<{ merchantId: string }>();
  const [merchant, setMerchant] = React.useState<MerchantListItem | null>(null);
  const [transactions, setTransactions] = React.useState<TransactionListItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!params?.merchantId) {
        return;
      }

      setIsLoading(true);
      const [merchantResult, transactionResult] = await Promise.all([
        getMerchantById(params.merchantId),
        getMerchantTransactions(params.merchantId),
      ]);

      if (!isMounted) {
        return;
      }

      if (merchantResult.success) {
        setMerchant(merchantResult.data);
      } else {
        setMerchant(null);
      }

      if (transactionResult.success) {
        setTransactions(transactionResult.data);
      } else {
        setTransactions([]);
      }

      setIsLoading(false);
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [params?.merchantId]);

  return (
    <AppShell activeHref="/merchants">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="flex h-[200px] w-full items-center justify-center rounded-xl md:h-[400px]">
            <Spinner className="size-15 animate-spin stroke-black" />
          </div>
        ) : !merchant ? (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Merchant not found</h2>
            <p className="text-sm text-slate-500">
              This merchant could not be loaded.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500">Merchant Details</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {merchant.merchantName}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Merchant ID</p>
                <p className="mt-1 font-medium">{merchant.merchantId}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 font-medium">{merchant.merchantEmail}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Phone</p>
                <p className="mt-1 font-medium">{merchant.merchantPhone}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Address</p>
                <p className="mt-1 font-medium">{merchant.merchantAddress}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold">
            Transactions by this Merchant
          </h2>
        </div>
        <div className="overflow-x-auto ml-5">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>S.No</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-slate-400"
                  >
                    No transactions found for this merchant.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx, index) => (
                  <TableRow
                    key={tx.transactionId}
                    className="cursor-pointer hover:bg-slate-50"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      router.push(`/transactions/${tx.transactionId}`)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/transactions/${tx.transactionId}`);
                      }
                    }}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {tx.transactionId}
                    </TableCell>
                    <TableCell>{formatCurrency(tx.amount)}</TableCell>
                    <TableCell>{tx.status}</TableCell>
                    <TableCell>{tx.paymentMethod}</TableCell>
                    <TableCell>{formatDate(tx.payment_date)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  );
}
