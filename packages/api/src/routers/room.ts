import { db } from "@paircode/db";
import { room } from "@paircode/db/schema/room";
import type { RoomInsertType } from "@paircode/db/schema/type";
import { eq, and } from "@paircode/db/operation";
import jwt from "jsonwebtoken";
import { env } from "@paircode/env/web";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure, rateLimitedProtectedProcedure } from "../index";

const createRoomSchema = z.object({
  topic: z.string().min(1),
  banner: z.string().optional(),
});

const updateRoomSchema = z.object({
  roomId: z.string().uuid(),
});

const getRoomSchema = z.object({
  roomId: z.string().uuid(),
});

const getSocketTokenSchema = z.object({
  roomId: z.string().uuid(),
});

export const roomRouter = router({
  create: rateLimitedProtectedProcedure({ windowMs: 1 * 60 * 1000, max: 10 })
    .input(createRoomSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      
      const newRoom = await db
        .insert(room)
        .values({
          topic: input.topic,
          banner: input.banner,
          createdBy: userId,
        } as RoomInsertType)
        .returning({
          id: room.id,
        });

      if (!newRoom[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create room",
        });
      }

      return { newRoom: newRoom[0] };
    }),

  updateShare: protectedProcedure
    .input(updateRoomSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      
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

      if (existingRoom[0].createdBy !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the room creator can share the room",
        });
      }

      const updatedRoom = await db
        .update(room)
        .set({ isShared: true })
        .where(
          and(
            eq(room.id, input.roomId),
            eq(room.createdBy, userId)
          )
        )
        .returning({
          id: room.id,
        });

      if (!updatedRoom[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to share room",
        });
      }

      return { updatedRoom: updatedRoom[0] };
    }),

  getById: publicProcedure
    .input(getRoomSchema)
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(room)
        .where(eq(room.id, input.roomId));

      if (!result[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }

      return result[0];
    }),

  getSocketToken: protectedProcedure
    .input(getSocketTokenSchema)
    .mutation(async ({ input, ctx }) => {
      const token = jwt.sign(
        {
          email: ctx.session.user.email,
          roomId: input.roomId,
        },
        env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return { token };
    }),
});
