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
        !input?.userId || input.userId === ctx.session.user.id
          ? undefined
          : Visibility.PUBLIC;

      return await ctx.prisma.bot.findMany({
        take: input?.limit || undefined,
        where: {
          creatorId: input?.userId ?? ctx.session.user.id,
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
          creatorId: ctx.session.user.id,
          source: BotSource.COMMUNITY,
          img: input.avatar,
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
        botId: z.string(),
        botMode: z.nativeEnum(BotMode),
        limit: z.number().min(1).max(100).default(15),
        cursor: z.number().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const messages = await ctx.prisma.botChatMessage.findMany({
        // Take one more item that we will use as the cursor.
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { id: "desc" },
        where: {
          botId: input.botId,
          botMode: input.botMode,
          userId: ctx.session.user.id,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      // If there is more messages (signalised by the limit + 1), pop the last item and use it as the next cursor.

      if (messages.length > input.limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem!.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  genReply: protectedProcedure
    .input(
      z.object({
        botId: z.string(),
        botMode: z.nativeEnum(BotMode),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userMsg = await ctx.prisma.botChatMessage.create({
        data: {
          userId: ctx.session.user.id,
          botId: input.botId,
          botMode: input.botMode,
          content: input.message,
          role: "USER", // TODO: Do not hardcode.
        },
      });

      // TODO: Messages will have to implement some indexing, metadata, context... For long term memory.
      const messages = await ctx.prisma.botChatMessage.findMany({
        where: {
          botId: input.botId,
          userId: ctx.session.user.id,
          botMode: input.botMode,
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

      // save the output to db.
      const botMsg = await ctx.prisma.botChatMessage.create({
        data: {
          userId: ctx.session.user.id,
          botId: input.botId,
          botMode: input.botMode,
          content: outputStr,
          role: "BOT", // TODO: Do not hardcode.
        },
      });

      return {
        botChatMessage: botMsg,
        userMessage: userMsg,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  /**
   * Search for tags
   */
  searchTagCounts: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const botsWithItems = await prisma.tag.findMany({
        where: {
          name: {
            contains: input,
            mode: "insensitive",
          },
        },
        select: {
          bots: {
            select: {
              id: true,
            },
          },
        }
      });

      const botsWithItemCount = botsWithItems.map((bot) => ({
        ...bot,
        itemCount: bot.bots.length
      }));

      return botsWithItemCount;
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
