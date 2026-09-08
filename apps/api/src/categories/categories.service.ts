import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@expense-tracker/validation";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, type?: string) {
    return this.prisma.category.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        OR: [{ userId }, { userId: null, isSystem: true }],
        ...(type ? { categoryType: type } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  async findOne(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
        OR: [{ userId }, { userId: null, isSystem: true }],
      },
    });
    if (!category) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Category not found.",
      });
    }
    return category;
  }

  async create(userId: string, data: CreateCategoryInput) {
    return this.prisma.category.create({
      data: { ...data, userId, isSystem: false },
    });
  }

  async update(userId: string, id: string, data: UpdateCategoryInput) {
    const existing = await this.findOne(userId, id);
    if (existing.isSystem) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Cannot modify system categories.",
      });
    }
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const existing = await this.findOne(userId, id);
    if (existing.isSystem) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Cannot delete system categories.",
      });
    }
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
