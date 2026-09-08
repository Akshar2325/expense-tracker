"use client";

import { useEffect, useState } from "react";
import { authedRequest } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Repeat } from "lucide-react";

interface RecurringTransaction {
  id: string;
  title: string;
  amount: string;
  type: string;
  frequency: string;
  intervalValue: number | null;
  intervalUnit: string | null;
  nextRunAt: string;
  isActive: boolean;
  autoCreate: boolean;
}

export default function RecurringPage() {
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authedRequest<RecurringTransaction[]>("/recurring-transactions")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink">Recurring</h1>
          <p className="mt-1 text-body-sm text-muted">
            Rent, subscriptions, and scheduled money.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Recurring
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card p-5 h-16 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center text-body-sm text-muted">{error}</Card>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center">
          <Repeat className="h-8 w-8 text-muted-soft mx-auto mb-3" />
          <p className="text-body-md text-muted">No recurring transactions.</p>
          <p className="mt-1 text-body-sm text-muted-soft">
            Set up rent or subscriptions to automate them.
          </p>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-hairline-soft">
            {items.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-canvas-soft transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-surface-strong flex items-center justify-center shrink-0">
                    <Repeat className="h-4 w-4 text-ink" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-strong truncate">{r.title}</p>
                    <p className="text-caption text-muted-soft">
                      {r.frequency}
                      {r.intervalValue
                        ? ` · every ${r.intervalValue} ${r.intervalUnit}`
                        : ""}
                      {" · "}
                      {r.isActive ? "Active" : "Paused"}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-body-strong ${
                      r.type === "EXPENSE"
                        ? "text-semantic-error"
                        : "text-semantic-success"
                    }`}
                  >
                    {r.type === "EXPENSE" ? "−" : "+"}
                    {formatCurrency(r.amount)}
                  </p>
                  <p className="text-caption text-muted-soft">
                    Next: {formatDate(r.nextRunAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
