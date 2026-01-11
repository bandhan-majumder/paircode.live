"use server";

import { db } from "@paircode/db";
import type { FeedBackIntertType } from "@paircode/db/schema/type";
import { feedback } from "@paircode/db/schema/feedback";

export async function createFeedBack(data: FeedBackIntertType) {
    try {
        const result = await db
            .insert(feedback)
            .values(data)
            .returning({
                id: feedback.id,
                name: feedback.name,
                email: feedback.email,
                category: feedback.category,
                content: feedback.content,
                createdAt: feedback.createdAt
            });
        return result[0];
    } catch (error) {
        console.error("Error creating feedback:", error);
        return null;
    }
}