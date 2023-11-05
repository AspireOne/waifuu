import {
  getInitialMessageSystemPrompt,
  initialMessagePrompt,
} from "@/server/ai/character-chat/prompts";
import { llama13b } from "@/server/ai/models/llama13b";
import { protectedProcedure } from "@/server/lib/trpc";
import { Bot, BotSource, BotVisibility, ChatMode, Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      // Public image (meaning on discover page ex.)
      cover: z.string().optional(),
      title: z.string(),
      description: z.string(),
      visibility: z.nativeEnum(BotVisibility),
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

    const bot = await ctx.prisma.bot.create({
      data: {
        // Public info.
        title: input.title,
        description: input.description,

        // Character info.
        name: input.name,
        persona: input.persona,
        nsfw: input.nsfw,
        visibility: input.visibility,
        exampleDialogue: input.dialogue,

        // Creator.
        creatorId: ctx.user.id,
        source: BotSource.COMMUNITY,

        // Character images.
        avatar: input.avatar,
        characterImage: input.cover,
        backgroundImage: input.backgroundImage,

        // Mood.
        moodImagesEnabled: input.moodImagesEnabled,
        sadImageId: input.sadImageId,
        neutralImageId: input.neutralImageId,
        blushedImageId: input.blushedImageId,
        happyImageId: input.happyImageId,

        // Other.
        categoryId: input.category,
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

    // Create initial messages.
    await Promise.all([
      createInitialMessage(ChatMode.ROLEPLAY, bot, ctx.prisma),
      createInitialMessage(ChatMode.CHAT, bot, ctx.prisma),
      createInitialMessage(ChatMode.ADVENTURE, bot, ctx.prisma),
    ]);

    return bot;
  });

async function createInitialMessage(mode: ChatMode, bot: Bot, db: PrismaClient) {
  const output = await llama13b.run({
    system_prompt: await getInitialMessageSystemPrompt(mode, bot.persona),
    prompt: initialMessagePrompt,
  });

  return await db.initialMessage.create({
    data: {
      message: output,
      chatMode: mode,
      botId: bot.id,
    },
  });
}
