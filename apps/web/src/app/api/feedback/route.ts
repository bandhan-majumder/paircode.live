import { sendEmail } from "@/lib/nodemailer";
import { feedBackFormSchema } from "@/types/feedback.type";
import { NextResponse } from "next/server";
import { applyRateLimit } from "./ratelimiter";

export async function POST(req: Request) {
    try {
        const rateLimitResponse = await applyRateLimit(req);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const body = await req.json();

        const parsedData = feedBackFormSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json(
                { error: "Invalid form data", details: parsedData.error },
                { status: 400 }
            );
        }

        const { name, email, category, message } = parsedData.data;

        if (!name || !email || !category || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await sendEmail({ name, email, category, message });

        return NextResponse.json(
            { message: "Feedback received" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing feedback:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}