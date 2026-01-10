import { createRoom, updateShareRoom, getRoomById } from "@/lib/db";
import { NextResponse } from "next/server";
import { applyRateLimit } from "./ratelimiter";
import { auth } from "@paircode/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
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

    if (!body || !body.topic) {
        return NextResponse.json({ message: 'Invalid room data' }, { status: 400 });
    }

    body.createdBy = session.user.id;

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
    const body = await req.json();

    if (!body || !body.roomId || !body.member) {
        return NextResponse.json({ message: 'Insufficient room update data' }, { status: 400 });
    }

    const room = await getRoomById(body.roomId);
    
    if (!room) {
        return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    if (room.createdBy !== session.user.id) {
        return NextResponse.json({ error: 'Only the room creator can share the room' }, { status: 403 });
    }

    // room, member, share = true by default
    const updatedRoom = await updateShareRoom(body.roomId, session.user.id);

    if (!updatedRoom) {
        return NextResponse.json({ message: 'Failed to share room' }, { status: 500 });
    }

    return NextResponse.json({ updatedRoom });
}