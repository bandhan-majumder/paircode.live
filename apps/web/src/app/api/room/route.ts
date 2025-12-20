import { createRoom, updateShareSession } from "@/lib/db/query";
import { NextResponse } from "next/server";
import { applyRateLimit } from "./ratelimiter";
import { auth } from "@paircode/auth";
import { cookies, headers } from "next/headers";

export async function POST(req: Request) {
    console.log("all the cookies are: ", (await cookies()).getAll())
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

    if (!body || !body.topic || !body.createdBy) {
        return NextResponse.json({ message: 'Invalid room data' }, { status: 400 });
    }

    const newRoom = await createRoom(body);

    if (!newRoom) {
        return NextResponse.json({ message: 'Failed to create room' }, { status: 500 });
    }

    return NextResponse.json({ newRoom });
}

export async function PUT(req: Request) {
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

    if (!body || !body.roomId || !body.member) {
        return NextResponse.json({ message: 'Insufficient room update data' }, { status: 400 });
    }

    const newRoom = await updateShareSession(body.roomId, body.member);

    if (!newRoom) {
        return NextResponse.json({ message: 'Failed to create room' }, { status: 500 });
    }

    return NextResponse.json({ newRoom });
}