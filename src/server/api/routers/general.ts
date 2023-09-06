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
    .meta({openapi: {method: 'GET', path: '/hello '}})
    .input(z.object({text: z.string()}))
    .query(({input}) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});