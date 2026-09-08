import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import type {
  CreateTagInput,
  UpdateTagInput,
} from "@expense-tracker/validation";

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.tag.findMany({
      where: { userId, deletedAt: null },
      orderBy: { name: "asc" },
    });
  }

  async findOne(userId: string, id: string) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!tag) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Tag not found.",
      });
    }
    return tag;
  }

  async create(userId: string, data: CreateTagInput) {
    return this.prisma.tag.create({
      data: { ...data, userId },
    });
  }

  async update(userId: string, id: string, data: UpdateTagInput) {
    await this.findOne(userId, id);
    return this.prisma.tag.update({ where: { id }, data });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.tag.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
