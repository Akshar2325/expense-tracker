import { Test } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { PrismaService } from "../common/prisma/prisma.service";

describe("TransactionsService", () => {
  let service: TransactionsService;
  const userId = "user-1";

  const prismaMock = {
    transaction: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    transactionTag: { createMany: jest.fn() },
    idempotencyRecord: { findFirst: jest.fn(), create: jest.fn() },
    account: { update: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = moduleRef.get(TransactionsService);
  });

  describe("create", () => {
    const baseInput = {
      type: "EXPENSE" as const,
      amount: "250.50",
      currency: "INR",
      accountId: "acc-1",
      title: "Groceries",
      transactionAt: "2026-09-08T10:00:00.000Z",
      source: "MANUAL" as const,
    };

    it("creates an EXPENSE and decrements the account balance", async () => {
      prismaMock.transaction.findFirst.mockResolvedValue(null); // no duplicate
      prismaMock.transaction.create.mockResolvedValue({ id: "tx-1" });
      prismaMock.transaction.findUnique.mockResolvedValue({
        id: "tx-1",
        transactionTags: [],
      });

      await service.create(userId, baseInput);

      expect(prismaMock.account.update).toHaveBeenCalledWith({
        where: { id: "acc-1" },
        data: { currentBalance: { increment: -250.5 } },
      });
    });

    it("creates an INCOME and increments the account balance", async () => {
      prismaMock.transaction.findFirst.mockResolvedValue(null);
      prismaMock.transaction.create.mockResolvedValue({ id: "tx-2" });
      prismaMock.transaction.findUnique.mockResolvedValue({
        id: "tx-2",
        transactionTags: [],
      });

      await service.create(userId, {
        ...baseInput,
        type: "INCOME",
        amount: "1000",
      });

      expect(prismaMock.account.update).toHaveBeenCalledWith({
        where: { id: "acc-1" },
        data: { currentBalance: { increment: 1000 } },
      });
    });

    it("does not change balance for TRANSFER", async () => {
      prismaMock.transaction.findFirst.mockResolvedValue(null);
      prismaMock.transaction.create.mockResolvedValue({ id: "tx-3" });
      prismaMock.transaction.findUnique.mockResolvedValue({
        id: "tx-3",
        transactionTags: [],
      });

      await service.create(userId, {
        ...baseInput,
        type: "TRANSFER",
        amount: "500",
      });

      expect(prismaMock.account.update).not.toHaveBeenCalled();
    });

    it("rejects duplicate clientTransactionId", async () => {
      prismaMock.transaction.findFirst.mockResolvedValue({ id: "existing" });
      await expect(
        service.create(userId, {
          ...baseInput,
          clientTransactionId: "11111111-1111-1111-1111-111111111111",
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("returns the cached response for a repeated idempotency key", async () => {
      prismaMock.idempotencyRecord.findFirst.mockResolvedValue({
        responseBody: JSON.stringify({ id: "cached-tx" }),
      });
      const result = await service.create(userId, baseInput, "idem-key-1");
      expect(result).toEqual({ id: "cached-tx" });
      expect(prismaMock.transaction.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("reverses the old balance and applies the new one", async () => {
      prismaMock.transaction.findFirst.mockResolvedValue({
        id: "tx-1",
        accountId: "acc-1",
        type: "EXPENSE",
        amount: "100",
      });
      prismaMock.transaction.update.mockResolvedValue({ id: "tx-1" });

      await service.update(userId, "tx-1", { amount: "200" });

      // Reverse old expense (+100), then apply new expense (-200)
      expect(prismaMock.account.update).toHaveBeenNthCalledWith(1, {
        where: { id: "acc-1" },
        data: { currentBalance: { increment: 100 } },
      });
      expect(prismaMock.account.update).toHaveBeenNthCalledWith(2, {
        where: { id: "acc-1" },
        data: { currentBalance: { increment: -200 } },
      });
    });

    it("throws NotFoundException when transaction is missing", async () => {
      prismaMock.transaction.findFirst.mockResolvedValue(null);
      await expect(
        service.update(userId, "missing", { amount: "10" }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
