import {
  getInitialMessageSystemPrompt,
  initialMessagePrompt,
} from "@/server/ai/character-chat/prompts";
import { llama13b } from "@/server/ai/models/llama13b";
import { ensureWithinQuotaOrThrow, incrementQuotaUsage } from "@/server/helpers/quota";
import { TRPCError } from "@/server/lib/TRPCError";
import { protectedProcedure } from "@/server/lib/trpc";
import { t } from "@lingui/macro";
import {
  Bot,
  BotSource,
  BotVisibility,
  CharacterTag,
  ChatMode,
  PrismaClient,
} from "@prisma/client";
import { z } from "zod";

const botCreationInput = z.object({
  // Public image (meaning on discover page ex.)
  cover: z.string().optional(),
  title: z.string(),
  description: z.string(),
  visibility: z.nativeEnum(BotVisibility),
  tags: z.array(z.nativeEnum(CharacterTag)).default([]),

  // in Chat data
  avatar: z.string().min(1, t`Avatar is required`),
  backgroundImage: z.string().optional(),
  name: z.string(),
  persona: z.string(),
  dialogue: z.string().nullish(),
  nsfw: z.boolean(),

  // Mood images
  moodImagesEnabled: z.boolean().default(false),
  sadImageId: z.string().optional(),
  neutralImageId: z.string().optional(),
  blushedImageId: z.string().optional(),
  happyImageId: z.string().optional(),
});

export default protectedProcedure.input(botCreationInput).mutation(async ({ input, ctx }) => {
  await ensureNotDuplicateOrThrow(input, ctx.prisma);
  await ensureWithinQuotaOrThrow("botsCreated", ctx.prisma, ctx.user.id, ctx.user.planId);

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
      tags: input.tags,
    },
  });

  // Create initial messages.
  await Promise.all([
    createInitialMessage(ChatMode.ROLEPLAY, bot, ctx.prisma),
    createInitialMessage(ChatMode.CHAT, bot, ctx.prisma),
    createInitialMessage(ChatMode.ADVENTURE, bot, ctx.prisma),
  ]);

  // TODO(1): Do it async after request.
  await incrementQuotaUsage("botsCreated", ctx.user.id, ctx.prisma);

  return bot;
});

async function ensureNotDuplicateOrThrow(
  input: z.infer<typeof botCreationInput>,
  prisma: PrismaClient,
) {
  const duplicate = await prisma.bot.findFirst({
    where: {
      name: input.name,
      description: input.description,
      title: input.title,
      persona: input.persona,
      nsfw: input.nsfw,
      avatar: input.avatar,
      exampleDialogue: input.dialogue,
      // Not checking for images because I am
      // not sure whether they are an ID or binary or what.
      // Anyways this might be enough.
    },
  });

  if (duplicate) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This character already exists.",
    });
  }
}

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
