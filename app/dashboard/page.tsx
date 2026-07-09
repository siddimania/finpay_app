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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getCurrentWeekTransactionsSummary } from "@/server/transactions.actions";
import { getMerchantsCount } from "@/server/merchants.actions";
import { Spinner } from "@/components/ui/spinner";

const paymentStatus = [
  { label: "Successful", value: 75, colorClass: "bg-emerald-500" },
  { label: "Pending", value: 20, colorClass: "bg-amber-400" },
  { label: "Failed", value: 5, colorClass: "bg-red-500" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
}

export default function Page() {
  const router = useRouter();
  const [range, setRange] = React.useState("Past week");
  const [isLoading, setIsLoading] = React.useState(true);
  const [, startTransition] = useTransition();
  const [spentThisWeek, setSpentThisWeek] = React.useState(0);
  const [chartData, setChartData] = React.useState([{ x: "Mon", value: 0 }]);
  const [activeMerchants, setActiveMerchants] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setIsLoading(true);
      const [summaryResult, merchantResult] = await Promise.all([
        getCurrentWeekTransactionsSummary(),
        getMerchantsCount(),
      ]);

      if (!isMounted) {
        return;
      }

      if (summaryResult.success) {
        setSpentThisWeek(summaryResult.totalSpent);
        setChartData(summaryResult.chartData);
      }

      if (merchantResult.success) {
        setActiveMerchants(merchantResult.count);
      }
      setIsLoading(false);
    }

    void loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

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
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src="/user.png" alt="Account avatar" />
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
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="flex h-[200px] w-full items-center justify-center rounded-xl md:h-[400px]">
            <Spinner className="size-15 animate-spin stroke-black" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <p className="text-sm text-slate-500">Spent This Week</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {formatCurrency(spentThisWeek)}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-slate-500">Active Merchants</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {activeMerchants}
              </p>
            </Card>
          </div>

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
                    {["Past week", "Past month"].map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onSelect={() => setRange(option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="volumeFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3B82F6"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="100%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
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
        </>
      )}
    </AppShell>
  );
}
