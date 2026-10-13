import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password, name, bio, avatar } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check existing email
    if (db.getUserByEmail(email)) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Check existing username
    if (db.getUserByUsername(username)) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    const passwordHash = await auth.hashPassword(password);
    const newUser = db.createUser({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      name: name?.trim() || username.trim(),
      bio: bio?.trim(),
      avatar: avatar?.trim(),
      passwordHash
    });

    const token = auth.signToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    const response = NextResponse.json({
      message: 'Account created successfully',
      user: safeUser,
      token
    }, { status: 201 });

    response.cookies.set('auralis_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
