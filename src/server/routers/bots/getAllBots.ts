/**
 * Returns all public bots.
 * */
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";
import { BotSource, Visibility } from "@prisma/client";

export default publicProcedure
  .input(
    z
      .object({
        sourceFilter: z.nativeEnum(BotSource).nullish(),
        textFilter: z.string().nullish(),
        nsfw: z.boolean().default(false),
        categories: z.array(z.string()).default([]),
        limit: z.number().min(1).nullish(),
        cursor: z.number().nullish(),
      })
      .optional(),
  )
  .query(async ({ input, ctx }) => {
    // TODO: Remake this better
    const query = {
      visibility: Visibility.PUBLIC,
      source: input?.sourceFilter ?? undefined,
      characterNsfw: input?.nsfw ? undefined : false,
      ...(input?.textFilter && {
        OR: [
          {
            name: {
              contains: input?.textFilter ?? undefined,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: input?.textFilter ?? undefined,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const bots = await ctx.prisma.bot.findMany({
      take: input?.limit || undefined,
      skip: !input?.cursor ? 0 : input.cursor,
      where: {
        ...(query as any),
        ...(input?.categories.length !== 0 && {
          category: {
            name: {
              in: input?.categories ?? undefined,
            },
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const count = await ctx.prisma.bot.count({
      where: query as any,
    });

    const nextCursor = count > (input?.limit || 0) + (input?.cursor || 0);

    return {
      bots,
      hasNextPage: nextCursor,
    };
  });
