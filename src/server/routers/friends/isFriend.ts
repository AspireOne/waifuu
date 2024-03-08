import { protectedProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      userUsername: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { userUsername } = input;
    const currentUserId = ctx.user.id;

    const friend = await ctx.prisma.user.findFirst({
      where: {
        username: {
          endsWith: userUsername,
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

    // Check if the given user is a friend of the authenticated user
    const friendship = await ctx.prisma.friendship.findUnique({
      where: {
        userId_friendId: {
          userId: currentUserId,
          friendId: friend.id,
        },
      },
    });

    const isFriend = !!friendship;

    return {
      isFriend,
    };
  });
