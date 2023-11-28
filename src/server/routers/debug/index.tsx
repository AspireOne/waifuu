import * as fs from "fs";
import path from "path";
import TestEmailTemplate, { getTestEmailSubject } from "@/emails/templates/TestEmailTemplate";

import { email } from "@/server/lib/email";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/lib/trpc";
import { render } from "@jsx-email/render";

export const generalRouter = createTRPCRouter({
  health: publicProcedure.meta({ openapi: { method: "GET", path: "/health" } }).query(() => {
    return "ok";
  }),

  dbHealth: publicProcedure
    .meta({ openapi: { method: "GET", path: "/db-health" } })
    .query(async ({ input, ctx }) => {
      // Check that prisma db works. Do not use rawQuery.
      const res = await ctx.prisma.user.findMany();
      if (res) {
        return "ok";
      }
    }),

  protectedHealth: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/protected-health" } })
    .query(() => {
      return "ok";
    }),

  sendTestEmail: protectedProcedure.mutation(async ({ input, ctx }) => {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("This endpoint is only available in development mode.");
    }

    await email.send({
      from: email.from.test,
      to: [ctx.user.email],
      subject: getTestEmailSubject(),
      template: TestEmailTemplate({
        content:
          "Batman is dead. I am writing this in the hope of\nO-\n\nNewline. In the hope of-\n\nGotta go, bye!\n\n yor Waifuu",
      }),
    });
  }),

  getEmailTemplates: publicProcedure.query(async () => {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("This endpoint is only available in development mode.");
    }

    const TEMPLATES_DIR_PATH = "src/emails/templates";
    // There are *.tsx files in src/emails, that are used like this: <EmailTemplate name="welcome" />.
    // Get all of the templates in that folder to an array.

    // Dynamically get the path to the src/emails folder.
    // Note: the current directory (__dirname) is: C:\Users\matej\WebstormProjects\companion\.next\server\pages\api\trpc
    const dir = __dirname.substring(0, __dirname.lastIndexOf(".next"));
    const emailTemplatesDir = path.join(dir, TEMPLATES_DIR_PATH);

    // Get a list of names of the files.
    const files = await fs.promises.readdir(emailTemplatesDir);
    const templates = [];
    for (const file of files) {
      const filePath = path.join(emailTemplatesDir, file);
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile() && path.extname(file) === ".tsx") {
        templates.push(file.substring(0, file.lastIndexOf(".")));
      }
    }

    // One by one import them and render them to string.
    return await Promise.all(
      templates.map(async (filename) => {
        // The path must be hardcoded as a string, otherwise webpack will not be able to find it.
        const component = await require(`@/emails/templates/${filename}.tsx`);
        const Component = component.default;
        const html = await render(<Component />);
        return { name: `${filename}.tsx`, html: html };
      }),
    );
  }),
});
