/**
 * End-to-end integration tests for the Smart Expense Tracker API.
 *
 * These tests run against the LIVE API (http://localhost:3001) which is
 * connected to the real PostgreSQL database. This exercises the full stack:
 * NestJS app -> Prisma 7 -> PostgreSQL.
 *
 * Each test uses a uniquely-named user and cleans up after itself by
 * deleting the user via DELETE /users/me.
 */
import request from "supertest";

const BASE_URL = process.env.API_URL || "http://localhost:3001";
const API = `${BASE_URL}/api/v1`;

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}@test.local`;
}

describe("Smart Expense Tracker API (e2e)", () => {
  let email: string;
  let password = "Test@12345";
  let accessToken: string;
  let userId: string;

  const authHeaders = () => ({ Authorization: `Bearer ${accessToken}` });

  afterAll(async () => {
    // Cleanup: delete the test user (cascades to accounts, transactions, etc.)
    if (accessToken) {
      try {
        await request(API).delete("/users/me").set(authHeaders());
      } catch {
        // ignore cleanup errors
      }
    }
  });

  describe("Auth flow", () => {
    it("registers a new user", async () => {
      email = uniqueEmail("e2e");
      const res = await request(API).post("/auth/register").send({
        email,
        password,
        firstName: "E2E",
        lastName: "Tester",
        defaultCurrency: "INR",
        timezone: "Asia/Kolkata",
      });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe(email);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(JSON.stringify(res.body)).not.toContain("passwordHash");
      accessToken = res.body.accessToken;
      userId = res.body.user.id;
    });

    it("rejects duplicate registration", async () => {
      const res = await request(API).post("/auth/register").send({
        email,
        password,
        firstName: "E2E",
        lastName: "Tester",
        defaultCurrency: "INR",
        timezone: "Asia/Kolkata",
      });
      expect(res.status).toBe(409);
    });

    it("logs in with correct credentials", async () => {
      const res = await request(API).post("/auth/login").send({
        email,
        password,
      });
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      accessToken = res.body.accessToken;
    });

    it("rejects login with wrong password", async () => {
      const res = await request(API).post("/auth/login").send({
        email,
        password: "WrongPass123",
      });
      expect(res.status).toBe(401);
    });

    it("returns the current user via /users/me", async () => {
      const res = await request(API).get("/users/me").set(authHeaders());
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(email);
    });
  });

  describe("Accounts", () => {
    let accountId: string;

    it("creates an account with opening balance", async () => {
      const res = await request(API).post("/accounts").set(authHeaders()).send({
        name: "E2E Savings",
        accountType: "BANK",
        openingBalance: "10000",
        currency: "INR",
        includeInTotal: true,
      });
      expect(res.status).toBe(201);
      expect(res.body.currentBalance).toBe("10000");
      accountId = res.body.id;
    });

    it("lists accounts including the default Cash account", async () => {
      const res = await request(API).get("/accounts").set(authHeaders());
      expect(res.status).toBe(200);
      const names = res.body.map((a: { name: string }) => a.name);
      expect(names).toContain("E2E Savings");
      expect(names).toContain("Cash");
    });

    it("updates opening balance and adjusts current balance", async () => {
      const res = await request(API)
        .patch(`/accounts/${accountId}`)
        .set(authHeaders())
        .send({ openingBalance: "12000" });
      expect(res.status).toBe(200);
      expect(Number(res.body.currentBalance)).toBe(12000);
    });
  });

  describe("Transactions & balance updates", () => {
    let accountId: string;
    let expenseId: string;

    beforeAll(async () => {
      const res = await request(API).post("/accounts").set(authHeaders()).send({
        name: "E2E Checking",
        accountType: "BANK",
        openingBalance: "5000",
        currency: "INR",
        includeInTotal: true,
      });
      accountId = res.body.id;
    });

    it("creates an expense and decrements the balance", async () => {
      const res = await request(API)
        .post("/transactions")
        .set(authHeaders())
        .send({
          title: "E2E Groceries",
          amount: "250.50",
          type: "EXPENSE",
          accountId,
          transactionAt: new Date().toISOString(),
          source: "MANUAL",
        });
      expect(res.status).toBe(201);
      expenseId = res.body.id;

      const account = await request(API)
        .get(`/accounts/${accountId}`)
        .set(authHeaders());
      expect(Number(account.body.currentBalance)).toBeCloseTo(5000 - 250.5, 2);
    });

    it("creates an income and increments the balance", async () => {
      const res = await request(API)
        .post("/transactions")
        .set(authHeaders())
        .send({
          title: "E2E Salary",
          amount: "1000",
          type: "INCOME",
          accountId,
          transactionAt: new Date().toISOString(),
          source: "MANUAL",
        });
      expect(res.status).toBe(201);

      const account = await request(API)
        .get(`/accounts/${accountId}`)
        .set(authHeaders());
      expect(Number(account.body.currentBalance)).toBeCloseTo(
        5000 - 250.5 + 1000,
        2,
      );
    });

    it("updates an expense and re-adjusts the balance", async () => {
      const res = await request(API)
        .patch(`/transactions/${expenseId}`)
        .set(authHeaders())
        .send({ amount: "500" });
      expect(res.status).toBe(200);

      const account = await request(API)
        .get(`/accounts/${accountId}`)
        .set(authHeaders());
      expect(Number(account.body.currentBalance)).toBeCloseTo(
        5000 - 500 + 1000,
        2,
      );
    });

    it("deletes an expense and reverses the balance", async () => {
      const res = await request(API)
        .delete(`/transactions/${expenseId}`)
        .set(authHeaders());
      expect(res.status).toBe(200);

      const account = await request(API)
        .get(`/accounts/${accountId}`)
        .set(authHeaders());
      expect(Number(account.body.currentBalance)).toBeCloseTo(5000 + 1000, 2);
    });
  });

  describe("Reports", () => {
    it("returns a summary with income and expense", async () => {
      const res = await request(API).get("/reports/summary").set(authHeaders());
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("totalExpense");
      expect(res.body).toHaveProperty("totalIncome");
      expect(res.body).toHaveProperty("net");
      expect(res.body).toHaveProperty("transactionCount");
    });

    it("returns a category breakdown", async () => {
      const res = await request(API)
        .get("/reports/category-breakdown")
        .set(authHeaders());
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("returns a trend series", async () => {
      const res = await request(API).get("/reports/trend").set(authHeaders());
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("Saved filters", () => {
    it("saves and lists a filter", async () => {
      const create = await request(API)
        .post("/saved-filters")
        .set(authHeaders())
        .send({ name: "E2E Filter", filterDefinition: { search: "coffee" } });
      expect(create.status).toBe(201);

      const list = await request(API).get("/saved-filters").set(authHeaders());
      expect(list.status).toBe(200);
      const names = list.body.map((f: { name: string }) => f.name);
      expect(names).toContain("E2E Filter");
    });
  });

  describe("Health", () => {
    it("reports healthy", async () => {
      const res = await request(API).get("/health");
      expect(res.status).toBe(200);
    });
  });
});
