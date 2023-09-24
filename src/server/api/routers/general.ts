import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Replicate from "replicate";
import pusherServer from "~/server/lib/pusherServer";
import { env } from "~/server/env";

const replicate = new Replicate({
  auth: env().REPLICATE_API_TOKEN,
});

export const generalRouter = createTRPCRouter({
  health: publicProcedure
    .meta({ openapi: { method: "GET", path: "/health" } })
    .query(() => {
      return "ok";
    }),

  protectedHealth: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/protected-health" } })
    .query(() => {
      return "ok";
    }),

  hello: publicProcedure
    .meta({ openapi: { method: "GET", path: "/hello" } })
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  triggerChatMatch: protectedProcedure.mutation(async () => {
    await pusherServer.trigger(`lobby`, "room_matched", {
      roomId: "123",
      topic: "test test",
    });
  }),
});
