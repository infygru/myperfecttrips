import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    try {
        const [userRes, settingsRes] = await Promise.all([
            fetch(`${DIRECTUS_URL}/users/me?fields=id,first_name,last_name,email,phone,avatar,status`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
            }),
            fetch(`${DIRECTUS_URL}/items/site_settings?fields=default_avatar&limit=1`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
            }),
        ]);

        if (!userRes.ok) return NextResponse.json({ user: null }, { status: 401 });

        const userData = await userRes.json();
        const user = userData.data;

        // Attach default_avatar_url from site settings
        let default_avatar_url: string | null = null;
        try {
            const settings = await settingsRes.json();
            const defaultAvatar = settings?.data?.[0]?.default_avatar || settings?.data?.default_avatar;
            if (defaultAvatar) {
                default_avatar_url = `${DIRECTUS_URL}/assets/${defaultAvatar}`;
            }
        } catch { /* site settings optional */ }

        return NextResponse.json({ user: { ...user, default_avatar_url } });
    } catch {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
