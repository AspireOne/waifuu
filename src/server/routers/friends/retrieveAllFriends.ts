import { protectedProcedure } from "@/server/lib/trpc";

export default protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.user.id;

  // Retrieve all friends of the authenticated user
  const friends = await ctx.prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      friendships: {
        select: {
          friend: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true,
              bio: true,
            },
          },
        },
      },
    },
  });

  if (!friends) {
    return [];
  }

  // Extract the friend objects from the friendships array
  const friendList = friends.friendships.map((friendship) => friendship.friend);

  return friendList;
});
