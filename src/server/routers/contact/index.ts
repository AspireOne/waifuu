import { createTRPCRouter, publicProcedure } from "@/server/lib/trpc";
import contactFormSchema from "@/server/shared/contactFormSchema";

export const contactRouter = createTRPCRouter({
  submitContactForm: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ input, ctx }) => {
      throw new Error("Contact form not implemented");
    }),
});
