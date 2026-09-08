"use client";

import { useEffect, useState } from "react";
import { authedRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, BookmarkCheck, Trash2, X } from "lucide-react";

interface SavedFilter {
  id: string;
  name: string;
  filterDefinition: Record<string, unknown>;
  createdAt: string;
}

interface SavedFiltersProps {
  currentFilters: Record<string, string>;
  onApply: (filters: Record<string, string>) => void;
}

export function SavedFilters({ currentFilters, onApply }: SavedFiltersProps) {
  const [filters, setFilters] = useState<SavedFilter[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    authedRequest<SavedFilter[]>("/saved-filters")
      .then(setFilters)
      .catch(() => setFilters([]));
  };

  useEffect(() => {
    load();
  }, []);

  const hasActiveFilters = Object.values(currentFilters).some(Boolean);

  const saveFilter = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await authedRequest("/saved-filters", {
        method: "POST",
        body: {
          name: name.trim(),
          filterDefinition: currentFilters,
        },
      });
      setName("");
      setOpen(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save filter");
    } finally {
      setSaving(false);
    }
  };

  const deleteFilter = async (id: string) => {
    try {
      await authedRequest(`/saved-filters/${id}`, { method: "DELETE" });
      load();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className={hasActiveFilters ? "border-primary text-primary" : ""}
      >
        <Bookmark className="h-4 w-4" />
        Saved Filters
        {filters.length > 0 && (
          <span className="ml-1 h-5 min-w-5 px-1 rounded-full bg-canvas-soft text-caption flex items-center justify-center">
            {filters.length}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-80 bg-surface-card rounded-xxl shadow-soft border border-hairline-soft p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-title-sm text-ink">Saved Filters</h3>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 rounded-full flex items-center justify-center text-muted-soft hover:bg-canvas-soft"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Save current filter */}
            <div className="space-y-2">
              <Input
                placeholder="Name this filter…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveFilter()}
              />
              <Button
                size="sm"
                className="w-full"
                onClick={saveFilter}
                loading={saving}
                disabled={!name.trim() || !hasActiveFilters}
              >
                <BookmarkCheck className="h-4 w-4" />
                Save current filters
              </Button>
              {!hasActiveFilters && (
                <p className="text-caption text-muted-soft">
                  Set a search or type filter first.
                </p>
              )}
              {error && (
                <p className="text-caption text-semantic-error">{error}</p>
              )}
            </div>

            {/* List of saved filters */}
            <div className="divide-y divide-hairline-soft max-h-64 overflow-y-auto">
              {filters.length === 0 ? (
                <p className="py-4 text-center text-caption text-muted-soft">
                  No saved filters yet.
                </p>
              ) : (
                filters.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between py-2.5 gap-2"
                  >
                    <button
                      onClick={() => {
                        onApply(
                          Object.fromEntries(
                            Object.entries(f.filterDefinition).filter(
                              ([, v]) => v !== "" && v != null,
                            ),
                          ) as Record<string, string>,
                        );
                        setOpen(false);
                      }}
                      className="flex-1 text-left text-body-sm text-ink hover:text-primary transition-colors truncate"
                      title="Apply this filter"
                    >
                      {f.name}
                    </button>
                    <button
                      onClick={() => deleteFilter(f.id)}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-muted-soft hover:text-semantic-error hover:bg-canvas-soft transition-colors shrink-0"
                      aria-label={`Delete ${f.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}