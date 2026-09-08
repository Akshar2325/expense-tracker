import { Module } from "@nestjs/common";
import { RecurringTransactionsService } from "./recurring-transactions.service";
import { RecurringTransactionsController } from "./recurring-transactions.controller";
import { PrismaModule } from "../common/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [RecurringTransactionsService],
  controllers: [RecurringTransactionsController],
  exports: [RecurringTransactionsService],
})
export class RecurringTransactionsModule {}
