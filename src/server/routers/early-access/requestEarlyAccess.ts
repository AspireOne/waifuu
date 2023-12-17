import { rateLimiter } from "@/server/clients/rateLimiter";
import { retrieveIp } from "@/server/helpers/helpers";
import { publicProcedure } from "@/server/lib/trpc";
import { requestEarlyAccessFormValues } from "@/server/shared/requestEarlyAccessFormValuesSchema";
import parse from "parse-duration";

export default publicProcedure
  .input(requestEarlyAccessFormValues)
  .mutation(async ({ ctx, input }) => {
    rateLimiter.ensureWithinLimitOrThrow({
      id: "request-early-access",
      ip: retrieveIp(ctx.req),
      ipLimits: [{ maxHits: 20, ms: parse("12h")! }],
    });

    const { prisma } = ctx;

    if (await prisma.earlyAccess.findFirst({ where: { email: input.email } })) {
      return {
        alreadyPresent: true,
      };
    }

    const ip = retrieveIp(ctx.req);
    const age = typeof input.age === "string" ? parseInt(input.age) || undefined : input.age;

    await prisma.earlyAccess.create({
      data: {
        email: input.email,
        name: input.name,
        age: age,
        hearAboutUs: input.hearAboutUs,
        ip: ip,
      },
    });

    return {
      alreadyPresent: false,
    };
  });
