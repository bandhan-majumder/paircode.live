"use server";

import { getRoomById } from "@/lib/db";
import { auth } from "@paircode/auth";
import { headers } from "next/headers";

export async function getRoomData(roomId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const room = await getRoomById(roomId);

    if (!room) {
        return { error: "Room not found" };
    }

    return {
        room,
        isCreator: room.createdBy === session.user.id
    };
}
