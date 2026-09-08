import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async getSyncState(userId: string, deviceId?: string) {
    const cursor = await this.prisma.syncCursor.findFirst({
      where: { userId, ...(deviceId ? { deviceId } : {}) },
      orderBy: { updatedAt: "desc" },
    });
    return {
      lastSyncedAt: cursor?.lastSyncedAt || null,
      lastCursor: cursor?.cursor?.toString() || null,
    };
  }

  async getChanges(userId: string, since?: string) {
    const sinceDate = since ? new Date(since) : new Date(0);

    const [transactions, accounts, categories, budgets] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          userId,
          OR: [
            { updatedAt: { gt: sinceDate } },
            { createdAt: { gt: sinceDate } },
          ],
        },
        orderBy: { updatedAt: "asc" },
      }),
      this.prisma.account.findMany({
        where: {
          userId,
          OR: [
            { updatedAt: { gt: sinceDate } },
            { createdAt: { gt: sinceDate } },
          ],
        },
      }),
      this.prisma.category.findMany({
        where: {
          OR: [
            {
              userId,
              OR: [
                { updatedAt: { gt: sinceDate } },
                { createdAt: { gt: sinceDate } },
              ],
            },
            { isSystem: true },
          ],
        },
      }),
      this.prisma.budget.findMany({
        where: {
          userId,
          OR: [
            { updatedAt: { gt: sinceDate } },
            { createdAt: { gt: sinceDate } },
          ],
        },
      }),
    ]);

    return {
      transactions,
      accounts,
      categories,
      budgets,
      serverTime: new Date().toISOString(),
    };
  }

  async updateCursor(userId: string, deviceId: string, cursor: string) {
    const cursorBigInt = BigInt(cursor || "0");
    return this.prisma.syncCursor.upsert({
      where: { userId_deviceId: { userId, deviceId } },
      create: {
        userId,
        deviceId,
        cursor: cursorBigInt,
        lastSyncedAt: new Date(),
      },
      update: { cursor: cursorBigInt, lastSyncedAt: new Date() },
    });
  }
}
