import { prisma } from "@/server/clients/db";
import { protectedProcedure } from "@/server/lib/trpc";

export default protectedProcedure.query(async () => {
  const posts = await prisma.forumPost.findMany({
    where: {
      pinned: true,
    },
  });

  return posts;
});
