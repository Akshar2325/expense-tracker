"use client";

import { useEffect, useState } from "react";
import { authedRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet } from "lucide-react";

interface Account {
  id: string;
  name: string;
  accountType: string;
  currency: string;
  openingBalance: string;
  currentBalance: string;
  includeInTotal: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  CASH: "💵",
  BANK: "🏦",
  CREDIT_CARD: "💳",
  WALLET: "👛",
  INVESTMENT: "📈",
  OTHER: "🏷️",
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authedRequest<Account[]>("/accounts")
      .then(setAccounts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const total = accounts
    .filter((a) => a.includeInTotal)
    .reduce((sum, a) => sum + Number(a.currentBalance), 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink">Accounts</h1>
          <p className="mt-1 text-body-sm text-muted">
            {accounts.length} account{accounts.length === 1 ? "" : "s"} ·{" "}
            {formatCurrency(total)} total
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 w-24 bg-hairline rounded mb-4" />
              <div className="h-8 w-32 bg-hairline rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center text-body-sm text-muted">{error}</Card>
      ) : accounts.length === 0 ? (
        <Card className="p-12 text-center">
          <Wallet className="h-8 w-8 text-muted-soft mx-auto mb-3" />
          <p className="text-body-md text-muted">No accounts yet.</p>
          <p className="mt-1 text-body-sm text-muted-soft">
            Add your first account to start tracking.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((a) => (
            <Card key={a.id} interactive className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface-strong flex items-center justify-center text-lg">
                    {TYPE_ICONS[a.accountType] || "🏷️"}
                  </div>
                  <div>
                    <p className="text-title-sm text-ink">{a.name}</p>
                    <p className="text-caption text-muted-soft">
                      {a.accountType.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-display-sm text-ink">
                {formatCurrency(a.currentBalance, a.currency)}
              </p>
              <p className="mt-1 text-caption text-muted-soft">
                Opened with {formatCurrency(a.openingBalance, a.currency)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
