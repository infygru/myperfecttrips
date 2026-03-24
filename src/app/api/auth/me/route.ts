import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN  = process.env.DIRECTUS_ADMIN_TOKEN || '';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    try {
        // Verify identity
        const meRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!meRes.ok) return NextResponse.json({ user: null }, { status: 401 });
        const userId = (await meRes.json()).data?.id;
        if (!userId) return NextResponse.json({ user: null }, { status: 401 });

        // Fetch full profile + site settings via admin token
        const [userRes, ssRes] = await Promise.all([
            fetch(`${DIRECTUS_URL}/users/${userId}?fields=id,first_name,last_name,email,phone,avatar`, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
                cache: 'no-store',
            }),
            fetch(`${DIRECTUS_URL}/items/site_settings?fields=default_avatar&limit=1`, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
                cache: 'no-store',
            }),
        ]);

        if (!userRes.ok) return NextResponse.json({ user: null }, { status: 401 });
        const user = (await userRes.json()).data;
        if (!user) return NextResponse.json({ user: null }, { status: 401 });

        try {
            const ss = await ssRes.json();
            const da = ss?.data?.[0]?.default_avatar || ss?.data?.default_avatar;
            if (da) user.default_avatar_url = `${DIRECTUS_URL}/assets/${da}`;
        } catch { /* optional */ }

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
