// API response types

export interface ApiMeta {
  requestId: string;
}

export interface PaginatedMeta extends ApiMeta {
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  meta: ApiMeta;
}

export interface ApiPaginatedResponse<T = unknown> {
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    requestId: string;
  };
}

// Auth types

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  defaultCurrency: string;
  timezone: string;
  locale: string;
  emailVerified: boolean;
}

// Transaction types

export interface Transaction {
  id: string;
  userId: string;
  clientTransactionId: string;
  accountId: string;
  categoryId: string | null;
  paymentMethodId: string | null;
  recurringTransactionId: string | null;
  type: string;
  amount: string;
  currency: string;
  title: string;
  merchantName: string | null;
  description: string | null;
  notes: string | null;
  transactionAt: string;
  source: string;
  status: string;
  locationName: string | null;
  metadata: Record<string, unknown> | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  tags?: { id: string; name: string; color: string | null }[];
  account?: { id: string; name: string; currency: string };
  category?: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  } | null;
  paymentMethod?: { id: string; name: string; methodType: string } | null;
}

// Dashboard types

export interface DashboardSummary {
  currentBalance: string;
  incomeThisMonth: string;
  expensesThisMonth: string;
  budgetRemaining: string | null;
  savingsRate: number;
  topSpendingCategories: {
    categoryId: string;
    categoryName: string;
    amount: string;
    percentage: number;
  }[];
  recentTransactions: Transaction[];
  upcomingRecurring: {
    id: string;
    title: string;
    amount: string;
    nextRunAt: string;
    type: string;
  }[];
  budgetAlerts: {
    id: string;
    name: string;
    used: string;
    limit: string;
    percentage: number;
    status: string;
  }[];
}

// Budget types

export interface BudgetProgress {
  budgetId: string;
  name: string;
  amount: string;
  used: string;
  remaining: string;
  percentage: number;
  status: string;
  categoryName: string | null;
}

// Report types

export interface ReportSummary {
  income: string;
  expenses: string;
  netSavings: string;
  savingsRate: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: string;
  percentage: number;
  color: string | null;
}

export interface SpendingTrend {
  date: string;
  expense: string;
  income: string;
}

export interface PaymentMethodBreakdown {
  paymentMethodId: string;
  paymentMethodName: string;
  amount: string;
  percentage: number;
}

// Insight types

export interface Insight {
  id: string;
  insightType: string;
  title: string;
  description: string;
  severity: string;
  periodStart: string;
  periodEnd: string;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
}
