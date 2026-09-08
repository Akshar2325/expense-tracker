import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@expense-tracker/database";

/**
 * PrismaService wraps the Prisma 7 client using composition (not inheritance).
 * Prisma 7's generated client class does not expose model delegates through
 * class inheritance, so we delegate each model via a getter. This keeps the
 * familiar `this.prisma.user`, `this.prisma.transaction`, ... API surface.
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  readonly client: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString:
        process.env.DATABASE_URL ??
        "postgresql://root:2468@localhost:5432/expense_tracker",
    });
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.client.$connect();
    this.logger.log("✅ Database connected");
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
    this.logger.log("Database disconnected");
  }

  // ---- Model delegates (composition) ----
  get user() {
    return this.client.user;
  }
  get session() {
    return this.client.session;
  }
  get device() {
    return this.client.device;
  }
  get passwordResetToken() {
    return this.client.passwordResetToken;
  }
  get emailVerificationToken() {
    return this.client.emailVerificationToken;
  }
  get account() {
    return this.client.account;
  }
  get category() {
    return this.client.category;
  }
  get paymentMethod() {
    return this.client.paymentMethod;
  }
  get tag() {
    return this.client.tag;
  }
  get transaction() {
    return this.client.transaction;
  }
  get transactionTag() {
    return this.client.transactionTag;
  }
  get transferLink() {
    return this.client.transferLink;
  }
  get recurringTransaction() {
    return this.client.recurringTransaction;
  }
  get budget() {
    return this.client.budget;
  }
  get receipt() {
    return this.client.receipt;
  }
  get savedFilter() {
    return this.client.savedFilter;
  }
  get notificationPreference() {
    return this.client.notificationPreference;
  }
  get insight() {
    return this.client.insight;
  }
  get exportJob() {
    return this.client.exportJob;
  }
  get syncCursor() {
    return this.client.syncCursor;
  }
  get auditLog() {
    return this.client.auditLog;
  }
  get idempotencyRecord() {
    return this.client.idempotencyRecord;
  }

  // ---- Transaction helpers ----
  $transaction<T>(fn: (client: PrismaClient) => Promise<T>): Promise<T> {
    return this.client.$transaction(fn);
  }
}
