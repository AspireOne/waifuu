import { getModel } from "@/server/ai/roleplayLlm";
import { TRPCError } from "@/server/lib/TRPCError";
import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

const Input = z.object({
  model: z.string(),
});

export default protectedProcedure.input(Input).mutation(async ({ ctx, input }) => {
  const model = getModel(input.model);

  if (!model) {
    throw new TRPCError({
      toast: "Unknown model",
      code: "BAD_REQUEST",
      toastType: "error",
      message: `Tried to set unknown model ${model}.`,
    });
  }

  ctx.prisma.user.update({
    where: {
      id: ctx.user.id,
    },
    data: {
      preferredModelId: model.model,
    },
  });
});
