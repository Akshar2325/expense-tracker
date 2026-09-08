import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import type {
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from "@expense-tracker/validation";

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        OR: [{ userId }, { userId: null, isSystem: true }],
      },
      orderBy: { name: "asc" },
    });
  }

  async findOne(userId: string, id: string) {
    const pm = await this.prisma.paymentMethod.findFirst({
      where: {
        id,
        deletedAt: null,
        OR: [{ userId }, { userId: null, isSystem: true }],
      },
    });
    if (!pm) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Payment method not found.",
      });
    }
    return pm;
  }

  async create(userId: string, data: CreatePaymentMethodInput) {
    return this.prisma.paymentMethod.create({
      data: { ...data, userId, isSystem: false },
    });
  }

  async update(userId: string, id: string, data: UpdatePaymentMethodInput) {
    const existing = await this.findOne(userId, id);
    if (existing.isSystem) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Cannot modify system payment methods.",
      });
    }
    return this.prisma.paymentMethod.update({ where: { id }, data });
  }

  async delete(userId: string, id: string) {
    const existing = await this.findOne(userId, id);
    if (existing.isSystem) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Cannot delete system payment methods.",
      });
    }
    return this.prisma.paymentMethod.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
