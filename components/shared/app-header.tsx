import * as React from "react";
import { Bell } from "lucide-react";

type AppHeaderProps = {
  mobileTitle?: string;
  rightContent?: React.ReactNode;
};

export default function AppHeader({ mobileTitle = "FinPay", rightContent }: AppHeaderProps) {
  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:hidden">
        <span className="text-lg font-semibold">{mobileTitle}</span>
      </header>

      <header className="hidden items-center justify-end gap-4 border-b border-slate-200 bg-white px-8 py-4 md:flex">
        {rightContent ?? (
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
          </button>
        )}
      </header>
    </>
  );
}
