import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const matterRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({input: {content}, ctx}) => {
      const matter = await ctx.prisma.matter.create({data: {userId: ctx.session.user.id}});

    return matter;
}),
}); 
