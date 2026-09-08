import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import type {
  CreateBudgetInput,
  UpdateBudgetInput,
} from "@expense-tracker/validation";

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, activeOnly = false) {
    const now = new Date();
    return this.prisma.budget.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(activeOnly
          ? {
              OR: [{ endDate: null }, { endDate: { gte: now } }],
            }
          : {}),
      },
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
        account: { select: { id: true, name: true, currency: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(userId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
        account: { select: { id: true, name: true, currency: true } },
      },
    });
    if (!budget) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Budget not found.",
      });
    }
    return budget;
  }

  async create(userId: string, data: CreateBudgetInput) {
    return this.prisma.budget.create({
      data: { ...data, userId },
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
        account: { select: { id: true, name: true, currency: true } },
      },
    });
  }

  async update(userId: string, id: string, data: UpdateBudgetInput) {
    await this.findOne(userId, id);
    return this.prisma.budget.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
        account: { select: { id: true, name: true, currency: true } },
      },
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.budget.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getSpending(userId: string, id: string) {
    const budget = await this.findOne(userId, id);

    const where: Record<string, unknown> = {
      userId,
      deletedAt: null,
      type: "EXPENSE",
      transactionAt: { gte: budget.startDate },
    };
    if (budget.endDate) {
      (where.transactionAt as Record<string, unknown>).lte = budget.endDate;
    }
    if (budget.categoryId) {
      where.categoryId = budget.categoryId;
    }
    if (budget.accountId) {
      where.accountId = budget.accountId;
    }

    const agg = await this.prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
    });

    const spent = Number(agg._sum.amount || 0);
    const budgetAmount = Number(budget.amount);
    const remaining = budgetAmount - spent;
    const percentUsed = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
    const criticalPercent = Number(budget.criticalPercent);
    const warningPercent = Number(budget.warningPercent);

    return {
      budget,
      spent,
      budgetAmount,
      remaining,
      percentUsed,
      status:
        percentUsed >= criticalPercent
          ? "CRITICAL"
          : percentUsed >= warningPercent
            ? "WARNING"
            : "OK",
    };
  }
}
