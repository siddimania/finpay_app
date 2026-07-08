import Link from "next/link";
import { LayoutDashboard, ListOrdered, Store, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarNavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

type AppSidebarProps = {
  activeHref: string;
};

const navItems: SidebarNavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Transactions", icon: ListOrdered, href: "/transactions" },
  { label: "Merchants", icon: Store, href: "/merchants" },
];

export default function AppSidebar({ activeHref }: AppSidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white px-4 py-6 md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-2 px-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M4 2h16l-6 8h6l-12 12 3-9H5l-1-11z" fill="#3B82F6" />
        </svg>
        <span className="text-lg font-semibold tracking-tight">FinPay</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === activeHref;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-2 py-3 text-xs font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
