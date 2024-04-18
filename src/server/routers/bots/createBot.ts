import { getInitialMessagePrompt, getSystemPrompt } from "@/server/ai/character-chat/prompts";

import { mainLlm } from "@/server/ai/mainLlm";
import { langfuse } from "@/server/clients/langfuse";
import { ensureWithinQuotaOrThrow, incrementQuotaUsage } from "@/server/helpers/quota";
import { TRPCError } from "@/server/lib/TRPCError";
import { getModelToUse } from "@/server/lib/models";
import { protectedProcedure } from "@/server/lib/trpc";
import { t } from "@lingui/macro";
import {
  Bot,
  BotSource,
  BotVisibility,
  CharacterTag,
  ChatMode,
  ChatRole,
  PrismaClient,
  User,
} from "@prisma/client";
import { LangfuseTraceClient } from "langfuse";
import { z } from "zod";

const botCreationInput = z.object({
  title: z.string().min(1, t`Title is required`).max(50, t`Title is too long`),
  description: z.string().max(700, t`Description is too long`),
  visibility: z.nativeEnum(BotVisibility),
  tags: z.array(z.nativeEnum(CharacterTag)).default([]),

  cover: z.string().optional(),
  avatar: z.string().min(1, t`Avatar is required`),
  backgroundImage: z.string().optional(),
  name: z.string().min(1, t`Name is required`).max(50, t`Name is too long`),
  persona: z.string().max(500, t`Persona is too long`),
  dialogue: z.string().nullish(),
  nsfw: z.boolean(),

  // Mood images
  moodImagesEnabled: z.boolean().default(false),
  sadImageId: z.string().optional(),
  neutralImageId: z.string().optional(),
  blushedImageId: z.string().optional(),
  happyImageId: z.string().optional(),

  // Dynamic backgrounds
  dynamicBackgroundsEnabled: z.boolean().default(false),
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

      // Dynamic backgrounds.
      dynamicBackgroundsEnabled: input.dynamicBackgroundsEnabled,

      // Other.
      tags: input.tags,
    },
  });

  // Create initial messages.
  const trace = langfuse.trace({
    name: "initial-message-generation",
    userId: ctx.user.id,
    metadata: { env: process.env.NODE_ENV, user: ctx.user.email },
  });

  await Promise.all([
    createInitialMessage(ChatMode.ROLEPLAY, bot, ctx.user, ctx.prisma, trace),
    createInitialMessage(ChatMode.CHAT, bot, ctx.user, ctx.prisma, trace),
    createInitialMessage(ChatMode.ADVENTURE, bot, ctx.user, ctx.prisma, trace),
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
    },
  });

  if (duplicate) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This character already exists.",
    });
  }
}

async function createInitialMessage(
  mode: ChatMode,
  bot: Bot,
  user: User,
  db: PrismaClient,
  trace: LangfuseTraceClient,
) {
  const systemPrompt = await getSystemPrompt(
    mode,
    bot.persona,
    bot.name,
    user.addressedAs,
    null,
  );
  const initialMessagePrompt = getInitialMessagePrompt(mode, user.botContext);
  console.debug({ systemPrompt, initialMessagePrompt });

  const output = await mainLlm.run({
    system_prompt: systemPrompt,
    messages: [
      {
        role: ChatRole.USER,
        content: initialMessagePrompt,
      },
    ],
    trace,
    model: getModelToUse(mode),
  });

  if (mode === ChatMode.ADVENTURE) {
    // if the output does not start or end with *, add it. And if the output starts or ends with {{}}, remove it.
    if (!output.text.startsWith("*")) {
      output.text = `*${output.text}`;
    }
    if (!output.text.endsWith("*")) {
      output.text = `${output.text}*`;
    }
    if (output.text.startsWith("{{")) {
      output.text = output.text.slice(2);
    }
    if (output.text.endsWith("}}")) {
      output.text = output.text.slice(0, -2);
    }
  }

  return await db.initialMessage.create({
    data: {
      message: output.text,
      chatMode: mode,
      botId: bot.id,
    },
  });
}
