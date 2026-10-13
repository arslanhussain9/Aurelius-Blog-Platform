import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request) {
  const sessionUser = auth.getUserFromRequest(request);
  if (!sessionUser) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  const user = db.getUserById(sessionUser.id);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  const { passwordHash: _, ...safeUser } = user;
  return NextResponse.json({ authenticated: true, user: safeUser });
}
