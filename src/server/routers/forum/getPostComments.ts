import { protectedProcedure } from "@/server/lib/trpc";
import { ForumPost } from "@prisma/client";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      id: z.string(),
      cursor: z.number(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const res = await ctx.prisma.forumPost.findMany({
      where: {
        parentPostId: input.id,
      },
      skip: input.cursor,
      take: 10,
      include: {
        author: true,
        comments: {
          include: {
            author: true,
            comments: {
              include: {
                author: true,
                comments: {
                  include: {
                    author: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const ids: string[] = [];
    const recursivePostIds = (posts: ForumPost[]) => {
      posts.map((post) => {
        ids.push(post.id);

        recursivePostIds((post as any).comments ?? []);
      });
    };
    recursivePostIds(res);

    const likes = await ctx.prisma.forumPostLike.findMany({
      where: {
        userId: ctx.user.id,
        postId: {
          in: ids,
        },
      },
    });

    const recursivePostMap = (posts?: ForumPost[]): ForumPost[] => {
      return (
        posts?.map((post) => {
          (post as any).liked = !!likes.find((like) => like.postId === post.id);
          (post as any).comments = recursivePostMap((post as any).comments ?? []);

          return post;
        }) ?? []
      );
    };

    return recursivePostMap(res);
  });
