import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class InsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardInsights(userId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const [monthExpense, monthIncome, topCategories, recentTx, budgets] =
      await Promise.all([
        this.prisma.transaction.aggregate({
          where: {
            userId,
            deletedAt: null,
            type: "EXPENSE",
            transactionAt: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }),
        this.prisma.transaction.aggregate({
          where: {
            userId,
            deletedAt: null,
            type: "INCOME",
            transactionAt: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }),
        this.prisma.transaction.groupBy({
          by: ["categoryId"],
          where: {
            userId,
            deletedAt: null,
            type: "EXPENSE",
            transactionAt: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }),
        this.prisma.transaction.findMany({
          where: { userId, deletedAt: null },
          orderBy: { transactionAt: "desc" },
          take: 5,
          include: {
            category: { select: { name: true, color: true, icon: true } },
            account: { select: { name: true } },
          },
        }),
        this.prisma.budget.findMany({
          where: { userId, deletedAt: null },
          include: { category: { select: { name: true, color: true } } },
        }),
      ]);

    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: topCategories
            .map((c) => c.categoryId)
            .filter(Boolean) as string[],
        },
      },
    });

    const totalExpense = Number(monthExpense._sum.amount || 0);
    const totalIncome = Number(monthIncome._sum.amount || 0);

    const sortedTopCategories = [...topCategories].sort(
      (a, b) => Number(b._sum.amount || 0) - Number(a._sum.amount || 0),
    );

    return {
      month: {
        expense: totalExpense,
        income: totalIncome,
        net: totalIncome - totalExpense,
      },
      topCategories: sortedTopCategories.slice(0, 5).map((c) => {
        const category = categories.find((cat) => cat.id === c.categoryId);
        return {
          categoryId: c.categoryId,
          name: category?.name || "Uncategorized",
          color: category?.color || "#999999",
          icon: category?.icon || null,
          amount: Number(c._sum.amount || 0),
        };
      }),
      recentTransactions: recentTx,
      budgets: budgets.map((b) => ({
        id: b.id,
        name: b.name,
        amount: Number(b.amount),
        categoryName: b.category?.name || "Overall",
        color: b.category?.color || "#292524",
      })),
    };
  }

  async getSpendingPatterns(userId: string) {
    const now = new Date();
    const last30 = new Date(now);
    last30.setDate(last30.getDate() - 30);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        type: "EXPENSE",
        transactionAt: { gte: last30 },
      },
      select: { transactionAt: true, amount: true, categoryId: true },
    });

    const dayOfWeek = new Map<number, number>();
    const hourOfDay = new Map<number, number>();
    let total = 0;

    for (const tx of transactions) {
      const d = new Date(tx.transactionAt);
      const dow = d.getDay();
      const hour = d.getHours();
      const amount = Number(tx.amount);
      dayOfWeek.set(dow, (dayOfWeek.get(dow) || 0) + amount);
      hourOfDay.set(hour, (hourOfDay.get(hour) || 0) + amount);
      total += amount;
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const peakDay = Array.from(dayOfWeek.entries()).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const peakHour = Array.from(hourOfDay.entries()).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      totalSpent: total,
      transactionCount: transactions.length,
      averagePerDay: total / 30,
      peakDay: peakDay ? { day: days[peakDay[0]], amount: peakDay[1] } : null,
      peakHour: peakHour ? { hour: peakHour[0], amount: peakHour[1] } : null,
      dayOfWeek: days.map((day, i) => ({ day, amount: dayOfWeek.get(i) || 0 })),
      hourOfDay: Array.from(hourOfDay.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([hour, amount]) => ({ hour, amount })),
    };
  }
}
