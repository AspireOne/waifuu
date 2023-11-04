/**
 * Returns all public bots.
 * */
import { publicProcedure } from "@/server/lib/trpc";
import { BotSource, Visibility } from "@prisma/client";
import { z } from "zod";

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
    // This should be remade better ig...
    const queryWhere = {
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

    const query = ctx.prisma.bot.findMany({
      take: input?.limit || undefined,
      skip: !input?.cursor ? 0 : input.cursor,
      where: {
        ...(queryWhere as any),
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

    const [bots, count] = await Promise.all([
      query,
      ctx.prisma.bot.count({
        where: queryWhere as any,
      }),
    ]);

    const nextCursor = count > (input?.limit || 0) + (input?.cursor || 0);

    return {
      bots,
      hasNextPage: nextCursor,
    };
  });
