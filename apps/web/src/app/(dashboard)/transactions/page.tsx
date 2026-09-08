"use client";

import { useEffect, useState } from "react";
import { authedRequest } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TransactionForm,
  type TransactionFormValues,
} from "@/components/transactions/transaction-form";
import { SavedFilters } from "@/components/transactions/saved-filters";
import { Search, Plus } from "lucide-react";

interface Transaction {
  id: string;
  title: string;
  amount: string;
  type: string;
  transactionAt: string;
  category?: { id: string; name: string; color: string; icon: string } | null;
  account?: { id: string; name: string } | null;
}

interface ListResponse {
  data: Transaction[];
  meta: {
    total: number;
    hasNext: boolean;
    cursor: string | null;
    limit: number;
  };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionFormValues | null>(null);

  const load = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("types", type);
    params.set("limit", "50");

    authedRequest<ListResponse>(`/transactions?${params.toString()}`)
      .then((res) => {
        setTransactions(res.data);
        setTotal(res.meta.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (t: Transaction) => {
    setEditing({
      id: t.id,
      title: t.title,
      amount: t.amount,
      type: t.type,
      accountId: t.account?.id || "",
      categoryId: t.category?.id || "",
      transactionAt: t.transactionAt,
    });
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink">
            Transactions
          </h1>
          <p className="mt-1 text-body-sm text-muted">
            {total} transaction{total === 1 ? "" : "s"} in your ledger.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-soft" />
          <Input
            className="pl-10"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-48"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All types</option>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
          <option value="TRANSFER">Transfer</option>
          <option value="REFUND">Refund</option>
          <option value="ADJUSTMENT">Adjustment</option>
        </select>
        <SavedFilters
          currentFilters={{ search, types: type }}
          onApply={(f) => {
            setSearch(f.search || "");
            setType(f.types || "");
          }}
        />
      </div>

      {/* List */}
      <Card>
        {loading ? (
          <div className="p-6 space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-hairline/60 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-body-sm text-muted">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-body-md text-muted">No transactions found.</p>
            <p className="mt-1 text-body-sm text-muted-soft">
              {search || type
                ? "Try adjusting your filters."
                : "Add your first transaction to get started."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-hairline-soft">
            {transactions.map((t) => (
              <button
                key={t.id}
                onClick={() => openEdit(t)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-canvas-soft transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor:
                        t.category?.color || "var(--color-hairline-soft)",
                    }}
                  >
                    <span className="text-sm">{t.category?.icon || "•"}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-strong truncate">{t.title}</p>
                    <p className="text-caption text-muted-soft">
                      {t.category?.name || "Uncategorized"}
                      {t.account ? ` · ${t.account.name}` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-body-strong ${
                      t.type === "EXPENSE"
                        ? "text-semantic-error"
                        : "text-semantic-success"
                    }`}
                  >
                    {t.type === "EXPENSE" ? "−" : "+"}
                    {formatCurrency(t.amount)}
                  </p>
                  <p className="text-caption text-muted-soft">
                    {formatDate(t.transactionAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <TransactionForm
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
