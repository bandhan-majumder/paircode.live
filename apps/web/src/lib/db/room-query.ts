"use server";

import { db } from "@paircode/db";
import { room, roomMember } from "@paircode/db/schema/room";
import { user } from "@paircode/db/schema/auth";
import type { RoomInsertType, RoomUpdateType } from "@paircode/db/schema/type";
import { eq, and, desc, isNull, inArray } from "@paircode/db/operation";

export async function createRoom(data: RoomInsertType) {
    try {
        const newRoom = await db
            .insert(room)
            .values(data)
            .returning({
                id: room.id,
            });
        return newRoom[0];
    } catch (error) {
        return null;
    }
}

export async function updateRoom(data: RoomUpdateType, roomId: string) {
    try {
        const newRoom = await db
            .update(room)
            .set(data)
            .where(eq(room.id, roomId))
            .returning({
                id: room.id,
            });
        return newRoom[0];
    } catch (error) {
        console.error("Error updating room:", error);
        return null;
    }
}

export async function getRoomById(roomId: string) {
    try {
        const result = await db
            .select()
            .from(room)
            .where(eq(room.id, roomId))
        return result[0] || null;
    } catch (error) {
        return null;
    }
}

export async function updateShareRoom(roomId: string, member: string, share: boolean = true) {
    try {
        const updatedRoom = await db
            .update(room)
            .set({ isShared: share })
            .where(
                and(
                    eq(room.id, roomId),
                    eq(room.createdBy, member)
                )
            )
            .returning({
                id: room.id,
            });
        return updatedRoom[0];
    } catch (error) {
        return null;
    }
}

export async function getPublicRooms(limit: number = 10, offset: number = 0) {
    try {
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

        const roomIds = rooms.map(r => r.id);

        if (roomIds.length === 0) {
            return { rooms: [], total: 0, hasMore: false };
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

        const membersByRoom = members.reduce((acc, member) => {
            if (!acc[member.roomId]) {
                acc[member.roomId] = [];
            }
            acc[member.roomId].push({
                id: member.id,
                userId: member.userId,
                userName: member.userName,
                userImage: member.userImage,
            });
            return acc;
        }, {} as Record<string, Array<{
            id: string;
            userId: string;
            userName: string | null;
            userImage: string | null;
        }>>);

        const roomsWithMembers = rooms.map(room => ({
            ...room,
            members: membersByRoom[room.id] || [],
        }));

        return {
            rooms: roomsWithMembers,
            hasMore: rooms.length === limit,
        };
    } catch (error) {
        console.error("Error fetching public rooms:", error);
        return { rooms: [], total: 0, hasMore: false };
    }
}