import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN  = process.env.DIRECTUS_ADMIN_TOKEN || '';

export async function PATCH(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Verify identity — get user ID from their session token
        const meRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id,email`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: me } = await meRes.json();

        const { first_name, last_name, phone } = await req.json();

        // Update using admin token — user tokens lack permission to patch directus_users
        const res = await fetch(`${DIRECTUS_URL}/users/${me.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ADMIN_TOKEN}`,
            },
            body: JSON.stringify({ first_name, last_name, phone }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Update failed');
        return NextResponse.json({ user: data.data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
