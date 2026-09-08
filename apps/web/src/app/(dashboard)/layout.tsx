"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { GradientOrb } from "@/components/ui/orb";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Wallet,
  Tags,
  Settings,
  LogOut,
  Repeat,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/budgets", label: "Budgets", icon: PiggyBank },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/settings", label: "Settings", icon: Settings },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const items = navItems.map((item) => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(item.href + "/"),
  }));

  return (
    <div className="min-h-screen bg-canvas">
      <GradientOrb
        color="mint"
        className="top-0 -right-40 w-96 h-96 opacity-30"
      />
      <GradientOrb
        color="lavender"
        className="bottom-0 -left-40 w-80 h-80 opacity-30"
        delay="8s"
      />

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-hairline-soft">
        <div className="mx-auto max-w-content px-base h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-display text-display-sm text-ink leading-none mt-1">
              Ledger
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="hidden sm:block text-body-sm text-muted">
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-body-sm text-muted hover:text-ink transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-content flex">
        <SidebarNav items={items} className="hidden md:block" />
        <main className="flex-1 min-w-0 px-base md:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
