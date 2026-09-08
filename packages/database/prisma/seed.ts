import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const expenseCategories = [
  { name: "Food & Dining", icon: "🍽️", color: "#f97316", sortOrder: 1 },
  { name: "Groceries", icon: "🛒", color: "#84cc16", sortOrder: 2 },
  { name: "Transport", icon: "🚌", color: "#3b82f6", sortOrder: 3 },
  { name: "Fuel", icon: "⛽", color: "#eab308", sortOrder: 4 },
  { name: "Shopping", icon: "🛍️", color: "#ec4899", sortOrder: 5 },
  { name: "Entertainment", icon: "🎬", color: "#a855f7", sortOrder: 6 },
  { name: "Bills & Utilities", icon: "💡", color: "#06b6d4", sortOrder: 7 },
  { name: "Rent", icon: "🏠", color: "#6366f1", sortOrder: 8 },
  { name: "Healthcare", icon: "⚕️", color: "#ef4444", sortOrder: 9 },
  { name: "Education", icon: "📚", color: "#0ea5e9", sortOrder: 10 },
  { name: "Travel", icon: "✈️", color: "#f59e0b", sortOrder: 11 },
  { name: "Personal Care", icon: "💅", color: "#d946ef", sortOrder: 12 },
  { name: "Gifts", icon: "🎁", color: "#10b981", sortOrder: 13 },
  { name: "Subscriptions", icon: "📱", color: "#8b5cf6", sortOrder: 14 },
  { name: "Insurance", icon: "🛡️", color: "#14b8a6", sortOrder: 15 },
  { name: "Taxes", icon: "🧾", color: "#78716c", sortOrder: 16 },
  { name: "Family", icon: "👨‍👩‍👧", color: "#f43f5e", sortOrder: 17 },
  { name: "Pets", icon: "🐾", color: "#a3a3a3", sortOrder: 18 },
  { name: "Other", icon: "📦", color: "#52525b", sortOrder: 19 },
];

const incomeCategories = [
  { name: "Salary", icon: "💼", color: "#10b981", sortOrder: 1 },
  { name: "Freelance", icon: "💻", color: "#06b6d4", sortOrder: 2 },
  { name: "Business", icon: "🏪", color: "#f59e0b", sortOrder: 3 },
  { name: "Interest", icon: "🏦", color: "#6366f1", sortOrder: 4 },
  { name: "Dividend", icon: "📊", color: "#8b5cf6", sortOrder: 5 },
  { name: "Bonus", icon: "🎉", color: "#ec4899", sortOrder: 6 },
  { name: "Gift", icon: "🎁", color: "#f43f5e", sortOrder: 7 },
  { name: "Refund", icon: "↩️", color: "#14b8a6", sortOrder: 8 },
  { name: "Other Income", icon: "💰", color: "#78716c", sortOrder: 9 },
];

const systemPaymentMethods = [
  { name: "Cash", methodType: "CASH" },
  { name: "UPI", methodType: "UPI" },
  { name: "Debit Card", methodType: "DEBIT_CARD" },
  { name: "Credit Card", methodType: "CREDIT_CARD" },
  { name: "Bank Transfer", methodType: "BANK_TRANSFER" },
  { name: "Net Banking", methodType: "NET_BANKING" },
  { name: "Wallet", methodType: "WALLET" },
  { name: "Other", methodType: "OTHER" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Seed system expense categories
  for (const cat of expenseCategories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, isSystem: true },
    });
    if (!existing) {
      await prisma.category.create({
        data: { ...cat, categoryType: "EXPENSE", isSystem: true },
      });
    }
  }
  console.log(`✓ Seeded ${expenseCategories.length} expense categories`);

  // Seed system income categories
  for (const cat of incomeCategories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, isSystem: true },
    });
    if (!existing) {
      await prisma.category.create({
        data: { ...cat, categoryType: "INCOME", isSystem: true },
      });
    }
  }
  console.log(`✓ Seeded ${incomeCategories.length} income categories`);

  // Seed system payment methods
  for (const pm of systemPaymentMethods) {
    const existing = await prisma.paymentMethod.findFirst({
      where: { name: pm.name, isSystem: true },
    });
    if (!existing) {
      await prisma.paymentMethod.create({
        data: { ...pm, isSystem: true },
      });
    }
  }
  console.log(`✓ Seeded ${systemPaymentMethods.length} payment methods`);

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
