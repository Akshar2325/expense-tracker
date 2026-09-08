import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "../common/prisma/prisma.service";
import type { RegisterInput, LoginInput } from "@expense-tracker/validation";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(input: RegisterInput) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException({
        code: "AUTH_EMAIL_EXISTS",
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      parallelism: 1,
      timeCost: 2,
    });

    const user = await this.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        displayName: input.firstName
          ? `${input.firstName}${input.lastName ? " " + input.lastName : ""}`
          : null,
        defaultCurrency: input.defaultCurrency,
        timezone: input.timezone,
      },
    });

    // Create default notification preferences
    await this.prisma.notificationPreference.create({
      data: { userId: user.id },
    });

    // Create default Cash account
    await this.prisma.account.create({
      data: {
        userId: user.id,
        name: "Cash",
        accountType: "CASH",
        currency: input.defaultCurrency,
        openingBalance: 0,
        currentBalance: 0,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (!user || user.status !== "ACTIVE" || user.deletedAt) {
      throw new UnauthorizedException({
        code: "AUTH_INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const valid = await argon2.verify(user.passwordHash, input.password);
    if (!valid) {
      throw new UnauthorizedException({
        code: "AUTH_INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const tokens = await this.generateTokens(user.id, user.email);
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string; type: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>(
          "JWT_REFRESH_SECRET",
          "fallback-refresh",
        ),
      });
    } catch {
      throw new UnauthorizedException({
        code: "AUTH_SESSION_EXPIRED",
        message: "Refresh token expired or invalid.",
      });
    }

    if (payload.type !== "refresh") {
      throw new UnauthorizedException({
        code: "AUTH_SESSION_EXPIRED",
        message: "Invalid token type.",
      });
    }

    const session = await this.prisma.session.findFirst({
      where: {
        userId: payload.sub,
        refreshTokenHash: await this.hashToken(refreshToken),
      },
    });
    if (!session || session.revokedAt) {
      throw new UnauthorizedException({
        code: "AUTH_SESSION_EXPIRED",
        message: "Session revoked.",
      });
    }

    // Rotate: revoke old session, create new
    await this.prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens(payload.sub, payload.email);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>("JWT_ACCESS_EXPIRES_IN", "15m"),
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, type: "refresh" },
      {
        secret: this.config.get<string>(
          "JWT_REFRESH_SECRET",
          "fallback-refresh",
        ),
        expiresIn: this.config.get<string>("JWT_REFRESH_EXPIRES_IN", "7d"),
      },
    );

    // Store session
    const refreshTokenHash = await this.hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes
    };
  }

  private async hashToken(token: string): Promise<string> {
    const crypto = await import("crypto");
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private sanitizeUser(user: Record<string, unknown>) {
    const { passwordHash, ...sanitized } = user;
    return {
      ...sanitized,
      emailVerified: !!user.emailVerifiedAt,
    } as unknown;
  }
}
