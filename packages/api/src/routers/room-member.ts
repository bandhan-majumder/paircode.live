import { db } from "@paircode/db";
import { room, roomMember } from "@paircode/db/schema/room";
import { eq, and, isNull, desc } from "@paircode/db/operation";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure } from "../index";

const joinRoomSchema = z.object({
  roomId: z.string().uuid(),
});

const leaveRoomSchema = z.object({
  roomId: z.string().uuid(),
});

export const roomMemberRouter = router({
  join: protectedProcedure
    .input(joinRoomSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Check if room exists
      const existingRoom = await db
        .select()
        .from(room)
        .where(eq(room.id, input.roomId));

      if (!existingRoom[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }

      // Check if room is full
      const joinedUsers = await db
        .select({
          userId: roomMember.userId,
        })
        .from(roomMember)
        .where(
          and(
            eq(roomMember.roomId, input.roomId),
            isNull(roomMember.leftAt)
          )
        );

      if (joinedUsers?.length === 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Room is full",
        });
      }

      // Add member to room
      const roomMembers = await db
        .insert(roomMember)
        .values({
          roomId: input.roomId,
          userId: userId,
        })
        .returning({
          id: roomMember.id,
          roomId: roomMember.roomId,
          userId: roomMember.userId,
        });

      if (!roomMembers[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to join room",
        });
      }

      // If room now has 2 members, mark as full
      if (joinedUsers && joinedUsers.length === 1) {
        await db
          .update(room)
          .set({ isFull: true })
          .where(eq(room.id, input.roomId));
      }

      return {
        roomMember: roomMembers[0],
        action: "joined",
      };
    }),

  leave: protectedProcedure
    .input(leaveRoomSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Check if room exists
      const existingRoom = await db
        .select()
        .from(room)
        .where(eq(room.id, input.roomId));

      if (!existingRoom[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }

      // Find the most recent member entry
      const mostRecentMember = await db
        .select({
          id: roomMember.id,
        })
        .from(roomMember)
        .where(
          and(
            eq(roomMember.roomId, input.roomId),
            eq(roomMember.userId, userId),
            isNull(roomMember.leftAt)
          )
        )
        .orderBy(desc(roomMember.joinedAt))
        .limit(1);

      if (!mostRecentMember.length || !mostRecentMember[0]!.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are not a member of this room",
        });
      }

      // Update member with leftAt timestamp
      const updatedMember = await db
        .update(roomMember)
        .set({
          leftAt: new Date(),
        })
        .where(eq(roomMember.id, mostRecentMember[0]!.id))
        .returning({
          roomId: roomMember.roomId,
        });

      if (!updatedMember[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to leave room",
        });
      }

      // Mark room as not full
      await db
        .update(room)
        .set({ isFull: false })
        .where(eq(room.id, input.roomId));

      return {
        message: "Room member left successfully",
        action: "left",
      };
    }),
});
