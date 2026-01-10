"use server";

import { db } from "@paircode/db";
import type { FeedBackIntertType } from "@paircode/db/schema/type";
import { feedback } from "@paircode/db/schema/feedback";

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