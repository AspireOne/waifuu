import { protectedProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      username: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { username } = input;

    const friend = await ctx.prisma.user.findFirst({
      where: {
        username: {
          endsWith: username,
          mode: "insensitive",
        },
      },
    });

    if (!friend) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }

    // Check if the friendship exists
    const friendship = await ctx.prisma.friendship.findUnique({
      where: {
        userId_friendId: {
          userId: ctx.user.id,
          friendId: friend.id,
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
          userId: ctx.user.id,
          friendId: friend.id,
        },
      },
    });

    return {
      success: true,
      message: "Friend removed successfully.",
    };
  });
