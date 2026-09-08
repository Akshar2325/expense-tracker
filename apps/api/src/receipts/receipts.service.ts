import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { Prisma } from "@expense-tracker/database";

@Injectable()
export class ReceiptsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, transactionId?: string) {
    return this.prisma.receipt.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(transactionId ? { transactionId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(userId: string, id: string) {
    const receipt = await this.prisma.receipt.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!receipt) {
      throw new NotFoundException({
        code: "RESOURCE_NOT_FOUND",
        message: "Receipt not found.",
      });
    }
    return receipt;
  }

  async create(
    userId: string,
    data: {
      transactionId: string;
      objectKey: string;
      originalFilename: string;
      mimeType: string;
      fileSize: bigint | number;
      checksum?: string;
      thumbnailKey?: string;
      ocrData?: Record<string, unknown>;
    },
  ) {
    return this.prisma.receipt.create({
      data: {
        userId,
        transactionId: data.transactionId,
        objectKey: data.objectKey,
        originalFilename: data.originalFilename,
        mimeType: data.mimeType,
        fileSize: data.fileSize,
        checksum: data.checksum,
        thumbnailKey: data.thumbnailKey,
        ocrStatus: data.ocrData ? "COMPLETED" : "NONE",
        ocrData: data.ocrData as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async updateOcrData(
    userId: string,
    id: string,
    ocrData: Record<string, unknown>,
  ) {
    await this.findOne(userId, id);
    return this.prisma.receipt.update({
      where: { id },
      data: {
        ocrData: ocrData as Prisma.InputJsonValue,
        ocrStatus: "COMPLETED",
      },
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.receipt.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
