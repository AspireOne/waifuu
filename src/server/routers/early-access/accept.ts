import { prisma } from "@/server/clients/db";
import { adminProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default adminProcedure
  .input(
    z.object({
      email: z.string().email(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await prisma.earlyAccess.update({
      where: {
        email: input.email,
      },
      data: {
        granted: true,
      },
    });

    // TODO: Send email.
  });
