import { global } from "@/server/global";
import { PrismaClient } from "@prisma/client";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export const prisma = (global.prisma ??= new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
}));
