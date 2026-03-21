import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/auth';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Get current user
        const userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!userRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: user } = await userRes.json();

        // Fetch bookings for this user via admin token (so we can filter)
        const res = await adminFetch(
            `/items/bookings?filter[user_id][_eq]=${user.id}&sort[]=-date_created&fields[]=*`
        );
        const data = await res.json();
        return NextResponse.json({ bookings: data.data || [] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!userRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: user } = await userRes.json();

        const body = await req.json();

        // Generate alphanumeric reference number
        const ref = `IGH${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

        const bookingPayload = {
            user_id: user.id,
            user_name: `${user.first_name} ${user.last_name}`,
            user_email: user.email,
            user_phone: body.phone || user.phone || '',
            package_id: body.package_id,
            package_title: body.package_title,
            package_slug: body.package_slug,
            travel_date: body.travel_date,
            num_adults: body.num_adults || 1,
            num_children: body.num_children || 0,
            total_amount: body.total_amount,
            special_requests: body.special_requests || '',
            points_redeemed: body.points_redeemed || 0,
            discount_amount: body.discount_amount || 0,
            status: 'pending',
            payment_status: 'pending',
            reference_number: ref,
        };

        const res = await adminFetch('/items/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingPayload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Booking creation failed');

        return NextResponse.json({ booking: data.data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
