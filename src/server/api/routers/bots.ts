import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { BotChatRole, BotMode, Mood, Prisma } from "@prisma/client";
import { BotSource, Visibility } from "@prisma/client";
import { getCharacterSystemPrompt } from "@/server/ai/character-chat/getCharacterSystemPrompt";
import { getInitialMessagePrompt } from "@/server/ai/character-chat/prompts";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";
import { llama13b } from "@/server/ai/shared/models/llama13b";
import { fixingLlm } from "@/server/ai/shared/models/outputFixingLLM";

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
          nsfw: z.boolean().default(false),
          limit: z.number().min(1).nullish(),
          cursor: z.number().nullish(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      // TODO: Remake this better
      const query = {
        visibility: Visibility.PUBLIC,
        source: input?.sourceFilter ?? undefined,
        characterNsfw: input?.nsfw ? undefined : false,
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
      };

      const bots = await ctx.prisma.bot.findMany({
        take: input?.limit || undefined,
        skip: !input?.cursor ? 0 : input.cursor,
        where: query as any,
        orderBy: {
          createdAt: "desc",
        },
      });

      const count = await ctx.prisma.bot.count({
        where: query as any,
      });

      const hasNextPage = count > (input?.limit || 0) + (input?.cursor || 0);

      return {
        bots,
        hasNextPage,
      };
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
        userContext: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.botChat.create({
        data: {
          botId: input.botId,
          botMode: input.botMode,
          userId: ctx.user.id,
          userContext: input.userContext,
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

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found.",
        });
      }

      const output = await llama13b.run({
        system_prompt: await getCharacterSystemPrompt(chat),
        prompt: getInitialMessagePrompt,
      });

      const botMsg = await ctx.prisma.botChatMessage.create({
        data: {
          chatId: input.chatId,
          content: output,
          mood: "HAPPY",
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
  getAllUsedBots: protectedProcedure
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

  getPopularTags: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ input, ctx }) => {
      const tags = await ctx.prisma.tag.findMany({
        take: input.limit,
        orderBy: {
          bots: {
            _count: "desc",
          },
        },
      });

      return tags;
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
        category: z.string().optional(),

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

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found.",
        });
      }

      /*const outputParser = StructuredOutputParser.fromZodSchema(
        z.object({
          reply: z.string().min(1).describe("The reply to the user."),
          mood: z.nativeEnum(Mood).describe("The sentiment of the reply."),
        }),
      );*/
      /*const outputFixingParser = OutputFixingParser.fromLLM(
        fixingLlm,
        outputParser,
      );*/

      console.log(
        "CREATED SYSTEM PROMPT: ",
        await getCharacterSystemPrompt(chat),
      );

      let output;
      try {
        output = await llama13b.run({
          system_prompt: await getCharacterSystemPrompt(
            chat,
            /*outputParser,*/
          ),
          prompt: messages,
        });
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

      const botMsg = await ctx.prisma.botChatMessage.create({
        data: {
          chatId: input.chatId,
          content: output,
          mood: "HAPPY",
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
