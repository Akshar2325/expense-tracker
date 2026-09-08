export enum TransactionType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  TRANSFER = "TRANSFER",
  REFUND = "REFUND",
  ADJUSTMENT = "ADJUSTMENT",
}

export enum TransactionSource {
  MANUAL = "MANUAL",
  WIDGET = "WIDGET",
  IMPORT = "IMPORT",
  RECURRING = "RECURRING",
  API = "API",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SYNCED = "SYNCED",
  FAILED = "FAILED",
  VOIDED = "VOIDED",
}

export enum AccountType {
  CASH = "CASH",
  BANK = "BANK",
  CREDIT_CARD = "CREDIT_CARD",
  WALLET = "WALLET",
  INVESTMENT = "INVESTMENT",
  OTHER = "OTHER",
}

export enum PaymentMethodType {
  CASH = "CASH",
  UPI = "UPI",
  DEBIT_CARD = "DEBIT_CARD",
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  NET_BANKING = "NET_BANKING",
  WALLET = "WALLET",
  OTHER = "OTHER",
}

export enum CategoryType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  BOTH = "BOTH",
}

export enum BudgetPeriodType {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
  CUSTOM = "CUSTOM",
}

export enum BudgetStatus {
  NORMAL = "NORMAL",
  WARNING = "WARNING",
  EXCEEDED = "EXCEEDED",
}

export enum RecurringFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
  CUSTOM = "CUSTOM",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export enum InsightType {
  SPENDING_INCREASE = "SPENDING_INCREASE",
  SPENDING_DECREASE = "SPENDING_DECREASE",
  CATEGORY_ANOMALY = "CATEGORY_ANOMALY",
  BUDGET_WARNING = "BUDGET_WARNING",
  RECURRING_CHARGE_INCREASE = "RECURRING_CHARGE_INCREASE",
  SAVINGS_IMPROVEMENT = "SAVINGS_IMPROVEMENT",
  UNUSUAL_TRANSACTION = "UNUSUAL_TRANSACTION",
}

export enum InsightSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
}

export enum ExportType {
  CSV = "CSV",
  PDF = "PDF",
  JSON = "JSON",
}

export enum ExportStatus {
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum OcrStatus {
  NONE = "NONE",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ActorType {
  USER = "USER",
  SYSTEM = "SYSTEM",
  ADMIN = "ADMIN",
}

export enum DevicePlatform {
  IOS = "IOS",
  ANDROID = "ANDROID",
  WEB = "WEB",
}

export enum SortOrder {
  NEWEST_FIRST = "-transactionAt",
  OLDEST_FIRST = "transactionAt",
  HIGHEST_AMOUNT = "-amount",
  LOWEST_AMOUNT = "amount",
  RECENTLY_UPDATED = "-updatedAt",
}

export enum DatePreset {
  TODAY = "TODAY",
  YESTERDAY = "YESTERDAY",
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  THIS_WEEK = "THIS_WEEK",
  LAST_WEEK = "LAST_WEEK",
  THIS_MONTH = "THIS_MONTH",
  LAST_MONTH = "LAST_MONTH",
  THIS_QUARTER = "THIS_QUARTER",
  THIS_YEAR = "THIS_YEAR",
  CUSTOM = "CUSTOM",
}
