import { prisma } from "@/server/clients/db";
import { adminProcedure } from "@/server/lib/trpc";

export default adminProcedure.query(async ({ ctx }) => {
  const requests = await prisma.earlyAccess.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
});
