import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default publicProcedure
  .input(
    z.object({
      includeBots: z.boolean().optional().default(false),
    }),
  )
  .query(async ({ ctx, input }) => {
    if (!ctx.user?.id) return null;

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user?.id,
      },
      include: {
        ...(input.includeBots && {
          Bot: {
            where: {
              visibility: "PUBLIC",
            },
          },
        }),
      },
    });

    if (user && !user.image) {
      user.image =
        "https://user-images.githubusercontent.com/57546404/275817598-fd2c2c4b-108a-4ea3-a451-614d79afd405.jpg";
    }

    const adminEmail = ctx.prisma.adminEmail.findFirst({
      where: {
        email: user?.email,
      },
    });

    return {
      ...user,
      isAdmin: !!adminEmail,
    };
  });
