"use client";

import { useEffect, useState } from "react";
import { authedRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface DashboardData {
  month: { expense: number; income: number; net: number };
  topCategories: {
    categoryId: string | null;
    name: string;
    color: string;
    icon: string | null;
    amount: number;
  }[];
  recentTransactions: {
    id: string;
    title: string;
    amount: string;
    type: string;
    transactionAt: string;
    category?: { name: string; color: string; icon: string } | null;
  }[];
}

export function DashboardWidgets() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authedRequest<DashboardData>("/insights/dashboard")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 w-24 bg-hairline rounded mb-4" />
            <div className="h-8 w-32 bg-hairline rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-8 text-center">
        <p className="text-body-md text-muted">
          {error || "Could not load dashboard."}
        </p>
      </Card>
    );
  }

  const stats = [
    {
      label: "Spent this month",
      value: formatCurrency(data.month.expense),
      icon: TrendingDown,
      accent: "text-semantic-error",
    },
    {
      label: "Income this month",
      value: formatCurrency(data.month.income),
      icon: TrendingUp,
      accent: "text-semantic-success",
    },
    {
      label: "Net balance",
      value: formatCurrency(data.month.net),
      icon: Wallet,
      accent: "text-ink",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-caption-uppercase text-muted">
                {s.label}
              </span>
              <s.icon className={`h-5 w-5 ${s.accent}`} />
            </div>
            <p className="text-display-sm text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top categories */}
        <Card>
          <Card.Header>
            <Card.Title>Top categories</Card.Title>
          </Card.Header>
          <Card.Body className="flex flex-col gap-4">
            {data.topCategories.length === 0 && (
              <p className="text-body-sm text-muted-soft">No spending yet.</p>
            )}
            {data.topCategories.map((c) => {
              const max = Math.max(
                ...data.topCategories.map((x) => x.amount),
                1,
              );
              const pct = Math.round((c.amount / max) * 100);
              return (
                <div key={c.categoryId || "uncat"}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-body-sm text-body-strong">
                      {c.name}
                    </span>
                    <span className="text-body-sm text-muted">
                      {formatCurrency(c.amount)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-strong overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: c.color || "var(--color-ink)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </Card.Body>
        </Card>

        {/* Recent transactions */}
        <Card>
          <Card.Header>
            <Card.Title>Recent activity</Card.Title>
          </Card.Header>
          <Card.Body className="flex flex-col divide-y divide-hairline-soft">
            {data.recentTransactions.length === 0 && (
              <p className="text-body-sm text-muted-soft py-4">
                No transactions yet. Add your first one.
              </p>
            )}
            {data.recentTransactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor:
                        t.category?.color || "var(--color-hairline-soft)",
                    }}
                  >
                    <span className="text-sm">{t.category?.icon || "•"}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-sm text-body-strong truncate">
                      {t.title}
                    </p>
                    <p className="text-caption text-muted-soft">
                      {t.category?.name || "Uncategorized"}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-body-strong ${
                    t.type === "EXPENSE"
                      ? "text-semantic-error"
                      : "text-semantic-success"
                  }`}
                >
                  {t.type === "EXPENSE" ? "−" : "+"}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
