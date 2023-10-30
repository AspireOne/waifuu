import { protectedProcedure } from "@/server/lib/trpc";
import updateSelfSchema from "@/server/shared/updateSelfSchema";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(updateSelfSchema)
  .mutation(async ({ input, ctx }) => {
    if (input.username && input.username !== ctx.user.username) {
      const usernameInvalid = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (usernameInvalid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already exists.",
        });
      }
    }

    await ctx.prisma.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        username: input.username,
        name: input.name,
        bio: input.bio,
        about: input.about,
        addressedAs: input.addressedAs,
      },
    });
  });
