import { insertRoomMembers, getJoinedUsers, updateRoom, updateRoomMembers, getRoomById } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@paircode/auth";
import { headers } from "next/headers";

// insert new members to room
export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.roomId) {
        return NextResponse.json({ error: 'roomId is required' }, { status: 400 });
    };

    const room = await getRoomById(body.roomId);
    if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // check if room is full
    const joinedUsers = await getJoinedUsers(body.roomId);
    
    // check if room is full
    if (joinedUsers?.length && joinedUsers.length === 2) {
        return NextResponse.json({ error: 'Room is full' }, { status: 400 });
    };

    const roomMember = await insertRoomMembers({
        roomId: body.roomId,
        userId: session.user.id
    });

    if (!roomMember) {
        return NextResponse.json({ error: 'Failed to add room member' }, { status: 500 });
    }

    // previous the room has 1 member, now 2nd user added, update room as full
    if (joinedUsers && joinedUsers.length === 1) {
        const updateRoomAsFull = await updateRoom({
            isFull: true
        }, body.roomId);

        if (updateRoomAsFull === null) {
            return NextResponse.json({ error: 'Failed to update room as full' }, { status: 500 });
        };
    }

    return NextResponse.json({
        roomMember,
        action: 'joined'
    });
}

// update room member as they leave
export async function PUT(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.roomId) {
        return NextResponse.json({ error: 'roomId is required' }, { status: 400 });
    };

    // Check if room exists
    const room = await getRoomById(body.roomId);
    if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // roomId, userId
    const updatedMember = await updateRoomMembers(body.roomId, session.user.id);

    if (!updatedMember) {
        return NextResponse.json({ error: 'Failed to update room member' }, { status: 500 });
    }

    // Update room as not full when someone leaves
    await updateRoom({
        isFull: false
    }, body.roomId);

    return NextResponse.json({
        message: 'Room member left successfully',
        action: 'left'
    });
}
