import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/lib/trpc";
import submitFeedback from "@/server/routers/general/submitFeedback";

export const generalRouter = createTRPCRouter({
  submitFeedback,
  health: publicProcedure.meta({ openapi: { method: "GET", path: "/health" } }).query(() => {
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
