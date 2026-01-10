"use server";

import { db } from "@paircode/db";
import { room } from "@paircode/db/schema/room";
import type { RoomInsertType, RoomUpdateType } from "@paircode/db/schema/type";
import { eq, and } from "@paircode/db/operation";

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
        console.error("Error creating room:", error);
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