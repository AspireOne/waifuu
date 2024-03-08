import { protectedProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      friendUsername: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { friendUsername } = input;
    const userId = ctx.user.id;

    // Check if the friend exists
    const friend = await ctx.prisma.user.findFirst({
      where: {
        username: {
          endsWith: friendUsername,
          mode: "insensitive",
        },
      },
    });

    if (!friend) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Friend not found.",
      });
    }

    // Check if the friendship already exists
    const existingFriendship = await ctx.prisma.friendship.findUnique({
      where: {
        userId_friendId: {
          userId,
          friendId: friend.id,
        },
      },
    });

    if (existingFriendship) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Friendship already exists.",
      });
    }

    // Create the friendship
    await ctx.prisma.friendship.create({
      data: {
        userId,
        friendId: friend.id,
      },
    });

    return {
      success: true,
      message: "Friend added successfully.",
    };
  });
