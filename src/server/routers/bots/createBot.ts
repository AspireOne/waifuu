import { protectedProcedure } from "@/server/lib/trpc";
import { BotSource, Prisma, Visibility } from "@prisma/client";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      // Public image (meaning on discover page ex.)
      cover: z.string().optional(),
      title: z.string(),
      description: z.string(),
      visibility: z.nativeEnum(Visibility),
      tags: z.array(z.string()).default([]),
      category: z.string().optional(),

      // in Chat data
      avatar: z.string().optional(),
      backgroundImage: z.string().optional(),
      name: z.string(),
      persona: z.string(),
      dialogue: z.string(),
      nsfw: z.boolean(),

      // Mood images
      moodImagesEnabled: z.boolean().default(false),
      sadImageId: z.string().optional(),
      neutralImageId: z.string().optional(),
      blushedImageId: z.string().optional(),
      happyImageId: z.string().optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    if (input.category) {
      try {
        await ctx.prisma.category.create({
          data: {
            name: input.category,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // Throw all errors except for duplicate category name.
          if (e.code !== "P2002") {
            throw e;
          }
        }
      }
    }

    return await ctx.prisma.bot.create({
      data: {
        name: input.title,
        description: input.description,
        visibility: input.visibility,
        creatorId: ctx.user.id,
        source: BotSource.COMMUNITY,
        avatar: input.avatar,
        cover: input.cover,
        characterPersona: input.persona,
        backgroundImage: input.backgroundImage,
        categoryId: input.category,
        characterDialogue: input.dialogue,
        characterNsfw: input.nsfw,
        characterName: input.name,
        moodImagesEnabled: input.moodImagesEnabled,
        sadImageId: input.sadImageId,
        neutralImageId: input.neutralImageId,
        blushedImageId: input.blushedImageId,
        happyImageId: input.happyImageId,
        tags: {
          connectOrCreate: input.tags.map((tag) => {
            return {
              where: {
                name: tag,
              },
              create: {
                name: tag,
              },
            };
          }),
        },
      },
    });
  });
