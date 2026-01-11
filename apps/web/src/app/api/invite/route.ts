import { sendEmail } from "@/lib/nodemailer";
import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/utils/rate-limiter";
import { inviteFriendSchema } from "@/app/api/invite/invite-friend.type";
import { createInvite } from "@/lib/db";
import { auth } from "@paircode/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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

        const emailText = `${senderName} - (${senderEmail}) has invited you to join a pair coding session. Click the link below to join:\n\nhttps://paircode.live/room/${roomId}`;
        const emailSubject = `PairCode Join Request from ${senderName}`;

        await Promise.all([
            sendEmail({ senderName, receiverEmail, subject: emailSubject, body: emailText }),
            createInvite({
                senderName,
                senderEmail,
                receiverEmail,
                roomId
            })
        ])

        return NextResponse.json(
            { message: "Invite sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing invite:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}