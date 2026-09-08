import { Test } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";
import { AuthService } from "./auth.service";
import { PrismaService } from "../common/prisma/prisma.service";

jest.mock("argon2", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  verify: jest.fn(),
  argon2id: 2,
}));

describe("AuthService", () => {
  let service: AuthService;

  const prismaMock = {
    user: { findUnique: jest.fn(), create: jest.fn() },
    notificationPreference: { create: jest.fn() },
    account: { create: jest.fn() },
    session: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const jwtMock = {
    sign: jest.fn().mockReturnValue("signed-token"),
    verify: jest.fn(),
  };

  const configMock = {
    get: jest.fn().mockReturnValue("test-secret"),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  describe("register", () => {
    const input = {
      email: "Test@Example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      defaultCurrency: "INR",
      timezone: "Asia/Kolkata",
    };

    it("normalizes email to lowercase and hashes the password", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: "u1", ...data }),
      );

      await service.register(input);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(argon2.hash).toHaveBeenCalledWith(
        "password123",
        expect.anything(),
      );
      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: "test@example.com",
            passwordHash: "hashed-password",
            displayName: "Test User",
          }),
        }),
      );
    });

    it("creates default notification preferences and a Cash account", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: "u1",
        email: "test@example.com",
        passwordHash: "hashed-password",
        firstName: "Test",
        lastName: "User",
        displayName: "Test User",
        defaultCurrency: "INR",
        timezone: "Asia/Kolkata",
      });

      await service.register(input);

      expect(prismaMock.notificationPreference.create).toHaveBeenCalledWith({
        data: { userId: "u1" },
      });
      expect(prismaMock.account.create).toHaveBeenCalledWith({
        data: {
          userId: "u1",
          name: "Cash",
          accountType: "CASH",
          currency: "INR",
          openingBalance: 0,
          currentBalance: 0,
        },
      });
    });

    it("throws ConflictException when email already exists", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: "existing" });
      await expect(service.register(input)).rejects.toThrow(ConflictException);
    });
  });

  describe("login", () => {
    const input = { email: "test@example.com", password: "password123" };

    it("throws UnauthorizedException for unknown user", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.login(input)).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException for wrong password", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: "u1",
        email: "test@example.com",
        passwordHash: "hashed-password",
        status: "ACTIVE",
        deletedAt: null,
      });
      (argon2.verify as jest.Mock).mockResolvedValue(false);
      await expect(service.login(input)).rejects.toThrow(UnauthorizedException);
    });

    it("returns user and tokens on success", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: "u1",
        email: "test@example.com",
        passwordHash: "hashed-password",
        status: "ACTIVE",
        deletedAt: null,
        firstName: "Test",
        lastName: "User",
        displayName: "Test User",
        defaultCurrency: "INR",
        timezone: "Asia/Kolkata",
      });
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.login(input);

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      // passwordHash must never leak
      expect(JSON.stringify(result)).not.toContain("hashed-password");
    });
  });

  describe("refresh", () => {
    it("throws UnauthorizedException for an invalid token", async () => {
      jwtMock.verify.mockImplementation(() => {
        throw new Error("bad token");
      });
      await expect(service.refresh("bad-token")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("throws UnauthorizedException when the session is revoked", async () => {
      jwtMock.verify.mockReturnValue({
        sub: "u1",
        email: "test@example.com",
        type: "refresh",
      });
      prismaMock.session.findFirst.mockResolvedValue({
        id: "s1",
        revokedAt: new Date(),
      });
      await expect(service.refresh("valid-token")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("rotates the session and returns new tokens", async () => {
      jwtMock.verify.mockReturnValue({
        sub: "u1",
        email: "test@example.com",
        type: "refresh",
      });
      prismaMock.session.findFirst.mockResolvedValue({
        id: "s1",
        revokedAt: null,
      });

      const result = await service.refresh("valid-token");

      expect(prismaMock.session.update).toHaveBeenCalledWith({
        where: { id: "s1" },
        data: { revokedAt: expect.any(Date) },
      });
      expect(result.accessToken).toBe("signed-token");
    });
  });
});
