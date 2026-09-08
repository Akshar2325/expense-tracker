import { Test } from "@nestjs/testing";
import { ReportsService } from "./reports.service";
import { PrismaService } from "../common/prisma/prisma.service";

describe("ReportsService", () => {
  let service: ReportsService;
  const userId = "user-1";

  const prismaMock = {
    transaction: {
      aggregate: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    category: { findMany: jest.fn() },
    account: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = moduleRef.get(ReportsService);
  });

  describe("getSummary", () => {
    it("computes totals, net and savings rate", async () => {
      prismaMock.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: "250.50" } })
        .mockResolvedValueOnce({ _sum: { amount: "1000" } });
      prismaMock.transaction.count.mockResolvedValue(3);

      const result = await service.getSummary(userId, {});

      expect(result).toEqual({
        totalExpense: 250.5,
        totalIncome: 1000,
        net: 749.5,
        transactionCount: 3,
        savingsRate: 74.95,
      });
    });

    it("returns zeroes when there are no transactions", async () => {
      prismaMock.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: null } })
        .mockResolvedValueOnce({ _sum: { amount: null } });
      prismaMock.transaction.count.mockResolvedValue(0);

      const result = await service.getSummary(userId, {});

      expect(result.totalExpense).toBe(0);
      expect(result.totalIncome).toBe(0);
      expect(result.net).toBe(0);
      expect(result.savingsRate).toBe(0);
    });

    it("applies an end-of-day inclusive `to` filter for date-only values", async () => {
      prismaMock.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: null } })
        .mockResolvedValueOnce({ _sum: { amount: null } });
      prismaMock.transaction.count.mockResolvedValue(0);

      await service.getSummary(userId, {
        from: "2026-09-01",
        to: "2026-09-08",
      });

      const where = prismaMock.transaction.count.mock.calls[0][0].where;
      expect(where.transactionAt.gte).toEqual(new Date("2026-09-01"));
      expect(where.transactionAt.lte).toEqual(
        new Date("2026-09-08T23:59:59.999Z"),
      );
    });
  });

  describe("getTrend", () => {
    it("buckets transactions by month", async () => {
      prismaMock.transaction.findMany.mockResolvedValue([
        {
          transactionAt: new Date("2026-09-05T10:00:00Z"),
          type: "EXPENSE",
          amount: "100",
        },
        {
          transactionAt: new Date("2026-09-20T10:00:00Z"),
          type: "INCOME",
          amount: "500",
        },
        {
          transactionAt: new Date("2026-10-01T10:00:00Z"),
          type: "EXPENSE",
          amount: "50",
        },
      ]);

      const result = await service.getTrend(userId, { groupBy: "month" });

      expect(result).toEqual([
        { period: "2026-09", expense: 100, income: 500, net: 400 },
        { period: "2026-10", expense: 50, income: 0, net: -50 },
      ]);
    });
  });
});
