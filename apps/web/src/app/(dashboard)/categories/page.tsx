"use client";

import { useEffect, useState } from "react";
import { authedRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  categoryType: string;
  icon: string | null;
  color: string | null;
  isSystem: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authedRequest<Category[]>("/categories")
      .then(setCategories)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const expense = categories.filter((c) => c.categoryType !== "INCOME");
  const income = categories.filter((c) => c.categoryType !== "EXPENSE");

  function CategoryGrid({ items }: { items: Category[] }) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((c) => (
          <Card key={c.id} interactive className="p-4 flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: c.color || "#f0efed" }}
            >
              <span className="text-base">{c.icon || "•"}</span>
            </div>
            <div className="min-w-0">
              <p className="text-body-sm text-body-strong truncate">{c.name}</p>
              {c.isSystem && (
                <p className="text-caption text-muted-soft">System</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink">Categories</h1>
          <p className="mt-1 text-body-sm text-muted">
            Organize your spending, your way.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center text-body-sm text-muted">{error}</Card>
      ) : (
        <>
          <section className="flex flex-col gap-4">
            <h2 className="text-title-md text-ink">Expense</h2>
            <CategoryGrid items={expense} />
          </section>
          <section className="flex flex-col gap-4">
            <h2 className="text-title-md text-ink">Income</h2>
            <CategoryGrid items={income} />
          </section>
        </>
      )}
    </div>
  );
}
