import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN  = process.env.DIRECTUS_ADMIN_TOKEN || '';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Step 1 — verify identity
        const meRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!meRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = (await meRes.json()).data?.id;
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Step 2 — fetch full profile via admin token
        const profileRes = await fetch(`${DIRECTUS_URL}/users/${userId}?fields=id,email,phone`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
            cache: 'no-store',
        });
        const user = profileRes.ok ? (await profileRes.json()).data : { id: userId };

        const { bookingId } = await req.json();
        if (!bookingId) return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });

        const bookingRes = await adminFetch(`/items/bookings/${bookingId}`);
        const { data: booking } = await bookingRes.json();

        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        if (booking.user_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        if (booking.payment_status === 'paid') return NextResponse.json({ error: 'Already paid' }, { status: 400 });

        const order = await createRazorpayOrder({
            orderId: booking.reference_number,
            amount: Number(booking.total_amount),
            orderNote: `My Perfect Trips - ${booking.package_title}`,
        });

        return NextResponse.json({
            razorpayOrderId: order.id,
            amount: order.amount,           // paise
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            bookingId: booking.id,
            bookingRef: booking.reference_number,
            prefill: {
                name: booking.user_name || '',
                email: user.email || '',
                contact: booking.user_phone || user.phone || '',
            },
        });
    } catch (err: any) {
        console.error('Create Razorpay order error:', err);
        return NextResponse.json({ error: err.message || 'Failed to create payment order' }, { status: 500 });
    }
}
