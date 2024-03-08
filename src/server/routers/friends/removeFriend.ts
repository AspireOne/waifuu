import { protectedProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      friendId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { friendId } = input;
    const userId = ctx.user.id;

    // Check if the friendship exists
    const friendship = await ctx.prisma.friendship.findUnique({
      where: {
        userId_friendId: {
          userId,
          friendId,
        },
      },
    });

    if (!friendship) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Friendship not found.",
      });
    }

    // Remove the friendship
    await ctx.prisma.friendship.delete({
      where: {
        userId_friendId: {
          userId,
          friendId,
        },
      },
    });

    return {
      success: true,
      message: "Friend removed successfully.",
    };
  });
