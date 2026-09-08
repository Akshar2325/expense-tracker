"use client";

import { useEffect, useState } from "react";
import { authedRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Account {
  id: string;
  name: string;
  accountType: string;
}

interface Category {
  id: string;
  name: string;
  categoryType: string;
  color: string;
  icon: string;
}

interface PaymentMethod {
  id: string;
  name: string;
}

export interface TransactionFormValues {
  id?: string;
  title: string;
  amount: string;
  type: string;
  accountId: string;
  categoryId?: string;
  paymentMethodId?: string;
  transactionAt: string;
  notes?: string;
}

interface TransactionFormProps {
  open: boolean;
  initial?: TransactionFormValues | null;
  onClose: () => void;
  onSaved: () => void;
}

const TYPE_OPTIONS = [
  { value: "EXPENSE", label: "Expense" },
  { value: "INCOME", label: "Income" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "REFUND", label: "Refund" },
  { value: "ADJUSTMENT", label: "Adjustment" },
];

export function TransactionForm({
  open,
  initial,
  onClose,
  onSaved,
}: TransactionFormProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [transactionAt, setTransactionAt] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [notes, setNotes] = useState("");

  // Load reference data when the modal opens
  useEffect(() => {
    if (!open) return;
    setError(null);

    Promise.all([
      authedRequest<Account[]>("/accounts"),
      authedRequest<Category[]>("/categories"),
      authedRequest<PaymentMethod[]>("/payment-methods"),
    ])
      .then(([accs, cats, pms]) => {
        setAccounts(accs);
        setCategories(cats);
        setPaymentMethods(pms);
      })
      .catch((e) => setError(e.message));

    // Prefill when editing
    if (initial) {
      setTitle(initial.title);
      setAmount(initial.amount);
      setType(initial.type);
      setAccountId(initial.accountId);
      setCategoryId(initial.categoryId || "");
      setPaymentMethodId(initial.paymentMethodId || "");
      setTransactionAt(
        initial.transactionAt
          ? initial.transactionAt.slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      );
      setNotes(initial.notes || "");
    } else {
      setTitle("");
      setAmount("");
      setType("EXPENSE");
      setAccountId("");
      setCategoryId("");
      setPaymentMethodId("");
      setTransactionAt(new Date().toISOString().slice(0, 16));
      setNotes("");
    }
  }, [open, initial]);

  if (!open) return null;

  const filteredCategories = categories.filter(
    (c) =>
      c.categoryType === type ||
      (type === "TRANSFER" && c.categoryType === "TRANSFER"),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      title,
      amount,
      type,
      accountId,
      categoryId: categoryId || null,
      paymentMethodId: paymentMethodId || null,
      transactionAt: new Date(transactionAt).toISOString(),
      notes: notes || undefined,
      source: "MANUAL",
    };

    try {
      if (initial?.id) {
        await authedRequest(`/transactions/${initial.id}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await authedRequest("/transactions", {
          method: "POST",
          body: payload,
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-surface-card rounded-xxl shadow-soft border border-hairline-soft max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-hairline-soft">
          <h2 className="font-display text-display-sm text-ink">
            {initial?.id ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-soft hover:bg-canvas-soft transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type selector */}
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`px-4 py-1.5 rounded-pill text-button transition-colors ${
                  type === opt.value
                    ? "bg-ink text-canvas"
                    : "bg-canvas-soft text-muted hover:bg-hairline"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Title"
                placeholder="e.g. Groceries at Big Bazaar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <Input
              label="Amount (₹)"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <div>
              <label className="block text-caption-uppercase text-muted-soft mb-1.5">
                Date & time
              </label>
              <input
                type="datetime-local"
                className="input"
                value={transactionAt}
                onChange={(e) => setTransactionAt(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-caption-uppercase text-muted-soft mb-1.5">
                Account
              </label>
              <select
                className="input"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
              >
                <option value="">Select account…</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-caption-uppercase text-muted-soft mb-1.5">
                Category
              </label>
              <select
                className="input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Uncategorized</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-caption-uppercase text-muted-soft mb-1.5">
                Payment method
              </label>
              <select
                className="input"
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
              >
                <option value="">None</option>
                {paymentMethods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Notes"
                placeholder="Optional note…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-body-sm text-semantic-error">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {initial?.id ? "Save Changes" : "Add Transaction"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
