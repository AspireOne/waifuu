import { protectedProcedure } from "@/server/lib/trpc";
import { Bot, Chat, Message, PrismaClient, User } from "@prisma/client";
// Yes, this does show error. There is no typescript version.
// @ts-ignore

import { TRPCError } from "@/server/lib/TRPCError";
import { z } from "zod";

import { getSystemPrompt } from "@/server/ai/character-chat/prompts";
import { getModel, roleplayLlm } from "@/server/ai/roleplayLlm";
import { langfuse } from "@/server/clients/langfuse";
import { tokensToMessages } from "@/server/helpers/helpers";
import { ensureWithinQuotaOrThrow, incrementQuotaUsage } from "@/server/helpers/quota";
import { t } from "@lingui/macro";
import { LangfuseTraceClient } from "langfuse";

const Input = z.object({
  chatId: z.string(),
  message: z.string(),
});

export default protectedProcedure.input(Input).mutation(async ({ ctx, input }) => {
  await ensureWithinQuotaOrThrow("messagesSent", ctx.prisma, ctx.user.id, ctx.user.planId);

  const chat = await retrieveChatOrThrow(
    input.chatId,
    ctx.prisma,
    tokensToMessages(roleplayLlm.model.params.max_tokens),
  );

  // Push the new message to the msg history so that it is included in the prompt without saving them just yet.
  chat.messages.push(createPlaceholderMessage(input));

  const trace = langfuse.trace({
    name: "llm-reply",
    userId: ctx.user.id,
    input: input.message,
    metadata: { env: process.env.NODE_ENV, user: ctx.user.email },
  });

  const preferredModel = ctx.user.preferredModelId
    ? getModel(ctx.user.preferredModelId)
    : null;

  // If the user has a preferred model but the id does not exist, remove the preferred model.
  if (ctx.user.preferredModelId && !preferredModel) {
    ctx.prisma.user.update({
      where: { id: ctx.user.id },
      data: { preferredModelId: null },
    });
  }

  const output = await genOutput(chat, trace, preferredModel?.model);
  trace.update({
    output: output,
  });

  const msgs = await saveMessages(input, output.text, ctx.prisma);
  // TODO(1): Do it async after request.
  await incrementQuotaUsage("messagesSent", ctx.user.id, ctx.prisma);

  return {
    message: msgs.botMsg,
    userMessage: msgs.userMsg,
  };
});

function createPlaceholderMessage(input: z.infer<typeof Input>): Message {
  return {
    content: input.message,
    chatId: input.chatId,

    // Bogus data (not important):
    role: "USER",
    id: 1,
    remembered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    mood: "HAPPY",
  };
}

async function genOutput(
  chat: Chat & { bot: Bot } & { user: User } & { messages: Message[] },
  trace: LangfuseTraceClient,
  preferredModel?: string | null,
) {
  try {
    return await roleplayLlm.run({
      system_prompt: await getSystemPrompt(chat.mode, chat.bot.persona, chat.bot.name),
      messages: chat.messages,
      trace,
      preferredModel,
    });
  } catch (e) {
    console.error(e);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate a reply.",
      toast: t`Error replying, please try again later`,
      cause: e,
    });
  }
}

async function saveMessages(input: z.infer<typeof Input>, output: string, db: PrismaClient) {
  // Use Prisma's $transaction to ensure operations are executed in order
  const [userMsg, botMsg] = await db.$transaction([
    db.message.create({
      data: {
        chatId: input.chatId,
        content: input.message,
        role: "USER",
      },
    }),
    db.message.create({
      data: {
        chatId: input.chatId,
        content: output,
        mood: "HAPPY",
        role: "BOT",
      },
    }),
  ]);

  return {
    userMsg,
    botMsg,
  };
}

async function retrieveChatOrThrow(chatId: string, db: PrismaClient, numOfMessages: number) {
  const chat = await db.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      bot: true,
      user: true,
      messages: {
        take: numOfMessages,
      },
    },
  });

  if (!chat) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chat not found.",
    });
  }

  return chat;
}
