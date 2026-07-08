import * as React from "react";
import AppHeader from "@/components/shared/app-header";
import AppSidebar from "@/components/shared/app-sidebar";

type AppShellProps = {
  children: React.ReactNode;
  activeHref: string;
  mobileTitle?: string;
  headerRight?: React.ReactNode;
};

export default function AppShell({
  children,
  activeHref,
  mobileTitle = "FinPay",
  headerRight,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar activeHref={activeHref} />

      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader mobileTitle={mobileTitle} rightContent={headerRight} />

        <main className="flex-1 space-y-6 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
