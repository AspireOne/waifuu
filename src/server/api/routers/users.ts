import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z, ZodSchema } from "zod";
import { TRPCError } from "@trpc/server";
import updateSelfSchema from "~/server/types/updateSelfSchema";

export const usersRouter = createTRPCRouter({
  getSelf: publicProcedure
    .input(
      z.object({
        includeBots: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) return null;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
        include: {
          ...(input.includeBots && {
            Bot: {
              where: {
                visibility: "PUBLIC",
              },
            },
          }),
        },
      });

      if (user && !user.image) {
        user.image =
          "https://user-images.githubusercontent.com/57546404/275817598-fd2c2c4b-108a-4ea3-a451-614d79afd405.jpg";
      }
      return user;
    }),

  getPublic: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          Bot: {
            where: {
              visibility: "PUBLIC",
            },
          },
        },
      });

      if (!user) return null;

      // Hand-pick the returned properties, so we don't leak sensitive information.
      return {
        id: user.id,
        name: user.name,
        image:
          user.image ??
          "https://user-images.githubusercontent.com/57546404/275817598-fd2c2c4b-108a-4ea3-a451-614d79afd405.jpg",
        bots: user.Bot,
        username: user.username,
        bio: user.bio,
      };
    }),

  checkUsernameAvailability: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const exists = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      return !exists;
    }),

  updateSelf: protectedProcedure
    .input(updateSelfSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.username && input.username !== ctx.user.username) {
        const usernameInvalid = await ctx.prisma.user.findUnique({
          where: {
            username: input.username,
          },
        });

        if (usernameInvalid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already exists.",
          });
        }
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          username: input.username,
          name: input.name,
          bio: input.bio,
          about: input.about,
          addressedAs: input.addressedAs,
        },
      });
    }),
});
