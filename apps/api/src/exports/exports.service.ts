import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { Prisma } from "@expense-tracker/database";

@Injectable()
export class ExportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.exportJob.findMany({
      where: { userId },
      orderBy: { requestedAt: "desc" },
    });
  }

  async findOne(userId: string, id: string) {
    const job = await this.prisma.exportJob.findFirst({
      where: { id, userId },
    });
    if (!job) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Export job not found.",
      });
    }
    return job;
  }

  async create(
    userId: string,
    data: {
      exportType: "CSV" | "PDF" | "JSON";
      filters?: Record<string, unknown>;
    },
  ) {
    return this.prisma.exportJob.create({
      data: {
        userId,
        exportType: data.exportType,
        filters: data.filters as Prisma.InputJsonValue | undefined,
        status: "QUEUED",
      },
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.exportJob.delete({ where: { id } });
  }
}
