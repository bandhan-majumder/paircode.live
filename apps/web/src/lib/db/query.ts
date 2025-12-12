"use server";

import { db } from "@paircode/db";
import { room } from "@paircode/db/schema/room";
import type { FeedBackIntertType, InviteInsertType, RoomInsertType } from "@paircode/db/schema/type";
import { eq, and } from "@paircode/db/operation";
import { feedback } from "@paircode/db/schema/feedback";
import { invite } from "@paircode/db/schema/invite";

export async function createRoom(data: RoomInsertType) {
    // it will handle all the cases of topic, createdBy being undefined or null
    try {
        const newRoom = await db
            .insert(room)
            .values(data)
            .returning({
                id: room.id,
            });
        return newRoom[0];
    } catch (error) {
        console.error("Error creating room:", error);
        return null;
    }
}

export async function updateShareSession(roomId: string, member: string) {
    // it will handle the case of member being not the creator of the room or insufficient data
    try {
        const updatedRoom = await db
            .update(room)
            .set({ isShared: true })
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
        console.error("Error sharing room:", error);
        return null;
    }
}

export async function createFeedBack(data: FeedBackIntertType) {
    try {
        await db
            .insert(feedback)
            .values(data)
    } catch (error) {
        console.error("Error creating feedback:", error);
        return null;
    }
}

export async function createInvite(data: InviteInsertType) {
    try {
        await db
            .insert(invite)
            .values(data)
    } catch (error) {
        console.error("Error creating invite:", error);
        return null;
    }
}