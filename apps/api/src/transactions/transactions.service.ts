import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { Prisma } from "@expense-tracker/database";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionQueryInput,
} from "@expense-tracker/validation";
import { randomUUID } from "crypto";

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: TransactionQueryInput) {
    const where: Prisma.TransactionWhereInput = {
      userId,
      deletedAt: null,
    };

    // Date range filter
    if (query.from || query.to) {
      where.transactionAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }

    // Type filter
    if (query.types) {
      const types = query.types.split(",").filter(Boolean);
      if (types.length === 1) {
        where.type = types[0];
      } else if (types.length > 1) {
        where.type = { in: types };
      }
    }

    // Category filter
    if (query.categoryIds) {
      const ids = query.categoryIds.split(",").filter(Boolean);
      where.categoryId = ids.length === 1 ? ids[0] : { in: ids };
    }

    // Account filter
    if (query.accountIds) {
      const ids = query.accountIds.split(",").filter(Boolean);
      where.accountId = ids.length === 1 ? ids[0] : { in: ids };
    }

    // Payment method filter
    if (query.paymentMethodIds) {
      const ids = query.paymentMethodIds.split(",").filter(Boolean);
      where.paymentMethodId = ids.length === 1 ? ids[0] : { in: ids };
    }

    // Amount range
    if (query.minAmount || query.maxAmount) {
      where.amount = {};
      if (query.minAmount)
        (where.amount as Record<string, string>).gte = query.minAmount;
      if (query.maxAmount)
        (where.amount as Record<string, string>).lte = query.maxAmount;
    }

    // Text search
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { merchantName: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { notes: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // Sorting
    const sortField = query.sort?.startsWith("-")
      ? query.sort.slice(1)
      : query.sort || "transactionAt";
    const sortDir = query.sort?.startsWith("-") ? "desc" : "asc";

    const take = query.limit || 50;
    const skip = query.cursor ? 1 : 0;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { [sortField]: sortDir },
        take: take + 1,
        skip,
        ...(query.cursor ? { cursor: { id: query.cursor } } : {}),
        include: {
          account: { select: { id: true, name: true, currency: true } },
          category: {
            select: { id: true, name: true, color: true, icon: true },
          },
          paymentMethod: { select: { id: true, name: true, methodType: true } },
          transactionTags: {
            include: {
              tag: { select: { id: true, name: true, color: true } },
            },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const hasMore = transactions.length > take;
    const data = hasMore ? transactions.slice(0, take) : transactions;

    // Flatten tags
    const result = data.map((t) => ({
      ...t,
      tags: t.transactionTags.map((tt) => tt.tag),
      transactionTags: undefined,
    }));

    return {
      data: result,
      meta: {
        total,
        hasNext: hasMore,
        cursor: hasMore ? data[data.length - 1].id : null,
        limit: take,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        account: { select: { id: true, name: true, currency: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
        paymentMethod: { select: { id: true, name: true, methodType: true } },
        transactionTags: {
          include: { tag: { select: { id: true, name: true, color: true } } },
        },
        receipts: {
          select: { id: true, originalFilename: true, mimeType: true },
        },
      },
    });
    if (!tx) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Transaction not found.",
      });
    }
    return {
      ...tx,
      tags: tx.transactionTags.map((tt) => tt.tag),
      transactionTags: undefined,
    };
  }

  async create(
    userId: string,
    input: CreateTransactionInput,
    idempotencyKey?: string,
  ) {
    // Idempotency check
    if (idempotencyKey) {
      const existing = await this.prisma.idempotencyRecord.findFirst({
        where: {
          userId,
          idempotencyKey,
          expiresAt: { gt: new Date() },
        },
      });
      if (existing) {
        return JSON.parse(existing.responseBody);
      }
    }

    const clientTransactionId = input.clientTransactionId || randomUUID();

    // Check for duplicate
    const duplicate = await this.prisma.transaction.findFirst({
      where: { userId, clientTransactionId },
    });
    if (duplicate) {
      throw new ConflictException({
        code: "TRANSACTION_DUPLICATE",
        message: "Transaction with this client ID already exists.",
      });
    }

    const { tagIds, ...txData } = input;

    // Create transaction (tags handled separately to avoid Prisma
    // nested-write/include type conflicts)
    const created = await this.prisma.transaction.create({
      data: {
        ...txData,
        userId,
        clientTransactionId,
        status: "SYNCED",
        amount: txData.amount,
      } as Prisma.TransactionUncheckedCreateInput,
    });

    // Handle tags
    if (tagIds && tagIds.length > 0) {
      await this.prisma.transactionTag.createMany({
        data: tagIds.map((tagId) => ({
          transactionId: created.id,
          tagId,
        })),
      });
    }

    // Fetch with relations
    const result = await this.prisma.transaction.findUnique({
      where: { id: created.id },
      include: {
        account: { select: { id: true, name: true, currency: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
        paymentMethod: { select: { id: true, name: true, methodType: true } },
        transactionTags: {
          include: { tag: { select: { id: true, name: true, color: true } } },
        },
      },
    });

    if (!result) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Transaction not found.",
      });
    }

    // Update account balance
    await this.updateAccountBalance(
      txData.accountId,
      txData.type,
      txData.amount,
    );

    // Store idempotency record
    if (idempotencyKey) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);
      await this.prisma.idempotencyRecord.create({
        data: {
          userId,
          idempotencyKey,
          requestHash: clientTransactionId,
          responseStatus: 201,
          responseBody: JSON.stringify(result),
          expiresAt,
        },
      });
    }

    return {
      ...result,
      tags: result.transactionTags.map((tt) => tt.tag),
      transactionTags: undefined,
    };
  }

  async update(userId: string, id: string, data: UpdateTransactionInput) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Transaction not found.",
      });
    }

    const { tagIds, ...updateData } = data;

    // Reverse old account balance, apply new
    if (existing.accountId) {
      await this.updateAccountBalance(
        existing.accountId,
        existing.type,
        existing.amount.toString(),
        true, // reverse
      );
    }

    // Update transaction fields (tags handled separately to avoid
    // Prisma nested-write/include type conflicts)
    await this.prisma.transaction.update({
      where: { id },
      data: {
        ...updateData,
        version: { increment: 1 },
      } as Prisma.TransactionUpdateInput,
    });

    // Handle tags separately
    if (tagIds !== undefined) {
      await this.prisma.transactionTag.deleteMany({
        where: { transactionId: id },
      });
      if (tagIds.length > 0) {
        await this.prisma.transactionTag.createMany({
          data: tagIds.map((tagId) => ({ transactionId: id, tagId })),
        });
      }
    }

    // Fetch updated transaction with relations
    const result = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        account: { select: { id: true, name: true, currency: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
        paymentMethod: { select: { id: true, name: true, methodType: true } },
        transactionTags: {
          include: { tag: { select: { id: true, name: true, color: true } } },
        },
      },
    });

    if (!result) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Transaction not found.",
      });
    }

    // Apply new account balance
    const type = updateData.type || existing.type;
    const amount = updateData.amount || existing.amount.toString();
    await this.updateAccountBalance(existing.accountId, type, amount);

    return {
      ...result,
      tags: result.transactionTags.map((tt) => tt.tag),
      transactionTags: undefined,
    };
  }

  async delete(userId: string, id: string) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Transaction not found.",
      });
    }

    // Reverse account balance
    if (existing.accountId) {
      await this.updateAccountBalance(
        existing.accountId,
        existing.type,
        existing.amount.toString(),
        true,
      );
    }

    return this.prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date(), status: "VOIDED" },
    });
  }

  async restore(userId: string, id: string) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Transaction not found.",
      });
    }

    if (!existing.deletedAt) {
      return existing;
    }

    // Re-apply account balance
    if (existing.accountId) {
      await this.updateAccountBalance(
        existing.accountId,
        existing.type,
        existing.amount.toString(),
      );
    }

    return this.prisma.transaction.update({
      where: { id },
      data: { deletedAt: null, status: "SYNCED" },
    });
  }

  private async updateAccountBalance(
    accountId: string,
    type: string,
    amount: string | number,
    reverse = false,
  ) {
    const multiplier = reverse ? -1 : 1;
    const amountNum = Number(amount);
    let delta: number;

    switch (type) {
      case "EXPENSE":
        delta = -(amountNum * multiplier);
        break;
      case "INCOME":
        delta = amountNum * multiplier;
        break;
      default:
        delta = 0;
        break;
    }

    if (delta !== 0) {
      await this.prisma.account.update({
        where: { id: accountId },
        data: { currentBalance: { increment: delta } },
      });
    }
  }
}
