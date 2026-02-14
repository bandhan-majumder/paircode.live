import { protectedProcedure, publicProcedure, router } from "../index";
import { feedbackRouter } from "./feedback";
import { roomRouter } from "./room";
import { roomMemberRouter } from "./room-member";
import { inviteRouter } from "./invite";
import { liveRouter } from "./live";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  feedback: feedbackRouter,
  room: roomRouter,
  roomMember: roomMemberRouter,
  invite: inviteRouter,
  live: liveRouter,
});
export type AppRouter = typeof appRouter;
