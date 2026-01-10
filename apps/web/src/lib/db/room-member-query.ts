"use server";

import { db } from "@paircode/db";
import { roomMember } from "@paircode/db/schema/room";
import type { RoomMemberInsertType } from "@paircode/db/schema/type";
import { eq, and, isNull, desc } from "@paircode/db/operation";

export async function updateRoomMembers(roomId: string, userId: string) {
    try {
        const mostRecentMember = await db
            .select({
                id: roomMember.id,
            })
            .from(roomMember)
            .where(
                and(
                    eq(roomMember.roomId, roomId),
                    eq(roomMember.userId, userId)
                )
            )
            .orderBy(desc(roomMember.joinedAt))
            .limit(1);

        if (!mostRecentMember.length || !mostRecentMember[0].id) {
            return null;
        }

        const roomMembers = await db
            .update(roomMember)
            .set({
                leftAt: new Date(),
            })
            .where(
                eq(roomMember.id, mostRecentMember[0].id)
            )
            .returning({
                roomId: roomMember.roomId,
            });

        return roomMembers[0];
    } catch (error) {
        console.error("Error updating room member:", error);
        return null;
    }
}

export async function insertRoomMembers(data: RoomMemberInsertType) {
    try {
        const roomMembers = await db
            .insert(roomMember)
            .values(data)
            .returning({
                id: roomMember.id,
                roomId: roomMember.roomId,
                userId: roomMember.userId,
            });
        return roomMembers;
    } catch (error) {
        console.error("Error inserting room member:", error);
        return null;
    }
}

export async function getJoinedUsers(roomId: string) {
    try {
        const isRoomFull = await db.select({
            userId: roomMember.userId,
        })
            .from(roomMember)
            .where(
                and(
                    eq(roomMember.roomId, roomId),
                    isNull(roomMember.leftAt) // for joined users, this will be null
                )
            )
        return isRoomFull;
    } catch (error) {
        console.error("Error querying room:", error);
        return null;
    }
}