import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN  = process.env.DIRECTUS_ADMIN_TOKEN || '';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { current_password, new_password } = await req.json();
        if (!current_password || !new_password)
            return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 });
        if (new_password.length < 8)
            return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });

        // Get user's email to verify current password
        const meRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id,email`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: me } = await meRes.json();

        // Verify current password by attempting login
        const verifyRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: me.email, password: current_password }),
        });
        if (!verifyRes.ok)
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

        // Update password via admin token
        const updateRes = await fetch(`${DIRECTUS_URL}/users/${me.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
            body: JSON.stringify({ password: new_password }),
        });
        if (!updateRes.ok) {
            const err = await updateRes.json();
            throw new Error(err?.errors?.[0]?.message || 'Password update failed');
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
