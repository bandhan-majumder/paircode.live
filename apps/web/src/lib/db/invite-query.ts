"use server";

import { db } from "@paircode/db";
import type { InviteInsertType } from "@paircode/db/schema/type";
import { invite } from "@paircode/db/schema/invite";

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