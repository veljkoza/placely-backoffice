import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const websiteRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.website.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),
});
