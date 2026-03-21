import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/auth';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!userRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: user } = await userRes.json();

        const res = await adminFetch(`/items/bookings/${id}`);
        const data = await res.json();
        const booking = data.data;

        if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (booking.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        return NextResponse.json({ booking });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!userRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: user } = await userRes.json();

        // Check ownership
        const checkRes = await adminFetch(`/items/bookings/${id}`);
        const checkData = await checkRes.json();
        if (checkData.data?.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updates = await req.json();
        // Users can only cancel bookings (no other updates)
        const allowedUpdates: any = {};
        if (updates.status === 'cancelled' && checkData.data?.status === 'confirmed') {
            allowedUpdates.status = 'cancelled';
        }

        const res = await adminFetch(`/items/bookings/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(allowedUpdates),
        });
        const data = await res.json();
        return NextResponse.json({ booking: data.data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
