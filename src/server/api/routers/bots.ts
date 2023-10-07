import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Replicate from "replicate";
import { env } from "~/server/env";
import { TRPCError } from "@trpc/server";
import { Prisma, Tag } from "@prisma/client";
import { BotMode } from "@prisma/client";
import { BotSource, Visibility } from "@prisma/client";
import { prisma } from "~/server/lib/db";

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

export const botsRouter = createTRPCRouter({
  /**
   * Returns all public bots.
   * */
  getAllBots: publicProcedure
    .input(
      z
        .object({
          sourceFilter: z.nativeEnum(BotSource).nullish(),
          textFilter: z.string().nullish(),
          limit: z.number().min(1).nullish(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.bot.findMany({
        take: input?.limit || undefined,
        where: {
          visibility: Visibility.PUBLIC,
          source: input?.sourceFilter ?? undefined,
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
        },
      });
    }),

  getBot: publicProcedure
    .input(
      z.object({
        botId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.bot.findUnique({
        where: {
          id: input.botId,
        },
      });
    }),

  createBotChat: protectedProcedure
    .input(
      z.object({
        botId: z.string(),
        botMode: z.nativeEnum(BotMode),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.botChat.create({
        data: {
          botId: input.botId,
          botMode: input.botMode,
          userId: ctx.user.id,
        },
      });
    }),

  /**
   * Return all bots that user has currently conversation with.
   */
  getAllConversationBots: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const chats = await ctx.prisma.botChat.findMany({
        take: input?.limit || undefined,
        where: {
          userId: ctx.user.id,
        },
        include: {
          bot: true,
        },
      });

      return chats.map((chat) => {
        return {
          chatId: chat.id,
          chatType: chat.botMode,
          ...chat.bot,
        };
      });
    }),

  /**
   * Returns all bots that the user has access to (public and private for the user making the request, public for bots
   * of other users).
   * */
  getUserBots: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).nullish(),
          userId: z.string().nullish(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const visibility =
        !input?.userId || input.userId === ctx.user.id
          ? undefined
          : Visibility.PUBLIC;

      return await ctx.prisma.bot.findMany({
        take: input?.limit || undefined,
        where: {
          creatorId: input?.userId ?? ctx.user.id,
          visibility: visibility,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        // Public image (meaning on discover page ex.)
        cover: z.string().optional(),
        title: z.string(),
        description: z.string(),
        visibility: z.nativeEnum(Visibility),
        tags: z.array(z.string()).default([]),

        // in Chat data
        avatar: z.string().optional(),
        name: z.string(),
        persona: z.string(),
        dialogue: z.string(),
        nsfw: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.bot.create({
        data: {
          name: input.name,
          description: input.description,
          visibility: input.visibility,
          creatorId: ctx.user.id,
          source: BotSource.COMMUNITY,
          avatar: input.avatar,
          cover: input.cover,
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
    }),

  /**
   * Retrieves messages with a bot.
   */
  messages: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        limit: z.number().min(1).max(100).default(15),
        cursor: z.number().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Message fetching
    }),

  genReply: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userMsg = await ctx.prisma.botChatMessage.create({
        data: {
          chatId: input.chatId,
          content: input.message,
          role: "USER",
        },
      });

      const messages = await ctx.prisma.botChatMessage.findMany({
        where: {
          chatId: input.chatId,
        },
        take: 20, // TODO: Take more, this is just for test
      });

      // todo: pass the messages as a whole (i cannot get the prisma type on the other side).
      const _messages = messages.map((message) => {
        return { user: message.role === "USER", content: message.content };
      });

      const processedMessages = processMessages(_messages);

      let output;
      try {
        await delay(1000);
        output = ["[Mock Output From a bot]"]; /*await replicate.run(
        "a16z-infra/llama-2-13b-chat:9dff94b1bed5af738655d4a7cbcdcde2bd503aa85c94334fe1f42af7f3dd5ee3",
        {
          input: {
            "system_prompt": "You are Aqua. Aqua is a character with an interesting and troublesome personality. She is cheerful, and carefree, but often fails to consider the consequences of her actions. Aqua acts on her whims and can behave inappropriately in various situations. She seeks praise and worship as a goddess, often performing good deeds but then ruining them by aggressively seeking recognition. While she is honest and incapable of lying, she is gullible and easily deceived by others. Aqua has a limited business sense and lacks self-awareness, but she can be observant and knowledgeable when she wants to be. She is tolerant and forgiving of others' imperfections. Despite her vanity, she is unaware of her own impressive abilities.\n" +
              "\n" +
              "Your responses must be short.",
            "prompt": processedMessages,
          }
        }
      )*/
      } catch (e) {
        // remove the user message from db.
        await ctx.prisma.botChatMessage.delete({
          where: {
            id: userMsg.id,
          },
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate a reply.",
          cause: e,
        });
      }

      const outputStr = (output as []).join("");

      const botMsg = await ctx.prisma.botChatMessage.create({
        data: {
          chatId: input.chatId,
          content: outputStr,
          role: "BOT",
        },
      });

      return {
        botChatMessage: botMsg,
        userMessage: userMsg,
      };
    }),
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Processes the messages to put it as a prompt for a bot.
 * */
const processMessages = (
  messages: {
    user: boolean;
    content: string;
  }[],
) => {
  // In the future, the prompt will have to be altered to account for the following:
  // 1. ! The messages will have to be somehow truncated to fit into context window.
  // 2. Account for loss of context between messages (vector db / embeddings / extrahování důležitých věcí a dosazení do promptu jako kontext).
  // 3. Account for loss of system message context / loss of character (reminding every x messages?)
  // 4. Account for images.
  return messages
    .map((message) =>
      message.user ? `[INST] ${message.content} [/INST]` : `${message.content}`,
    )
    .join("\n");
};
