import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { Prisma } from "@expense-tracker/database";

export interface ReportQuery {
  from?: string;
  to?: string;
  groupBy?: "day" | "week" | "month" | "category" | "account" | "paymentMethod";
  type?: "EXPENSE" | "INCOME";
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string, query: ReportQuery) {
    const where = this.buildWhere(userId, query);

    const [totalExpense, totalIncome, txCount] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const expense = Number(totalExpense._sum.amount || 0);
    const income = Number(totalIncome._sum.amount || 0);

    return {
      totalExpense: expense,
      totalIncome: income,
      net: income - expense,
      transactionCount: txCount,
      savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
    };
  }

  async getCategoryBreakdown(userId: string, query: ReportQuery) {
    const where = this.buildWhere(userId, query);
    const type = query.type || "EXPENSE";

    const grouped = await this.prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { ...where, type },
      _sum: { amount: true },
      _count: { _all: true },
    });

    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: grouped.map((g) => g.categoryId).filter(Boolean) as string[],
        },
      },
    });

    const total = grouped.reduce(
      (sum, g) => sum + Number(g._sum.amount || 0),
      0,
    );

    return grouped
      .map((g) => {
        const category = categories.find((c) => c.id === g.categoryId);
        const amount = Number(g._sum.amount || 0);
        return {
          categoryId: g.categoryId,
          categoryName: category?.name || "Uncategorized",
          color: category?.color || "#999999",
          icon: category?.icon || null,
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0,
          count: g._count._all,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }

  async getTrend(userId: string, query: ReportQuery) {
    const where = this.buildWhere(userId, query);
    const groupBy = query.groupBy || "month";

    const transactions = await this.prisma.transaction.findMany({
      where,
      select: { transactionAt: true, type: true, amount: true },
      orderBy: { transactionAt: "asc" },
    });

    const buckets = new Map<string, { expense: number; income: number }>();

    for (const tx of transactions) {
      const key = this.bucketKey(tx.transactionAt, groupBy);
      const bucket = buckets.get(key) || { expense: 0, income: 0 };
      const amount = Number(tx.amount);
      if (tx.type === "EXPENSE") bucket.expense += amount;
      else if (tx.type === "INCOME") bucket.income += amount;
      buckets.set(key, bucket);
    }

    return Array.from(buckets.entries()).map(([period, values]) => ({
      period,
      expense: values.expense,
      income: values.income,
      net: values.income - values.expense,
    }));
  }

  async getAccountBreakdown(userId: string, query: ReportQuery) {
    const where = this.buildWhere(userId, query);

    const grouped = await this.prisma.transaction.groupBy({
      by: ["accountId"],
      where,
      _sum: { amount: true },
      _count: { _all: true },
    });

    const accounts = await this.prisma.account.findMany({
      where: {
        id: { in: grouped.map((g) => g.accountId).filter(Boolean) as string[] },
      },
    });

    return grouped.map((g) => {
      const account = accounts.find((a) => a.id === g.accountId);
      return {
        accountId: g.accountId,
        accountName: account?.name || "Unknown",
        currency: account?.currency || "INR",
        amount: Number(g._sum.amount || 0),
        count: g._count._all,
      };
    });
  }

  private buildWhere(
    userId: string,
    query: ReportQuery,
  ): Prisma.TransactionWhereInput {
    const where: Prisma.TransactionWhereInput = { userId, deletedAt: null };
    if (query.from || query.to) {
      where.transactionAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }
    return where;
  }

  private bucketKey(date: Date, groupBy: string): string {
    const d = new Date(date);
    switch (groupBy) {
      case "day":
        return d.toISOString().slice(0, 10);
      case "week": {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d);
        monday.setDate(diff);
        return monday.toISOString().slice(0, 10);
      }
      case "category":
      case "account":
      case "paymentMethod":
        return d.toISOString().slice(0, 7);
      case "month":
      default:
        return d.toISOString().slice(0, 7);
    }
  }
}
