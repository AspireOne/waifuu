import { publicProcedure } from "@/server/lib/trpc";
import { requestEarlyAccessFormValues } from "@/server/shared/requestEarlyAccessFormValuesSchema";
import { NextApiRequest } from "next";

function retrieveIp(req?: NextApiRequest | null) {
  let ip = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress;
  if (Array.isArray(ip)) {
    if (ip.length > 0) ip = ip[0];
    else ip = undefined;
  }
  if (!ip) ip = undefined;
  return ip;
}

export default publicProcedure
  .input(requestEarlyAccessFormValues)
  .mutation(async ({ ctx, input }) => {
    // TODO: Rate limiting for IP.
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
