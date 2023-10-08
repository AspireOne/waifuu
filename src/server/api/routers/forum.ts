import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const forumRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.forumPost.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.user.id,
        },
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.forumPost.update({
        where: {
          id: input.id,
        },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    }),

  like: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.forumPost.update({
        where: {
          id: input.id,
        },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });
    }),

  dislike: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
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
    }),

  comment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        parentPostId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.forumPost.create({
        data: {
          content: input.content,
          authorId: ctx.user.id,
          parentPostId: input.parentPostId,
        },
      });
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
        skip: input.skip,
        take: input.take,
      });
    }),
});
