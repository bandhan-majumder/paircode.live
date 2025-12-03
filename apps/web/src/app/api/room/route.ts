import { createRoom, updateShareSession } from "@/lib/db/query";
import { type RoomType } from "@paircode/db/schema"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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