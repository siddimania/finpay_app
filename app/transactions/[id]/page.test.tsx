import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockBack = vi.fn();
const mockGetTransactionById = vi.fn();
const mockGetRefundsForTransaction = vi.fn();
const mockCreateRefund = vi.fn();
const mockUpdateTransactionStatus = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: mockBack }),
  useParams: () => ({ id: "txn_123" }),
}));

vi.mock("@/components/shared/app-shell", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/server/transactions.actions", () => ({
  getTransactionById: (...args: unknown[]) => mockGetTransactionById(...args),
  updateTransactionStatus: (...args: unknown[]) => mockUpdateTransactionStatus(...args),
}));

vi.mock("@/server/refunds.actions", () => ({
  createRefund: (...args: unknown[]) => mockCreateRefund(...args),
  getRefundsForTransaction: (...args: unknown[]) => mockGetRefundsForTransaction(...args),
}));

import Page from "./page";

describe("Transaction detail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTransactionById.mockResolvedValue({
      success: true,
      data: {
        transactionId: "txn_123",
        userId: "user_1",
        merchantId: "merch_1",
        amount: 120,
        currency: "INR",
        status: "success",
        paymentMethod: "UPI",
        payment_date: "2024-01-15",
        createdAt: "2024-01-15T00:00:00.000Z",
      },
    });
    mockGetRefundsForTransaction.mockResolvedValue({ success: true, data: [] });
    mockCreateRefund.mockResolvedValue({ success: true });
    mockUpdateTransactionStatus.mockResolvedValue({ success: true });
  });

  it("renders transaction details from the server action", async () => {
    render(<Page />);

    expect(await screen.findByText("txn_123")).toBeInTheDocument();
    expect(screen.getByText("merch_1")).toBeInTheDocument();
    expect(screen.getByText("₹120.00")).toBeInTheDocument();
  });

  it("disables the refund button when the status is not success", async () => {
    mockGetTransactionById.mockResolvedValue({
      success: true,
      data: {
        transactionId: "txn_123",
        userId: "user_1",
        merchantId: "merch_1",
        amount: 120,
        currency: "INR",
        status: "pending",
        paymentMethod: "UPI",
        payment_date: "2024-01-15",
        createdAt: "2024-01-15T00:00:00.000Z",
      },
    });

    render(<Page />);

    const refundButton = (await screen.findAllByRole("button", { name: /refund/i }))[0];
    expect(refundButton).toBeDisabled();
  });

  it("opens the refund dialog and creates a refund", async () => {
    render(<Page />);

    const refundButton = (await screen.findAllByRole("button", { name: /refund/i }))[0];
    fireEvent.click(refundButton);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: "30" } });
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: "Duplicate payment" } });
    fireEvent.click(screen.getByRole("button", { name: /save refund/i }));

    await waitFor(() => {
      expect(mockCreateRefund).toHaveBeenCalledWith({
        transactionId: "txn_123",
        amount: 30,
        reason: "Duplicate payment",
      });
    });
  });

  it("changes the transaction status from the dropdown", async () => {
    render(<Page />);

    const statusSelect = await screen.findByLabelText(/change transaction status/i);
    fireEvent.change(statusSelect, { target: { value: "pending" } });

    await waitFor(() => {
      expect(mockUpdateTransactionStatus).toHaveBeenCalledWith("txn_123", "pending");
    });
  });

  it("shows refund history rows when refunds exist", async () => {
    mockGetRefundsForTransaction.mockResolvedValue({
      success: true,
      data: [
        {
          refundId: "refund_1",
          transactionId: "txn_123",
          amount: 20,
          status: "successfull",
          reason: "Customer requested",
          createdAt: "2024-01-16T00:00:00.000Z",
        },
      ],
    });

    render(<Page />);

    expect(await screen.findByText("Customer requested")).toBeInTheDocument();
    expect(screen.getByText("₹20.00")).toBeInTheDocument();
  });
});
