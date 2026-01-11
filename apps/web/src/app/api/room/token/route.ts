import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { auth } from '@paircode/auth';

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { roomId } = await request.json();

  if (!roomId || typeof roomId !== 'string') {
    return NextResponse.json({ error: 'Invalid roomId' }, { status: 400 });
  };

  const token = jwt.sign(
    {
      email: session.user.email,
      roomId
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return NextResponse.json({ token });
}