import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const adapter = new PrismaPg({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://root:2468@localhost:5432/expense_tracker",
  });
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createClient());

export { PrismaClient } from "./generated/prisma/client.js";
export { Prisma } from "./generated/prisma/client.js";
export * from "./generated/prisma/enums.js";
