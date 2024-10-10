import { website } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const websiteRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        primaryColor: z.string().min(1),
        template: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(website).values({
        title: input.title,
        primaryColor: input.primaryColor,
        template: input.template,
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const websites = await ctx.db.select().from(website);
    return websites;
  }),
  delete: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(website).where(eq(website.id, +input.id));
    }),
  // KUMARA: Odje cemo pokrenuti deploy process
  deploy: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Step 1: Set status to 'deploying' immediately
      await ctx.db
        .update(website)
        .set({ status: "deploying" })
        .where(eq(website.id, +input.id));

      // Return the website with updated status
      const deployingWebsite = await ctx.db
        .select()
        .from(website)
        .where(eq(website.id, +input.id))
        .limit(1);

      // Step 2: After 5 seconds, update the status to 'deployed'
      setTimeout(async () => {
        await ctx.db
          .update(website)
          .set({ status: "deployed", url: "https://www.google.com" }) // TODO: odje moramo da zamijenimo deployment url
          .where(eq(website.id, +input.id));
      }, 5000);

      return deployingWebsite[0]; // Return the updated website with 'deploying' status
    }),
});
