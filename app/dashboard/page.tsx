"use client";

import * as React from "react";
import { Bell, ChevronDown, Bug } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/server/auth/login.actions";
import { useTransition } from "react";
import { toast } from "sonner";
import AppToast from "@/components/shared/app-toast";
import AppShell from "@/components/shared/app-shell";

// ---------------------------------------------------------------------------
// Static data — replace with real data fetching in your app
// ---------------------------------------------------------------------------

const statCards = [
  { label: "Total Balance", value: "$45,210.65" },
  { label: "Sent Today", value: "$2,340.50" },
  { label: "Pending", value: "$1,890.15" },
  { label: "Active Merchants", value: "187" },
];

const paymentVolumeData = [
  { x: "1", value: 40 },
  { x: "6", value: 220 },
  { x: "10", value: 230 },
  { x: "14", value: 140 },
  { x: "17", value: 320 },
  { x: "20", value: 210 },
  { x: "21", value: 290 },
  { x: "23", value: 250 },
  { x: "35", value: 330 },
];

const paymentStatus = [
  { label: "Successful", value: 75, colorClass: "bg-emerald-500" },
  { label: "Pending", value: 20, colorClass: "bg-amber-400" },
  { label: "Failed", value: 5, colorClass: "bg-red-500" },
];

type TxStatus = "Success" | "Pending" | "Failed";

const transactions: {
  merchant: string;
  amount: string;
  description: string;
  status: TxStatus;
  txNumber: string;
  date: string;
}[] = [
  {
    merchant: "Avobe Company",
    amount: "$150.00",
    description: "Monthly Subscription",
    status: "Success",
    txNumber: "FPX982743",
    date: "10/12/2023",
  },
  {
    merchant: "Davied Shop",
    amount: "$200.00",
    description: "Office Supplies",
    status: "Pending",
    txNumber: "FPX982744",
    date: "10/12/2023",
  },
  {
    merchant: "Hanash Dumelton",
    amount: "$140.00",
    description: "Consult Fee",
    status: "Failed",
    txNumber: "FPX982745",
    date: "10/12/2023",
  },
  {
    merchant: "Johnon Smith",
    amount: "$30.00",
    description: "Team Lunch",
    status: "Success",
    txNumber: "FPX982746",
    date: "10/12/2023",
  },
];

const statusStyles: Record<TxStatus, string> = {
  Success: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
  Pending: "bg-amber-50 text-amber-600 hover:bg-amber-50",
  Failed: "bg-red-50 text-red-500 hover:bg-red-50",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Page() {
  const router = useRouter();
  const [range, setRange] = React.useState("Past month");
  const [, startTransition] = useTransition();
 
  const logoutUser = () => {
    startTransition(async () => {
      const { success, errorMessage } = await signOutAction();
      if (success) {
        router.push("/");
      } else {
        toast.custom((t) => (
          <AppToast
            toastObject={t}
            title="Error !!"
            message={`${errorMessage}`}
            icon={Bug}
            color="bg-red-400"
          />
        ));
      }
    });
  };

  const headerRight = (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label="Notifications"
        className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src="/avatar-placeholder.jpg" alt="Account avatar" />
            <AvatarFallback>FP</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={logoutUser}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <AppShell activeHref="/dashboard" headerRight={headerRight}>
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <Card key={card.label} className="p-5">
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {card.value}
                </p>
              </Card>
            ))}
          </div>

          {/* Chart + Status */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-semibold">Payment Volume</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                      {range}
                      <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {["Past week", "Past month", "Past quarter", "Past year"].map(
                      (option) => (
                        <DropdownMenuItem
                          key={option}
                          onSelect={() => setRange(option)}
                        >
                          {option}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={paymentVolumeData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#EEF2F6" />
                    <XAxis
                      dataKey="x"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                    />
                    <YAxis
                      domain={[0, 400]}
                      ticks={[0, 100, 200, 300, 400]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        borderColor: "#E2E8F0",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#volumeFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-6 text-base font-semibold">Payment Status</h2>
              <div className="space-y-5">
                {paymentStatus.map((status) => (
                  <div key={status.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{status.label}</span>
                      <span className="font-medium">{status.value}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn("h-full rounded-full", status.colorClass)}
                        style={{ width: `${status.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent transactions */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-semibold">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Merchant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction Number</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.txNumber}>
                      <TableCell className="font-medium">
                        {tx.merchant}
                      </TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell className="text-slate-500">
                        {tx.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("font-medium", statusStyles[tx.status])}
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {tx.txNumber}
                      </TableCell>
                      <TableCell className="text-slate-500">{tx.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
    </AppShell>
  );
}