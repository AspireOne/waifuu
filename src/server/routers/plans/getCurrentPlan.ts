import { protectedProcedure } from "@/server/lib/trpc";
import { getPlan, subscriptionPlans } from "@/server/shared/plans";

export default protectedProcedure.query(async ({ ctx }) => {
  const res = await ctx.prisma.subscription.findFirst({
    where: {
      userId: ctx.user.id,
      status: "active",
    },
    select: {
      planId: true,
    },
  });

  return res ? getPlan(res.planId) : subscriptionPlans().free;
});
