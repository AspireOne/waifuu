import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z, ZodSchema } from "zod";
import { TRPCError } from "@trpc/server";

export const updateSelfSchema: ZodSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Required." })
    .max(16, { message: "Too long." }),
  name: z
    .string()
    .min(3, { message: "Required." })
    .max(80, { message: "Too long." })
    .nullable(),
  email: z
    .string()
    .email({ message: "Invalid." })
    .max(100, { message: "Too long." }),
  bio: z.string().max(500, { message: "Too long." }).nullable(),
  addressedAs: z.string().max(50, { message: "Too long." }).nullable(),
  about: z.string().max(500, { message: "Too long." }).nullable(),
});

export const usersRouter = createTRPCRouter({
  getSelf: publicProcedure
    .input(
      z.object({
        includeBots: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) return null;

      return await ctx.prisma.user.findUnique({
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
        image: user.image,
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
      const usernameInvalid =
        input.username !== ctx.user.username &&
        (await ctx.prisma.user.findUnique({
          where: {
            username: input.username,
          },
        }));

      if (usernameInvalid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already exists.",
        });
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          username: input.username,
          name: input.name,
          bio: input.bio,
          image: input.image,
          about: input.about,
          addressedAs: input.addressedAs,
        },
      });
    }),
});
