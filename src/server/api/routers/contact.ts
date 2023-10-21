import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import contactFormSchema from "@/server/types/contactFormSchema";

export const contactRouter = createTRPCRouter({
  submitContactForm: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ input, ctx }) => {
      console.log("contact form submitted", input);
      throw new Error("Contact form not implemented");
    }),
});
