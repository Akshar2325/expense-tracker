import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import * as argon2 from "argon2";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        defaultCurrency: true,
        timezone: true,
        locale: true,
        emailVerifiedAt: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "User not found.",
      });
    }

    return { ...user, emailVerified: !!user.emailVerifiedAt };
  }

  async updateMe(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      displayName?: string;
      defaultCurrency?: string;
      timezone?: string;
      locale?: string;
      avatarUrl?: string;
    },
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.displayName !== undefined)
      updateData.displayName = data.displayName;
    if (data.defaultCurrency !== undefined)
      updateData.defaultCurrency = data.defaultCurrency;
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.locale !== undefined) updateData.locale = data.locale;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        defaultCurrency: true,
        timezone: true,
        locale: true,
        emailVerifiedAt: true,
        status: true,
        createdAt: true,
      },
    });

    return { ...user, emailVerified: !!user.emailVerifiedAt };
  }

  async deleteMe(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: "DELETED",
        deletedAt: new Date(),
      },
    });
    return { success: true };
  }

  async changePassword(
    userId: string,
    data: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "User not found.",
      });
    }

    const valid = await argon2.verify(user.passwordHash, data.currentPassword);
    if (!valid) {
      throw new BadRequestException({
        code: "INVALID_CURRENT_PASSWORD",
        message: "Current password is incorrect.",
      });
    }

    const newHash = await argon2.hash(data.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { success: true, message: "Password changed successfully" };
  }
}
