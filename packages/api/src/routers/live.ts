import { db } from "@paircode/db";
import { room, roomMember } from "@paircode/db/schema/room";
import { user } from "@paircode/db/schema/auth";
import { eq, and, desc, isNull, inArray } from "@paircode/db/operation";
import { z } from "zod";

import { router, publicProcedure } from "../index";

const getPublicRoomsSchema = z.object({
  limit: z.number().min(1).max(50).default(10),
  offset: z.number().min(0).default(0),
});

export const liveRouter = router({
  getPublicRooms: publicProcedure
    .input(getPublicRoomsSchema)
    .query(async ({ input }) => {
      const { limit, offset } = input;

      const rooms = await db
        .select({
          id: room.id,
          topic: room.topic,
          banner: room.banner,
          isShared: room.isShared,
          isFull: room.isFull,
          createdBy: room.createdBy,
          creatorName: user.name,
          creatorImage: user.image,
          createdAt: room.createdAt,
        })
        .from(room)
        .leftJoin(user, eq(room.createdBy, user.id))
        .where(eq(room.isShared, true))
        .orderBy(desc(room.createdAt))
        .limit(limit)
        .offset(offset);

      const roomIds = rooms.map((r) => r.id);

      if (roomIds.length === 0) {
        return { rooms: [], hasMore: false };
      }

      const members = await db
        .select({
          id: roomMember.id,
          roomId: roomMember.roomId,
          userId: roomMember.userId,
          userName: user.name,
          userImage: user.image,
          joinedAt: roomMember.joinedAt,
        })
        .from(roomMember)
        .leftJoin(user, eq(roomMember.userId, user.id))
        .where(
          and(
            isNull(roomMember.leftAt),
            inArray(roomMember.roomId, roomIds)
          )
        );

      const membersByRoom = members.reduce(
        (acc, member) => {
          if (!acc[member.roomId]) {
            acc[member.roomId] = [];
          }
          acc[member.roomId]!.push({
            id: member.id,
            userId: member.userId,
            userName: member.userName,
            userImage: member.userImage,
          });
          return acc;
        },
        {} as Record<
          string,
          Array<{
            id: string;
            userId: string;
            userName: string | null;
            userImage: string | null;
          }>
        >
      );

      const roomsWithMembers = rooms.map((room) => ({
        ...room,
        members: membersByRoom[room.id] || [],
      }));

      return {
        rooms: roomsWithMembers,
        hasMore: rooms.length === limit,
      };
    }),
});
