import { publicProcedure } from "@/server/lib/trpc";
import { BotSource, BotVisibility, CharacterTag, Prisma } from "@prisma/client";
import { z } from "zod";
import QueryMode = Prisma.QueryMode;

/**
 * Returns all public bots.
 * */
export default publicProcedure
  .input(
    z
      .object({
        sourceFilter: z.nativeEnum(BotSource).nullish(),
        textFilter: z.string().nullish(),
        nsfw: z.boolean().default(false),
        tags: z.array(z.nativeEnum(CharacterTag)).default([]),
        limit: z.number().min(1).nullish(),
        cursor: z.number().nullish(),
      })
      .optional(),
  )

  .query(async ({ input, ctx }) => {
    const textFilter = input?.textFilter;


    console.log(input);

    const queryWhere = {
      visibility: BotVisibility.PUBLIC,
      source: input?.sourceFilter ?? undefined,
      nsfw: input?.nsfw ? undefined : false,

      // Text search.
      // biome-ignore format:
      OR: !textFilter ? undefined : [
        { title: { contains: textFilter, mode: QueryMode.insensitive } },
        { description: { contains: textFilter, mode: QueryMode.insensitive } },
        { name: { contains: textFilter, mode: QueryMode.insensitive } },
      ],
      /*title: { search: textFilter },
      description: { search: textFilter },
      name: { search: textFilter },*/

      tags: {
        hasSome: input?.tags ?? undefined,
      }
    };

    const query = ctx.prisma.bot.findMany({
      take: input?.limit || undefined,
      skip: !input?.cursor ? 0 : input.cursor,
      where: queryWhere,
      orderBy: {
        createdAt: "desc",
      },
    });

    const [bots, count] = await Promise.all([
      query,
      ctx.prisma.bot.count({
        where: queryWhere,
      }),
    ]);

    const nextCursor = count > (input?.limit || 0) + (input?.cursor || 0);

    return {
      bots,
      hasNextPage: nextCursor,
    };
  });
