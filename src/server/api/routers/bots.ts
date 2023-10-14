import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Replicate from "replicate";
import { env } from "~/server/env";
import { TRPCError } from "@trpc/server";
import { BotMode, Mood } from "@prisma/client";
import { BotSource, Visibility } from "@prisma/client";
import { prompts } from "~/utils/prompt";

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

  getInitialMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.prisma.botChat.findFirst({
        where: {
          id: input.chatId,
        },
        include: {
          bot: true,
          user: true,
        },
      });

      let output;
      try {
        const response = (await replicate.run(
          "a16z-infra/llama-2-13b-chat:9dff94b1bed5af738655d4a7cbcdcde2bd503aa85c94334fe1f42af7f3dd5ee3",
          {
            input: {
              system_prompt:
                `Your responses must be short.\n` +
                `${prompts.intro(
                  chat?.bot.characterName!,
                  chat?.bot.characterPersona!,
                  chat?.bot.characterDialogue!,
                )}\n` +
                `${prompts.nsfw(chat?.bot.characterNsfw!)}\n` +
                `${prompts.user(chat?.user.about!, chat?.user.addressedAs!)}\n`,
              prompt: prompts.initialMessage(),
            },
          },
        )) as string[];

        output = response;
      } catch (e) {
        console.log(e);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate a reply.",
          cause: e,
        });
      }

      const outputStr = (output as unknown as []).join("");

      const botMsg = await ctx.prisma.botChatMessage.create({
        data: {
          chatId: input.chatId,
          content: outputStr,
          // @ts-ignore make this from the message in future
          mood: Math.random() > 0.5 ? Mood.BLUSHED : Mood.HAPPY,
          role: "BOT",
        },
      });

      return {
        botChatMessage: botMsg,
      };
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

  getBotByChatId: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const chat = await ctx.prisma.botChat.findUnique({
        where: {
          id: input.chatId,
        },
        include: {
          bot: true,
        },
      });

      return chat?.bot;
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

        // Mood images
        moodImagesEnabled: z.boolean().default(false),
        sadImageId: z.string().optional(),
        neutralImageId: z.string().optional(),
        blushedImageId: z.string().optional(),
        happyImageId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
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
      const messages = await ctx.prisma.botChatMessage.findMany({
        take: input.limit,
        where: {
          chatId: input.chatId,
          id: input.cursor
            ? {
                lt: input.cursor,
              }
            : undefined,
        },
        orderBy: {
          id: "desc",
        },
      });

      const nextCursor =
        messages.length > 0 ? messages[messages.length - 1]?.id : undefined;

      return {
        messages: messages.reverse(),
        nextCursor,
      };
    }),

  genReply: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create a new message from the input user provided
      const userMsg = await ctx.prisma.botChatMessage.create({
        data: {
          chatId: input.chatId,
          content: input.message,
          role: "USER",
          // Status: pending?
        },
      });

      const [chat, messages] = await Promise.all([
        // Find the chat that is user and bot currently in.
        ctx.prisma.botChat.findUnique({
          where: {
            id: input.chatId,
          },
          include: {
            bot: true,
            user: true,
          },
        }),
        // And lastly, find the last 20 messages in the chat.
        ctx.prisma.botChatMessage.findMany({
          where: {
            chatId: input.chatId,
          },
          take: 20,
        }),
      ]);

      const _messages = messages.map((message) => {
        return { user: message.role === "USER", content: message.content };
      });

      const processedMessages = processMessages(_messages);

      let output;
      try {
        const response = (await replicate.run(
          "a16z-infra/llama-2-13b-chat:9dff94b1bed5af738655d4a7cbcdcde2bd503aa85c94334fe1f42af7f3dd5ee3",
          {
            input: {
              system_prompt:
                "Your responses must be short." +
                `${prompts.intro(
                  chat?.bot.characterName!,
                  chat?.bot.characterPersona!,
                  chat?.bot.characterDialogue!,
                )}\n` +
                `${prompts.nsfw(chat?.bot.characterNsfw!)}\n` +
                `${prompts.user(chat?.user.about!, chat?.user.addressedAs!)}\n`,
              prompt: processedMessages,
            },
          },
        )) as string[];

        output = response;
      } catch (e) {
        console.log(e);

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

      const outputStr = (output as unknown as []).join("");
      const mood = outputStr.split(" ").pop() as Mood | undefined;

      const botMsg = await ctx.prisma.botChatMessage.create({
        data: {
          chatId: input.chatId,
          content: outputStr,
          mood: Math.random() > 0.5 ? Mood.BLUSHED : Mood.HAPPY,
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
