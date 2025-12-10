import { NextResponse } from "next/server";

// fetch all the live rooms
export function GET() {
  return NextResponse.json({ rooms: [] });
}