import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { PrismaService } from "../common/prisma/prisma.service";

describe("AccountsService", () => {
  let service: AccountsService;
  const userId = "user-1";

  const prismaMock = {
    account: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = moduleRef.get(AccountsService);
  });

  describe("findAll", () => {
    it("returns only non-deleted accounts for the user", async () => {
      prismaMock.account.findMany.mockResolvedValue([{ id: "a1" }]);
      const result = await service.findAll(userId);
      expect(prismaMock.account.findMany).toHaveBeenCalledWith({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: "asc" },
      });
      expect(result).toEqual([{ id: "a1" }]);
    });
  });

  describe("findOne", () => {
    it("throws NotFoundException when account is missing", async () => {
      prismaMock.account.findFirst.mockResolvedValue(null);
      await expect(service.findOne(userId, "missing")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("returns the account when found", async () => {
      prismaMock.account.findFirst.mockResolvedValue({ id: "a1" });
      const result = await service.findOne(userId, "a1");
      expect(result).toEqual({ id: "a1" });
    });
  });

  describe("create", () => {
    it("initializes currentBalance to the opening balance", async () => {
      prismaMock.account.create.mockImplementation(({ data }) =>
        Promise.resolve(data),
      );
      const result = await service.create(userId, {
        name: "Savings",
        accountType: "BANK",
        openingBalance: "5000",
        currency: "INR",
        includeInTotal: true,
      });
      expect(prismaMock.account.create).toHaveBeenCalledWith({
        data: {
          name: "Savings",
          accountType: "BANK",
          openingBalance: "5000",
          currency: "INR",
          includeInTotal: true,
          userId,
          currentBalance: "5000",
        },
      });
      expect(result.currentBalance).toBe("5000");
    });

    it("defaults currentBalance to 0 when no opening balance", async () => {
      prismaMock.account.create.mockImplementation(({ data }) =>
        Promise.resolve(data),
      );
      const result = await service.create(userId, {
        name: "Cash",
        accountType: "CASH",
        currency: "INR",
        openingBalance: "0",
        includeInTotal: true,
      });
      expect(result.currentBalance).toBe("0");
    });
  });

  describe("update", () => {
    it("adjusts currentBalance by the opening balance difference", async () => {
      prismaMock.account.findFirst.mockResolvedValue({
        id: "a1",
        openingBalance: "5000",
      });
      prismaMock.account.update.mockImplementation(({ data }) =>
        Promise.resolve(data),
      );

      const result = await service.update(userId, "a1", {
        openingBalance: "7000",
      });

      expect(prismaMock.account.update).toHaveBeenCalledWith({
        where: { id: "a1" },
        data: {
          openingBalance: "7000",
          currentBalance: { increment: 2000 },
        },
      });
      expect(result.currentBalance).toEqual({ increment: 2000 });
    });

    it("does not touch currentBalance when opening balance is unchanged", async () => {
      prismaMock.account.findFirst.mockResolvedValue({
        id: "a1",
        openingBalance: "5000",
      });
      prismaMock.account.update.mockImplementation(({ data }) =>
        Promise.resolve(data),
      );

      const result = await service.update(userId, "a1", { name: "Renamed" });

      expect(result.currentBalance).toBeUndefined();
    });
  });
});
