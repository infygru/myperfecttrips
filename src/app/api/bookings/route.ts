import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/auth';

const DIRECTUS_URL  = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN   = process.env.DIRECTUS_ADMIN_TOKEN || '';

/** Verify token and return full user profile via admin token (avoids policy field restrictions) */
async function getFullUser(token: string): Promise<any | null> {
    // Step 1 — verify identity, get ID only
    const meRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });
    if (!meRes.ok) return null;
    const userId = (await meRes.json()).data?.id;
    if (!userId) return null;

    // Step 2 — fetch full profile with admin token (guaranteed to return all fields)
    const profileRes = await fetch(
        `${DIRECTUS_URL}/users/${userId}?fields=id,email,first_name,last_name,phone`,
        { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }, cache: 'no-store' }
    );
    if (!profileRes.ok) return null;
    return (await profileRes.json()).data || null;
}

export async function GET(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const user = await getFullUser(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
        const user = await getFullUser(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();

        // Generate alphanumeric reference number
        const ref = `IGH${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

        const userPhone = (body.phone || user.phone || '').trim();

        const bookingPayload = {
            user_id: user.id,
            user_name: [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || user.email,
            user_email: user.email,
            user_phone: userPhone,
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
            coupon_code: body.coupon_code || null,
            coupon_id: body.coupon_id || null,
            coupon_discount: body.coupon_discount || 0,
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

        // If user had no phone on their profile (common for Google sign-in), save it now
        if (!user.phone && userPhone) {
            adminFetch(`/users/${user.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ phone: userPhone }),
            }).catch(() => {}); // non-critical — don't block the response
        }

        return NextResponse.json({ booking: data.data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
