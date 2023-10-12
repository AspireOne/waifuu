import { ForumPost } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const forumRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        category: z.string(),
        bannerImage: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let categoryName = "";

      const category = await ctx.prisma.forumPostCategory.findFirst({
        where: {
          name: input.category,
        },
      });

      if (!category) {
        const newCategory = await ctx.prisma.forumPostCategory.create({
          data: {
            name: input.category,
          },
        });

        categoryName = newCategory.name;
      } else {
        categoryName = category.name;
      }

      return await ctx.prisma.forumPost.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.user.id,
          categoryname: categoryName,
          bannerImage: input.bannerImage,
        },
      });
    }),

  getPostComments: protectedProcedure
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
              comments: true,
            },
          },
        },
      });

      let ids: string[] = [];
      const recursivePostIds = (posts: ForumPost[]) => {
        posts.map((post) => {
          ids.push(post.id);

          recursivePostIds((post as any).comments);
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

      const recursivePostMap = (posts: ForumPost[]): ForumPost[] => {
        return posts.map((post) => {
          // TODO: Fix later, little bit of typescript will be needed here
          (post as any).liked = !!likes.find((like) => like.postId === post.id);
          (post as any).comments = recursivePostMap((post as any).comments);

          return post;
        });
      };

      return recursivePostMap(res);
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const res = await ctx.prisma.forumPost.update({
        where: {
          id: input.id,
          parentPostId: null,
        },
        data: {
          viewCount: {
            increment: 1,
          },
        },
        include: {
          author: true,
          category: true
        },
      });

      const like = await ctx.prisma.forumPostLike.findFirst({
        where: {
          postId: input.id,
          userId: ctx.user.id,
        },
      });

      return {
        ...res,
        liked: !!like,
      };
    }),

  like: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const like = await ctx.prisma.forumPostLike.findFirst({
        where: {
          postId: input.id,
          userId: ctx.user.id,
        },
      });

      if (!like) {
        await ctx.prisma.forumPostLike.create({
          data: {
            postId: input.id,
            userId: ctx.user.id,
          },
        });

        return await ctx.prisma.forumPost.update({
          where: {
            id: input.id,
          },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });
      }
    }),

  dislike: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const like = await ctx.prisma.forumPostLike.findFirst({
        where: {
          postId: input.id,
          userId: ctx.user.id,
        },
      });

      if (like) {
        await ctx.prisma.forumPostLike.delete({
          where: {
            id: like.id,
          },
        });

        return await ctx.prisma.forumPost.update({
          where: {
            id: input.id,
          },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });
      }
    }),

  comment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        parentPostId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.prisma.forumPost.create({
        data: {
          content: input.content,
          authorId: ctx.user.id,
          parentPostId: input.parentPostId,
        },
      });

      return res;
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.forumPost.findMany({
        where: {
          parentPostId: null,
        },
        skip: input.skip,
        take: input.take,
        include: {
          author: true,
        },
      });
    }),
});
