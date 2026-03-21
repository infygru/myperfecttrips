import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;

    if (token) {
        try {
            const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
            await fetch(`${dUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token }),
            });
        } catch { /* ignore logout errors */ }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('directus_token');
    response.cookies.delete('directus_refresh');
    return response;
}
