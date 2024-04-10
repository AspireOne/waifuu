import { TRPCError } from "@/server/lib/TRPCError";
import { protectedProcedure } from "@/server/lib/trpc";
import { Bot, Chat, Message, Mood, Place, PrismaClient, User } from "@prisma/client";
import { z } from "zod";

import { getSystemPrompt } from "@/server/ai/character-chat/prompts";
import { mainLlm } from "@/server/ai/mainLlm";
import { langfuse } from "@/server/clients/langfuse";
import { env } from "@/server/env";
import { tokensToMessages } from "@/server/helpers/helpers";
import { ensureWithinQuotaOrThrow, incrementQuotaUsage } from "@/server/helpers/quota";
import { Model, ModelId, getModelById, getModelToUse } from "@/server/lib/models";
import { t } from "@lingui/macro";
import { LangfuseTraceClient } from "langfuse";

const Input = z.object({
  chatId: z.string(),
  message: z.string(),
});

const DetermineMetadata = z.object({
  MOOD: z.nativeEnum(Mood),
  PLACE: z.nativeEnum(Place),
});
type Metadata = z.infer<typeof DetermineMetadata>;

export default protectedProcedure.input(Input).mutation(async ({ ctx, input }) => {
  await ensureWithinQuotaOrThrow("messagesSent", ctx.prisma, ctx.user.id, ctx.user.planId);

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
    ctx.user.preferredModelId as ModelId | null | undefined,
  );

  const output = await genOutput(chat, execution, model);

  execution.end({
    output: output.text,
  });

  // TODO(1): Do it async after request.
  const [newMessages, _, __] = await Promise.all([
    saveMessages(input, output.text, ctx.prisma, await determineMetadata(output.text)),
    incrementQuotaUsage("messagesSent", ctx.user.id, ctx.prisma),
    langfuse.flush(),
  ]);

  return {
    message: newMessages.botMsg,
    userMessage: newMessages.userMsg,
  };
});

async function determineMetadata(outText: string): Promise<Metadata> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": `${"https://waifuu.com"}`,
      "X-Title": `${"Waifuu"}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      max_tokens: 150,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: `You are an expert sentiment classifier. You only return JSON-formatted data based on user-provided schema. At all cost, you must return a JSON in this exact format: {\"MOOD\": 'HAPPY' | 'BLUSHED' | 'SAD' | 'NEUTRAL', \"PLACE\": 'WORK' | 'HOME' | 'PARK'} Here is the sentence to get the info from: ${outText}`,
        },
      ],
    }),
  });

  let metadata: Metadata = {
    MOOD: "NEUTRAL",
    PLACE: "HOME",
  };
  try {
    const content: any = await response.json();
    metadata = JSON.parse(content.choices[0]?.message.content ?? "");
  } catch (_) {}

  console.log(metadata);

  return metadata;
}

function generateRandomId(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
    place: "HOME",
  };
}

/**
 * Just a wrapper around running the llm.
 * */
async function genOutput(
  chat: Chat & { bot: Bot } & { user: User } & { messages: Message[] },
  trace: LangfuseTraceClient,
  model: Model,
) {
  try {
    return await mainLlm.run({
      system_prompt: await getSystemPrompt(
        chat.mode,
        chat.bot.persona,
        chat.bot.name,
        chat.user.addressedAs,
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
  db: PrismaClient,
  metadata: Metadata,
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
        mood: metadata.MOOD,
        place: metadata.PLACE,
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
