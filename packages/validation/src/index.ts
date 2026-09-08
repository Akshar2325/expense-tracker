import { z } from "zod";

// Auth schemas

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  defaultCurrency: z.string().length(3).default("INR"),
  timezone: z.string().max(100).default("UTC"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

// Account schemas

export const createAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  accountType: z.enum([
    "CASH",
    "BANK",
    "CREDIT_CARD",
    "WALLET",
    "INVESTMENT",
    "OTHER",
  ]),
  currency: z.string().length(3).default("INR"),
  openingBalance: z
    .string()
    .regex(/^\d+(\.\d{1,4})?$/, "Invalid amount")
    .default("0"),
  creditLimit: z
    .string()
    .regex(/^\d+(\.\d{1,4})?$/, "Invalid amount")
    .optional(),
  color: z.string().max(20).optional(),
  icon: z.string().max(100).optional(),
  includeInTotal: z.boolean().default(true),
});

export const updateAccountSchema = createAccountSchema.partial();

// Category schemas

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  parentId: z.string().uuid().optional(),
  categoryType: z.enum(["EXPENSE", "INCOME", "BOTH"]).default("EXPENSE"),
  icon: z.string().max(100).optional(),
  color: z.string().max(20).optional(),
  sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// Payment method schemas

export const createPaymentMethodSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  methodType: z.enum([
    "CASH",
    "UPI",
    "DEBIT_CARD",
    "CREDIT_CARD",
    "BANK_TRANSFER",
    "NET_BANKING",
    "WALLET",
    "OTHER",
  ]),
  accountId: z.string().uuid().optional(),
});

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

// Transaction schemas

export const createTransactionSchema = z.object({
  clientTransactionId: z.string().uuid().optional(),
  type: z.enum(["EXPENSE", "INCOME", "TRANSFER", "REFUND", "ADJUSTMENT"]),
  amount: z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid amount"),
  currency: z.string().length(3).default("INR"),
  accountId: z.string().uuid("Valid account ID is required"),
  categoryId: z.string().uuid().optional().nullable(),
  paymentMethodId: z.string().uuid().optional().nullable(),
  recurringTransactionId: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "Title is required").max(200),
  merchantName: z.string().max(200).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  transactionAt: z.string().datetime(),
  source: z
    .enum(["MANUAL", "WIDGET", "IMPORT", "RECURRING", "API"])
    .default("MANUAL"),
  locationName: z.string().max(200).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateTransactionSchema = createTransactionSchema
  .partial()
  .omit({ clientTransactionId: true });

// Transaction query/filter schema

export const transactionQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  datePreset: z
    .enum([
      "TODAY",
      "YESTERDAY",
      "LAST_7_DAYS",
      "LAST_30_DAYS",
      "THIS_WEEK",
      "LAST_WEEK",
      "THIS_MONTH",
      "LAST_MONTH",
      "THIS_QUARTER",
      "THIS_YEAR",
      "CUSTOM",
    ])
    .optional(),
  types: z.string().optional(), // comma-separated
  categoryIds: z.string().optional(),
  accountIds: z.string().optional(),
  paymentMethodIds: z.string().optional(),
  minAmount: z
    .string()
    .regex(/^\d+(\.\d{1,4})?$/)
    .optional(),
  maxAmount: z
    .string()
    .regex(/^\d+(\.\d{1,4})?$/)
    .optional(),
  search: z.string().max(200).optional(),
  sort: z
    .enum([
      "-transactionAt",
      "transactionAt",
      "-amount",
      "amount",
      "-updatedAt",
    ])
    .default("-transactionAt"),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  hasReceipt: z.enum(["true", "false"]).optional(),
  recurringOnly: z.enum(["true", "false"]).optional(),
  tagIds: z.string().optional(),
});

// Budget schemas

export const createBudgetSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  amount: z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid amount"),
  currency: z.string().length(3).default("INR"),
  categoryId: z.string().uuid().optional().nullable(),
  accountId: z.string().uuid().optional().nullable(),
  periodType: z
    .enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"])
    .default("MONTHLY"),
  startDate: z.string(),
  endDate: z.string().optional(),
  rolloverEnabled: z.boolean().default(false),
  warningPercent: z.number().min(0).max(100).default(80),
  criticalPercent: z.number().min(0).max(200).default(100),
});

