import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { Prisma } from "@expense-tracker/database";
import type {
  CreateAccountInput,
  UpdateAccountInput,
} from "@expense-tracker/validation";

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "asc" },
    });
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!account) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Account not found.",
      });
    }
    return account;
  }

  async create(userId: string, data: CreateAccountInput) {
    return this.prisma.account.create({
      data: {
        ...data,
        userId,
        // Initialize current balance with the opening balance
        currentBalance: data.openingBalance ?? "0",
      },
    });
  }

  async update(userId: string, id: string, data: UpdateAccountInput) {
    const existing = await this.findOne(userId, id);

    const updateData: Prisma.AccountUpdateInput = { ...data };

    // If opening balance changes, adjust current balance by the difference
    if (data.openingBalance !== undefined) {
      const diff =
        Number(data.openingBalance) - Number(existing.openingBalance);
      updateData.currentBalance = { increment: diff };
    }

    return this.prisma.account.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.account.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getBalance(userId: string) {
    const accounts = await this.prisma.account.findMany({
      where: { userId, deletedAt: null, includeInTotal: true },
      select: { currentBalance: true, accountType: true },
    });

    let total = 0;
    for (const acc of accounts) {
      total += Number(acc.currentBalance);
    }
    return total.toString();
  }
}
