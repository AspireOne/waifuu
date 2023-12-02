import pusherServer from "@/server/clients/pusherServer";
import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(z.object({ channel: z.string(), message: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await pusherServer.trigger(input.channel, "message", {
      message: input.message,
      from: ctx.user.id,
    });
  });