export const updateBudgetSchema = createBudgetSchema.partial();

// Recurring transaction schemas

export const createRecurringTransactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid amount"),
  currency: z.string().length(3).default("INR"),
  accountId: z.string().uuid("Valid account ID is required"),
  categoryId: z.string().uuid().optional().nullable(),
  paymentMethodId: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  frequency: z.enum([
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "QUARTERLY",
    "YEARLY",
    "CUSTOM",
  ]),
  intervalValue: z.number().int().min(1).optional(),
  intervalUnit: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]).optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  autoCreate: z.boolean().default(false),
});

export const updateRecurringTransactionSchema =
  createRecurringTransactionSchema.partial();

// Saved filter schema

export const createSavedFilterSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  filterDefinition: z.record(z.unknown()),
});

export const updateSavedFilterSchema = createSavedFilterSchema.partial();

// Tag schema

export const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  color: z.string().max(20).optional(),
});

export const updateTagSchema = createTagSchema.partial();

// Report query schema

export const reportQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  datePreset: z
    .enum([
      "TODAY",
      "YESTERDAY",
      "LAST_7_DAYS",
      "LAST_30_DAYS",
      "THIS_WEEK",
      "LAST_WEEK",
      "THIS_MONTH",
      "LAST_MONTH",
      "THIS_QUARTER",
      "THIS_YEAR",
      "CUSTOM",
    ])
    .optional(),
});

// User profile update

export const updateUserSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  displayName: z.string().max(200).optional(),
  defaultCurrency: z.string().length(3).optional(),
  timezone: z.string().max(100).optional(),
  locale: z.string().max(20).optional(),
  avatarUrl: z.string().url().optional(),
});

// Change password

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
});

// Notification preferences

export const updateNotificationPreferencesSchema = z.object({
  budgetAlerts: z.boolean().optional(),
  recurringAlerts: z.boolean().optional(),
  weeklySummary: z.boolean().optional(),
  monthlySummary: z.boolean().optional(),
  unusualSpending: z.boolean().optional(),
  marketing: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
});

// Export schema

export const createExportSchema = z.object({
  exportType: z.enum(["CSV", "PDF", "JSON"]),
  filters: z.record(z.unknown()).optional(),
});

// Receipt presign

export const presignReceiptSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  fileSize: z
    .number()
    .int()
    .positive()
    .max(10485760, "File too large (max 10MB)"),
});

export const completeReceiptSchema = z.object({
  objectKey: z.string().min(1),
  originalFilename: z.string().max(255),
  mimeType: z.string().max(100),
  fileSize: z.number().int().positive(),
  checksum: z.string().max(128).optional(),
});

// Sync push

export const syncPushSchema = z.object({
  transactions: z.array(
    z.object({
      clientTransactionId: z.string().uuid(),
      type: z.enum(["EXPENSE", "INCOME", "TRANSFER", "REFUND", "ADJUSTMENT"]),
      amount: z.string().regex(/^\d+(\.\d{1,4})?$/),
      currency: z.string().length(3),
      accountId: z.string().uuid(),
      categoryId: z.string().uuid().optional().nullable(),
      paymentMethodId: z.string().uuid().optional().nullable(),
      title: z.string().max(200),
      merchantName: z.string().max(200).optional(),
      description: z.string().optional(),
      notes: z.string().optional(),
      transactionAt: z.string().datetime(),
      tagIds: z.array(z.string().uuid()).optional(),
      localUpdatedAt: z.string().datetime(),
    }),
  ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreatePaymentMethodInput = z.infer<
  typeof createPaymentMethodSchema
>;
export type UpdatePaymentMethodInput = z.infer<
  typeof updatePaymentMethodSchema
>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type CreateRecurringTransactionInput = z.infer<
  typeof createRecurringTransactionSchema
>;
export type UpdateRecurringTransactionInput = z.infer<
  typeof updateRecurringTransactionSchema
>;
export type CreateSavedFilterInput = z.infer<typeof createSavedFilterSchema>;
export type UpdateSavedFilterInput = z.infer<typeof updateSavedFilterSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type ReportQueryInput = z.infer<typeof reportQuerySchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
