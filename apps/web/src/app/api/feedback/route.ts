import { sendEmail } from "@/lib/nodemailer";
import { feedBackFormSchema } from "@/app/api/feedback/feedback.type";
import { NextResponse } from "next/server";
import { applyRateLimit } from "./ratelimiter";
import { createFeedBack } from "@/lib/db/query";

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

        const emailText = `${name} (${email}) submitted the following feedback in the category "${category}":\n\n${message}`;
        const emailSubject = `CodePair Feedback from ${name} - ${category}`;

        await Promise.all([
            sendEmail({ senderName: name, body: emailText, subject: emailSubject }),
            createFeedBack({
                name,
                email,
                category,
                content: message
            })
        ])

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