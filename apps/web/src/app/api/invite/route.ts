import { sendEmail } from "@/lib/nodemailer";
import { NextResponse } from "next/server";
import { applyRateLimit } from "./ratelimiter";
import { inviteFriendSchema } from "@/app/api/invite/invite-friend.type";

export async function POST(req: Request) {
    try {
        const rateLimitResponse = await applyRateLimit(req);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const body = await req.json();

        const parsedData = inviteFriendSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json(
                { error: "Invalid form data", details: parsedData.error },
                { status: 400 }
            );
        }

        const { senderEmail, senderName, receiverEmail, roomId } = parsedData.data;

        if (!senderEmail || !senderName || !receiverEmail || !roomId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const emailText = `${senderName} - (${senderEmail}) has invited you to join a coding session. Click the link below to join:\n\nhttps://paircode.live/room/${roomId}`;
        const emailSubject = `CodePair Join Request from ${senderName}`;

        await sendEmail({ senderName, receiverEmail, subject: emailSubject, body: emailText });

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