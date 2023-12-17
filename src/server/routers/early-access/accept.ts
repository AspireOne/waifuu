import EarlyAccessAcceptTemplate, {
  getEarlyAccessSubject,
} from "@/emails/templates/EarlyAccessAcceptTemplate";
import { prisma } from "@/server/clients/db";
import { email } from "@/server/lib/email";
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

    await email.send({
      from: email.from.info,
      to: [input.email],
      template: EarlyAccessAcceptTemplate({ email: input.email }),
      subject: getEarlyAccessSubject(),
    });
  });
