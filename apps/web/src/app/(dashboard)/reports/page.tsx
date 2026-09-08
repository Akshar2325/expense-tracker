"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { authedRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useChartColors } from "@/lib/theme";
import { Card } from "@/components/ui/card";

interface Summary {
  totalExpense: number;
  totalIncome: number;
  net: number;
  transactionCount: number;
  savingsRate: number;
}

interface CategoryBreakdown {
  categoryId: string | null;
  name: string;
  color: string;
  icon: string | null;
  total: number;
  count: number;
}

interface TrendPoint {
  period: string;
  expense: number;
  income: number;
}

const PIE_COLORS = [
  "#292524",
  "#a7e5d3",
  "#f4c5a8",
  "#c8b8e0",
  "#a8c8e8",
  "#e8b8c4",
  "#d6d3d1",
];

export default function ReportsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chart = useChartColors();

  useEffect(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 5, 1)
      .toISOString()
      .slice(0, 10);
    const to = now.toISOString().slice(0, 10);

    Promise.all([
      authedRequest<Summary>(`/reports/summary?from=${from}&to=${to}`),
      authedRequest<CategoryBreakdown[]>(
        `/reports/category-breakdown?from=${from}&to=${to}`,
      ),
      authedRequest<TrendPoint[]>(`/reports/trend?from=${from}&to=${to}`),
    ])
      .then(([s, b, t]) => {
        setSummary(s);
        setBreakdown(b);
        setTrend(t);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-hairline rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 h-72 animate-pulse" />
          <div className="card p-6 h-72 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center text-body-sm text-muted">{error}</Card>
    );
  }

  const pieData = breakdown.map((b) => ({
    name: b.name,
    value: Number(b.total),
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-display-lg text-ink">Reports</h1>
        <p className="mt-1 text-body-sm text-muted">
          Six months of your financial story.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total spent",
            value: formatCurrency(summary?.totalExpense ?? 0),
          },
          {
            label: "Total income",
            value: formatCurrency(summary?.totalIncome ?? 0),
          },
          { label: "Net", value: formatCurrency(summary?.net ?? 0) },
          {
            label: "Savings rate",
            value: `${Math.round(summary?.savingsRate ?? 0)}%`,
          },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-caption-uppercase text-muted mb-2">{s.label}</p>
            <p className="text-display-sm text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend chart */}
        <Card>
          <Card.Header>
            <Card.Title>Monthly trend</Card.Title>
          </Card.Header>
          <Card.Body className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chart.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12, fill: chart.tick }}
                  axisLine={{ stroke: chart.axis }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: chart.tick }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${chart.border}`,
                    fontSize: 13,
                    background: "var(--color-surface-card)",
                    color: "var(--color-body)",
                  }}
                />
                <Bar dataKey="expense" fill={chart.ink} radius={[6, 6, 0, 0]} />
                <Bar dataKey="income" fill="#a7e5d3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>

        {/* Category pie */}
        <Card>
          <Card.Header>
            <Card.Title>By category</Card.Title>
          </Card.Header>
          <Card.Body className="h-72">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-body-sm text-muted-soft">
                No spending data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${chart.border}`,
                      fontSize: 13,
                      background: "var(--color-surface-card)",
                      color: "var(--color-body)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
