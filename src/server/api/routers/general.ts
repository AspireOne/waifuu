import {z} from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Replicate from "replicate";
import {env} from "~/server/env";

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

export const generalRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({text: z.string()}))
    .query(({input}) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getChatbots: publicProcedure
    .query(async ({input, ctx}) => {
      return await ctx.prisma.chatbot.findMany();
    }),

  genAiResponse: publicProcedure
    .input(
      z.array(
        z.object({
          isUser: z.boolean().optional(),
          text: z.string()
        })
      ))
    .output(z.string())
    .mutation(async ({ctx, input}) => {
      const output = await replicate.run(
        "a16z-infra/llama-2-13b-chat:9dff94b1bed5af738655d4a7cbcdcde2bd503aa85c94334fe1f42af7f3dd5ee3",
        {
          input: {
            "system_prompt": "You are Aqua. Aqua is a character with an interesting and troublesome personality. She is cheerful, and carefree, but often fails to consider the consequences of her actions. Aqua acts on her whims and can behave inappropriately in various situations. She seeks praise and worship as a goddess, often performing good deeds but then ruining them by aggressively seeking recognition. While she is honest and incapable of lying, she is gullible and easily deceived by others. Aqua has a limited business sense and lacks self-awareness, but she can be observant and knowledgeable when she wants to be. She is tolerant and forgiving of others' imperfections. Despite her vanity, she is unaware of her own impressive abilities.\n" +
              "\n" +
              "Your responses must be short.",
            "prompt": formatPrompt(input),
          }
        }
      )
      return (output as []).join("");
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

const formatPrompt = (messages: {isUser?: boolean, text: string}[]) => {
  return messages
    .map((message) =>
      message.isUser
        ? `[INST] ${message.text} [/INST]`
        : `${message.text}`
    )
    .join("\n");
};
