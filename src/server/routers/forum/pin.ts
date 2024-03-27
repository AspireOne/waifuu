import { adminProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default adminProcedure
  .input(z.string())
  .mutation(async ({ ctx: { prisma }, input }) => {
    const post = await prisma.forumPost.findFirst({
      where: {
        id: input,
      },
    });

    if (!post) throw new Error("Post with this ID does not exist!");

    return await prisma.forumPost.update({
      where: {
        id: input,
      },
      data: {
        pinned: !post.pinned,
      },
    });
  });
