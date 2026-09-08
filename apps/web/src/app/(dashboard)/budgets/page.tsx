"use client";

import { useEffect, useState } from "react";
import { authedRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Budget {
  id: string;
  name: string;
  amount: string;
  period: string;
  category?: { name: string; color: string; icon: string } | null;
  spent?: number;
  remaining?: number;
  percentUsed?: number;
  status?: "OK" | "WARNING" | "CRITICAL";
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authedRequest<Budget[]>("/budgets?activeOnly=true")
      .then((res) => setBudgets(res))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status?: string) => {
    switch (status) {
      case "CRITICAL":
        return "bg-semantic-error";
      case "WARNING":
        return "bg-gradient-peach";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink">Budgets</h1>
          <p className="mt-1 text-body-sm text-muted">
            Monthly guardrails for your spending.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Budget
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 w-32 bg-hairline rounded mb-4" />
              <div className="h-2 bg-hairline rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center text-body-sm text-muted">{error}</Card>
      ) : budgets.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-body-md text-muted">No budgets yet.</p>
          <p className="mt-1 text-body-sm text-muted-soft">
            Create a budget to start tracking a category.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((b) => {
            const pct = Math.min(b.percentUsed ?? 0, 100);
            return (
              <Card key={b.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: b.category?.color || "#f0efed",
                      }}
                    >
                      <span className="text-sm">{b.category?.icon || "•"}</span>
                    </div>
                    <div>
                      <p className="text-title-sm text-ink">{b.name}</p>
                      <p className="text-caption text-muted-soft">
                        {b.category?.name || "Overall"} · {b.period}
                      </p>
                    </div>
                  </div>
                  <span className="badge">
                    {b.status === "CRITICAL"
                      ? "Over"
                      : b.status === "WARNING"
                        ? "Watch"
                        : "On track"}
                  </span>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <span className="text-body-sm text-muted">
                    {formatCurrency(b.spent ?? 0)} spent
                  </span>
                  <span className="text-body-sm text-body-strong">
                    of {formatCurrency(b.amount)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-strong overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${statusColor(b.status)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-caption text-muted-soft">
                  {b.remaining !== undefined && b.remaining >= 0
                    ? `${formatCurrency(b.remaining)} remaining`
                    : `${formatCurrency(Math.abs(b.remaining ?? 0))} over budget`}
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
