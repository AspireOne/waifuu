import { prisma } from "@/server/clients/db";
import { protectedProcedure } from "@/server/lib/trpc";

export default protectedProcedure.query(async ({ ctx }) => {
  const match = await prisma.adminEmail.findUnique({ where: { email: ctx.user.email } });
  return !!match;
});
