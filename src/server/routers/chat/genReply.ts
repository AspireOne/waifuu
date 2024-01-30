import { protectedProcedure } from "@/server/lib/trpc";
import { Bot, Chat, Message, PrismaClient, User } from "@prisma/client";
// Yes, this does show error. There is no typescript version.
// @ts-ignore

import { TRPCError } from "@/server/lib/TRPCError";
import { z } from "zod";

import { getSystemPrompt } from "@/server/ai/character-chat/prompts";
import { mainLlm } from "@/server/ai/mainLlm";
import { langfuse } from "@/server/clients/langfuse";
import { tokensToMessages } from "@/server/helpers/helpers";
import {
  ensureWithinQuotaOrThrow,
  incrementQuotaUsage,
} from "@/server/helpers/quota";
import {
  Model,
  ModelId,
  getModelById,
  getModelToUse,
} from "@/server/lib/models";
import { t } from "@lingui/macro";
import { LangfuseTraceClient } from "langfuse";
import { determineMood } from "@/lib/utils";

const Input = z.object({
  chatId: z.string(),
  message: z.string(),
});

export default protectedProcedure
  .input(Input)
  .mutation(async ({ ctx, input }) => {
    await ensureWithinQuotaOrThrow(
      "messagesSent",
      ctx.prisma,
      ctx.user.id,
      ctx.user.planId
    );

    const trace = langfuse.trace({
      name: `chat_${input.chatId}`,
      id: generateRandomId(10),
      userId: ctx.user.id,
      sessionId: input.chatId,
      metadata: { env: process.env.NODE_ENV, user: ctx.user.email },
    });

    const execution = trace.span({
      name: "chat_reply",
      input: input.message,
    });

    const chatRetrievalSpan = execution.span({
      name: "chat_retrieval",
      input: input.chatId,
    });

    const chat = await retrieveChatOrThrow(input.chatId, ctx.prisma);

    chatRetrievalSpan.end({
      output: {
        mode: chat.mode,
        model: getModelToUse(chat.mode, ctx.user.preferredModelId),
      },
    });

    // Push the new message to the msg history so that it is included in the prompt without saving them just yet.
    chat.messages.push(createPlaceholderMessage(input));

    // If the user has a preferred model but the id does not exist, remove the preferred model.
    if (ctx.user.preferredModelId && !getModelById(ctx.user.preferredModelId)) {
      execution.event({
        name: "preferred_model_not_found",
        input: {
          preferredModelId: ctx.user.preferredModelId,
        },
      });

      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { preferredModelId: null },
      });
    }

    const model = getModelToUse(
      chat.mode,
      ctx.user.preferredModelId as ModelId | null | undefined
    );

    const output = await genOutput(chat, execution, model);

    execution.end({
      output: output.text,
    });

    // TODO(1): Do it async after request.
    const [newMessages, _, __] = await Promise.all([
      saveMessages(input, output.text, ctx.prisma),
      incrementQuotaUsage("messagesSent", ctx.user.id, ctx.prisma),
      langfuse.flush(),
    ]);

    return {
      message: newMessages.botMsg,
      userMessage: newMessages.userMsg,
    };
  });

function generateRandomId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function createPlaceholderMessage(input: z.infer<typeof Input>): Message {
  return {
    content: input.message,
    chatId: input.chatId,
    feedback: null,

    // Bogus data (not important):
    role: "USER",
    id: 1,
    remembered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    mood: "HAPPY",
  };
}

/**
 * Just a wrapper around running the llm.
 * */
async function genOutput(
  chat: Chat & { bot: Bot } & { user: User } & { messages: Message[] },
  trace: LangfuseTraceClient,
  model: Model
) {
  try {
    return await mainLlm.run({
      system_prompt: await getSystemPrompt(
        chat.mode,
        chat.bot.persona,
        chat.bot.name,
        chat.user.addressedAs
      ),
      messages: chat.messages,
      trace,
      model,
    });
  } catch (e) {
    console.error(e);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate a reply.",
      toast: t`Failed to reply, please try again later.`,
      cause: e,
    });
  }
}

async function saveMessages(
  input: z.infer<typeof Input>,
  output: string,
  db: PrismaClient
) {
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
        mood: determineMood(output),
        role: "BOT",
      },
    }),
  ]);

  return {
    userMsg,
    botMsg,
  };
}

async function retrieveChatOrThrow(chatId: string, db: PrismaClient) {
  const chat = await db.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      bot: true,
      user: true,
    },
  });

  if (!chat) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chat not found.",
    });
  }

  const usedModel = getModelToUse(chat.mode, chat.user.preferredModelId);
  const messageNumber = tokensToMessages(usedModel.tokens);

  const messages = await db.message.findMany({
    where: {
      chatId: chatId,
    },
    take: messageNumber,
  });

  return { ...chat, messages };
}
