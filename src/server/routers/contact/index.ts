import { rateLimiter } from "@/server/clients/rateLimiter";
import { retrieveIp } from "@/server/helpers/helpers";
import { createTRPCRouter, publicProcedure } from "@/server/lib/trpc";
import contactFormSchema from "@/server/shared/contactFormSchema";
import parse from "parse-duration";

export const contactRouter = createTRPCRouter({
  submitContactForm: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ input, ctx }) => {
      rateLimiter.ensureWithinLimitOrThrow({
        id: "submit-contact-form",
        ip: retrieveIp(ctx.req),
        ipLimits: [
          { maxHits: 2, ms: parse("1min")! },
          { maxHits: 10, ms: parse("1h")! },
          { maxHits: 30, ms: parse("1d")! },
        ],
      });

      const { prisma } = ctx;

      await prisma.contactForm.create({
        data: {
          email: input.email,
          phone: input.phone,
          name: input.name,
          message: input.message,
        },
      });
    }),
});
