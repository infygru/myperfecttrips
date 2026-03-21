import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const authData = await loginUser(email, password);
        const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

        // Fetch user profile
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
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });
        response.cookies.set('directus_refresh', authData.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        return response;
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Login failed' }, { status: 401 });
    }
}
