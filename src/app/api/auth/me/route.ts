import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    try {
        const res = await fetch(`${dUrl}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) return NextResponse.json({ user: null }, { status: 401 });
        const data = await res.json();
        return NextResponse.json({ user: data.data });
    } catch {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
