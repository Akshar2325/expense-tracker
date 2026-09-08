import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import type {
  CreateRecurringTransactionInput,
  UpdateRecurringTransactionInput,
} from "@expense-tracker/validation";

@Injectable()
export class RecurringTransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, activeOnly = false) {
    return this.prisma.recurringTransaction.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(activeOnly ? { isActive: true } : {}),
      },
      include: {
        account: { select: { id: true, name: true, currency: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
        paymentMethod: { select: { id: true, name: true, methodType: true } },
      },
      orderBy: { nextRunAt: "asc" },
    });
  }

  async findOne(userId: string, id: string) {
    const rt = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        account: { select: { id: true, name: true, currency: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
        paymentMethod: { select: { id: true, name: true, methodType: true } },
      },
    });
    if (!rt) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Recurring transaction not found.",
      });
    }
    return rt;
  }

  async create(userId: string, data: CreateRecurringTransactionInput) {
    const nextRunAt = this.computeNextRunAt(data.startDate, data.frequency);
    return this.prisma.recurringTransaction.create({
      data: {
        userId,
        accountId: data.accountId,
        categoryId: data.categoryId,
        paymentMethodId: data.paymentMethodId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        title: data.title,
        description: data.description,
        frequency: data.frequency,
        intervalValue: data.intervalValue,
        intervalUnit: data.intervalUnit,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        nextRunAt,
      },
      include: {
        account: { select: { id: true, name: true, currency: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
        paymentMethod: { select: { id: true, name: true, methodType: true } },
      },
    });
  }

  private computeNextRunAt(startDate: string, frequency: string): Date {
    const next = new Date(startDate);
    switch (frequency) {
      case "DAILY":
        next.setDate(next.getDate() + 1);
        break;
      case "WEEKLY":
        next.setDate(next.getDate() + 7);
        break;
      case "MONTHLY":
        next.setMonth(next.getMonth() + 1);
        break;
      case "QUARTERLY":
        next.setMonth(next.getMonth() + 3);
        break;
      case "YEARLY":
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        next.setMonth(next.getMonth() + 1);
        break;
    }
    return next;
  }

  async update(
    userId: string,
    id: string,
    data: UpdateRecurringTransactionInput,
  ) {
    await this.findOne(userId, id);
    return this.prisma.recurringTransaction.update({
      where: { id },
      data,
      include: {
        account: { select: { id: true, name: true, currency: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
        paymentMethod: { select: { id: true, name: true, methodType: true } },
      },
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.recurringTransaction.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async pause(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.recurringTransaction.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async resume(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.recurringTransaction.update({
      where: { id },
      data: { isActive: true },
    });
  }
}
