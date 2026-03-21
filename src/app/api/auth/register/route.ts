import { NextRequest, NextResponse } from 'next/server';
import { registerUser, loginUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { first_name, last_name, email, password, phone } = await req.json();

        if (!first_name || !last_name || !email || !password) {
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        await registerUser({ first_name, last_name, email, password, phone });

        // Auto-login after registration
        const authData = await loginUser(email, password);
        const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

        const userRes = await fetch(`${dUrl}/users/me`, {
            headers: { Authorization: `Bearer ${authData.access_token}` },
        });
        const userData = await userRes.json();
        const user = userData.data;

        const response = NextResponse.json({ user });
        response.cookies.set('directus_token', authData.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });
        response.cookies.set('directus_refresh', authData.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });

        return response;
    } catch (err: any) {
        const msg = err.message || 'Registration failed';
        const status = msg.includes('exist') ? 409 : 400;
        return NextResponse.json({ error: msg }, { status });
    }
}
