import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    // Support login via either email or username
    const user = emailOrUsername.includes('@')
      ? db.getUserByEmail(emailOrUsername)
      : (db.getUserByUsername(emailOrUsername) || db.getUserByEmail(emailOrUsername));

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. User not found.' },
        { status: 401 }
      );
    }

    const isValid = await auth.comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials. Incorrect password.' },
        { status: 401 }
      );
    }

    const token = auth.signToken(user);
    const { passwordHash: _, ...safeUser } = user;

    const response = NextResponse.json({
      message: 'Logged in successfully',
      user: safeUser,
      token
    });

    response.cookies.set('auralis_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
