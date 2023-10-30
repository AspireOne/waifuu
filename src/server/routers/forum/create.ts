import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      title: z.string(),
      content: z.string(),
      category: z.string(),
      bannerImage: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    let categoryName = "";

    const category = await ctx.prisma.category.findFirst({
      where: {
        name: input.category,
      },
    });

    if (!category) {
      const newCategory = await ctx.prisma.category.create({
        data: {
          name: input.category,
        },
      });

      categoryName = newCategory.name;
    } else {
      categoryName = category.name;
    }

    return await ctx.prisma.forumPost.create({
      data: {
        title: input.title,
        content: input.content,
        authorId: ctx.user.id,
        categoryname: categoryName,
        bannerImage: input.bannerImage,
      },
    });
  });
