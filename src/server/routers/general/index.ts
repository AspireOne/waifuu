import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/lib/trpc";
import Replicate from "replicate";
import { env } from "@/server/env";

export const generalRouter = createTRPCRouter({
  health: publicProcedure
    .meta({ openapi: { method: "GET", path: "/health" } })
    .query(() => {
      return "ok";
    }),

  dbHealth: publicProcedure
    .meta({ openapi: { method: "GET", path: "/db-health" } })
    .query(async ({ input, ctx }) => {
      // Check that prisma db works. Do not use rawQuery.
      const res = await ctx.prisma.user.findMany();
      if (res) {
        return "ok";
      }
    }),

  protectedHealth: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/protected-health" } })
    .query(() => {
      return "ok";
    }),
});
