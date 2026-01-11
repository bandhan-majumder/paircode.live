import { NextResponse } from "next/server";
import { getPublicRooms } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = Number(searchParams.get("offset")) || 0;

    if (limit > 50 || limit < 1) {
        return NextResponse.json(
            { error: "Limit must be between 1 and 50" },
            { status: 400 }
        );
    }

    const result = await getPublicRooms(limit, offset);

    return NextResponse.json(result);
}