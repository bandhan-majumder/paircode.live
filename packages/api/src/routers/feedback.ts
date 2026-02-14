import { db } from "@paircode/db";
import { feedback } from "@paircode/db/schema/feedback";
import z from "zod";
import { TRPCError } from "@trpc/server";

import { router, rateLimitedPublicProcedure } from "../index";

const FeedBackSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  category: z.string().min(1),
  content: z.string().min(1),
});

export const feedbackRouter = router({
  create: rateLimitedPublicProcedure({ windowMs: 1 * 60 * 1000, max: 5 })
    .input(FeedBackSchema)
    .mutation(async ({ input }) => {
      try {
        await db.insert(feedback).values({
          name: input.name,
          email: input.email,
          category: input.category,
          content: input.content,
        });
        return { success: true };
      } catch (error) {
        console.error("Error creating feedback:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit feedback",
        });
      }
    }),
});
