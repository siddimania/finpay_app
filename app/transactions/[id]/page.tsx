"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import AppShell from "@/components/shared/app-shell";
import {
  getTransactionById,
  updateTransactionStatus,
  type TransactionDetails,
  type TransactionStatusValue,
} from "@/server/transactions.actions";
import { createRefund, getRefundsForTransaction, type RefundListItem } from "@/server/refunds.actions";
import { Spinner } from "@/components/ui/spinner";

const statusStyles: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
  PENDING: "bg-amber-50 text-amber-600 hover:bg-amber-600",
  FAILED: "bg-red-50 text-red-500 hover:bg-red-50",
};

function formatCurrency(value: number, currency: string) {
  return value.toLocaleString("en-IN", {
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
  const params = useParams<{ id: string }>();
  const [transaction, setTransaction] = React.useState<TransactionDetails | null>(null);
  const [refunds, setRefunds] = React.useState<RefundListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefundModalOpen, setIsRefundModalOpen] = React.useState(false);
  const [refundForm, setRefundForm] = React.useState({ amount: "", reason: "" });
  const [refundError, setRefundError] = React.useState<string | null>(null);
  const [isSubmittingRefund, setIsSubmittingRefund] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const [statusError, setStatusError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function loadTransaction() {
      if (!params?.id) {
        return;
      }

      setIsLoading(true);
      const [transactionResult, refundsResult] = await Promise.all([
        getTransactionById(params.id),
        getRefundsForTransaction(params.id),
      ]);

      if (!isMounted) {
        return;
      }

      setTransaction(transactionResult.success ? transactionResult.data : null);
      setRefunds(refundsResult.success ? refundsResult.data : []);
      setIsLoading(false);
    }

    void loadTransaction();

    return () => {
      isMounted = false;
    };
  }, [params?.id]);

  const badgeClass = statusStyles[transaction?.status?.toUpperCase() ?? "PENDING"] ?? statusStyles.PENDING;
  const refundedAmount = refunds.reduce((sum, refund) => sum + refund.amount, 0);
  const remainingRefundable = transaction ? Math.max(transaction.amount - refundedAmount, 0) : 0;
  const isSuccessfulStatus = (transaction?.status?.toLowerCase() ?? "") === "success";
  const canRefund = isSuccessfulStatus && remainingRefundable > 0;

  async function handleRefundSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!transaction?.transactionId) {
      return;
    }

    setIsSubmittingRefund(true);
    setRefundError(null);

    const result = await createRefund({
      transactionId: transaction.transactionId,
      amount: Number(refundForm.amount),
      reason: refundForm.reason,
    });

    setIsSubmittingRefund(false);

    if (!result.success) {
      setRefundError(result.error ?? "Unable to create refund.");
      return;
    }

    setRefundForm({ amount: "", reason: "" });
    setIsRefundModalOpen(false);

    const refundsResult = await getRefundsForTransaction(transaction.transactionId);
    if (refundsResult.success) {
      setRefunds(refundsResult.data);
    }
  }

  async function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    if (!transaction?.transactionId) {
      return;
    }

    const nextStatus = event.target.value as TransactionStatusValue;
    setIsUpdatingStatus(true);
    setStatusError(null);

    const result = await updateTransactionStatus(transaction.transactionId, nextStatus);
    setIsUpdatingStatus(false);

    if (!result.success) {
      setStatusError(result.error ?? "Unable to update transaction status.");
      return;
    }

    setTransaction((current) => (current ? { ...current, status: nextStatus } : current));
  }

  function resetRefundModal() {
    setRefundForm({ amount: "", reason: "" });
    setRefundError(null);
  }

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
          <div className="flex h-[200px] w-full items-center justify-center rounded-xl md:h-[400px]">
            <Spinner className="size-15 animate-spin stroke-black" />
          </div>
        ) : !transaction ? (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Transaction not found</h2>
            <p className="text-sm text-slate-500">The requested transaction could not be loaded.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Transaction Details</p>
                <h2 className="text-2xl font-semibold tracking-tight">{transaction.transactionId}</h2>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <Badge variant="secondary" className={badgeClass}>
                  {formatStatus(transaction.status)}
                </Badge>
                <select
                  aria-label="Change transaction status"
                  value={transaction.status.toLowerCase()}
                  onChange={handleStatusChange}
                  disabled={isUpdatingStatus}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                >
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                {statusError ? <p className="text-sm text-red-500">{statusError}</p> : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Merchant</p>
                <p className="mt-1 font-medium">{transaction.merchantId}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Amount</p>
                <p className="mt-1 font-medium">{formatCurrency(transaction.amount, transaction.currency)}</p>
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
                <p className="mt-1 font-medium">{formatDate(transaction.payment_date)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Remaining refundable amount: {formatCurrency(remainingRefundable, transaction.currency)}
              </p>
              <Dialog open={isRefundModalOpen} onOpenChange={(open) => {
                setIsRefundModalOpen(open);
                if (!open) {
                  resetRefundModal();
                }
              }}>
                <DialogTrigger>
                  <Button type="button" disabled={!canRefund}>
                    Refund
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create refund</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRefundSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="refundAmount">Amount</Label>
                      <Input
                        id="refundAmount"
                        type="number"
                        max={remainingRefundable}
                        value={refundForm.amount}
                        onChange={(event) => setRefundForm((current) => ({ ...current, amount: event.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refundReason">Reason</Label>
                      <Input
                        id="refundReason"
                        value={refundForm.reason}
                        onChange={(event) => setRefundForm((current) => ({ ...current, reason: event.target.value }))}
                        required
                      />
                    </div>
                    {refundError ? <p className="text-sm text-red-500">{refundError}</p> : null}
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        setIsRefundModalOpen(false);
                        resetRefundModal();
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmittingRefund}>
                        {isSubmittingRefund ? "Submitting..." : "Save Refund"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </Card>

      <Card className="max-w-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Refund History</h3>
          <p className="text-sm text-slate-500">{refunds.length} refund{refunds.length === 1 ? "" : "s"}</p>
        </div>

        {refunds.length === 0 ? (
          <p className="text-sm text-slate-500">No refunds have been created for this transaction yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Create Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refunds.map((refund) => (
                  <TableRow key={refund.refundId}>
                    <TableCell>{formatDate(refund.createdAt)}</TableCell>
                    <TableCell>{formatCurrency(refund.amount, transaction?.currency ?? "INR")}</TableCell>
                    <TableCell>{formatStatus(refund.status)}</TableCell>
                    <TableCell>{refund.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
