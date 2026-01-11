"use server";

import { db } from "@paircode/db";
import type { InviteInsertType } from "@paircode/db/schema/type";
import { invite } from "@paircode/db/schema/invite";

export async function createInvite(data: InviteInsertType) {
    try {
        const result = await db
            .insert(invite)
            .values(data)
            .returning({
                id: invite.id,
                senderName: invite.senderName,
                senderEmail: invite.senderEmail,
                receiverEmail: invite.receiverEmail,
                roomId: invite.roomId,
                createdAt: invite.createdAt
            });
        return result[0];
    } catch (error) {
        console.error("Error creating invite:", error);
        return null;
    }
}