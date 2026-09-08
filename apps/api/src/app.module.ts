import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./common/prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AccountsModule } from "./accounts/accounts.module";
import { CategoriesModule } from "./categories/categories.module";
import { PaymentMethodsModule } from "./payment-methods/payment-methods.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { BudgetsModule } from "./budgets/budgets.module";
import { RecurringTransactionsModule } from "./recurring-transactions/recurring-transactions.module";
import { TagsModule } from "./tags/tags.module";
import { ReportsModule } from "./reports/reports.module";
import { InsightsModule } from "./insights/insights.module";
import { ReceiptsModule } from "./receipts/receipts.module";
import { ExportsModule } from "./exports/exports.module";
import { SyncModule } from "./sync/sync.module";
import { SavedFiltersModule } from "./saved-filters/saved-filters.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AccountsModule,
    CategoriesModule,
    PaymentMethodsModule,
    TransactionsModule,
    BudgetsModule,
    RecurringTransactionsModule,
    TagsModule,
    ReportsModule,
    InsightsModule,
    ReceiptsModule,
    ExportsModule,
    SyncModule,
    SavedFiltersModule,
    HealthModule,
  ],
})
export class AppModule {}
