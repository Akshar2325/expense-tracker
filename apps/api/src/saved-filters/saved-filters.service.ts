import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { Prisma } from "@expense-tracker/database";
import type {
  CreateSavedFilterInput,
  UpdateSavedFilterInput,
} from "@expense-tracker/validation";

@Injectable()
export class SavedFiltersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.savedFilter.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(userId: string, id: string) {
    const filter = await this.prisma.savedFilter.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!filter) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Saved filter not found.",
      });
    }
    return filter;
  }

  async create(userId: string, data: CreateSavedFilterInput) {
    return this.prisma.savedFilter.create({
      data: {
        userId,
        name: data.name,
        filterDefinition: data.filterDefinition as Prisma.InputJsonValue,
      },
    });
  }

  async update(userId: string, id: string, data: UpdateSavedFilterInput) {
    await this.findOne(userId, id);
    const updateData: Prisma.SavedFilterUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.filterDefinition !== undefined) {
      updateData.filterDefinition =
        data.filterDefinition as Prisma.InputJsonValue;
    }
    return this.prisma.savedFilter.update({ where: { id }, data: updateData });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.savedFilter.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
