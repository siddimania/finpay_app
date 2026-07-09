"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  createTransaction,
  getAllTransactions,
  type TransactionListItem,
  type TransactionStatusValue,
} from "@/server/transactions.actions";
import { Spinner } from "@/components/ui/spinner";
import { errorToast, successToast } from "@/components/shared/app-toast";

const statusStyles: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
  PENDING: "bg-amber-50 text-amber-600 hover:bg-amber-50",
  FAILED: "bg-red-50 text-red-500 hover:bg-red-50",
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
}

function formatStatus(status: string) {
  return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Pending";
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const day = date.toLocaleDateString("en-GB", { day: "numeric" });
  const month = date.toLocaleDateString("en-GB", { month: "long" });
  const year = date.toLocaleDateString("en-GB", { year: "numeric" });

  return `${day} ${month}, ${year}`;
}

export default function Page() {
  const router = useRouter();
  const [transactions, setTransactions] = React.useState<TransactionListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [form, setForm] = React.useState<{
    merchantId: string;
    amount: string;
    currency: string;
    status: TransactionStatusValue;
    paymentMethod: string;
    paymentDate: string;
  }>({
    merchantId: "",
    amount: "",
    currency: "INR",
    status: "success",
    paymentMethod: "UPI",
    paymentDate: new Date().toISOString().slice(0, 10),
  });

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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await createTransaction({
      merchantId: form.merchantId,
      amount: Number(form.amount),
      currency: form.currency,
      status: form.status,
      paymentMethod: form.paymentMethod,
      paymentDate: form.paymentDate,
    });

    if (result.success) {
      setForm({
        merchantId: "",
        amount: "",
        currency: "INR",
        status: "success",
        paymentMethod: "UPI",
        paymentDate: new Date().toISOString().slice(0, 10),
      });
      setIsOpen(false);
      const result = await getAllTransactions();
      if (result.success) {
        setTransactions(result.data);
        successToast("Success, Created", 2000);
      } else {
        setTransactions([]);
      }
    } else {
      errorToast("Failed to create transaction", 2000);
    }
  }

  return (
    <AppShell activeHref="/transactions">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button className="gap-2 self-start sm:self-auto">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="merchantId">Merchant ID</Label>
                <Input
                  id="merchantId"
                  value={form.merchantId}
                  onChange={(event) => setForm((current) => ({ ...current, merchantId: event.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={form.amount}
                    onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={form.currency}
                    onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={form.status}
                    onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TransactionStatusValue }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Input
                    id="paymentMethod"
                    value={form.paymentMethod}
                    onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={form.paymentDate}
                  onChange={(event) => setForm((current) => ({ ...current, paymentDate: event.target.value }))}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Transaction</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold">All Transactions</h2>
        </div>
        <div className="overflow-x-auto ml-5">
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
                    <div className="flex h-[200px] w-full items-center justify-center rounded-xl md:h-[400px]">
                        <Spinner className="size-15 animate-spin stroke-black" />
                    </div>
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
                      <TableCell className="text-slate-500">{formatDate(tx.payment_date)}</TableCell>
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