import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/auth';
import { createCashfreeOrder } from '@/lib/cashfree';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myperfecttrips.com';

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

        const { bookingId } = await req.json();
        if (!bookingId) return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });

        const bookingRes = await adminFetch(`/items/bookings/${bookingId}`);
        const { data: booking } = await bookingRes.json();

        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        if (booking.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        if (booking.payment_status === 'paid') return NextResponse.json({ error: 'Already paid' }, { status: 400 });

        // Return URL — Cashfree replaces {order_id} with the actual order ID
        const returnUrl = `${SITE_URL}/payment/success?bookingId=${booking.id}&ref=${booking.reference_number}&order_id={order_id}`;
        const notifyUrl = `${SITE_URL}/api/payment/webhook`;

        const order = await createCashfreeOrder({
            orderId: booking.reference_number,
            amount: Number(booking.total_amount),
            customerId: user.id,
            customerEmail: user.email,
            customerPhone: booking.user_phone || user.phone || '9999999999',
            returnUrl,
            notifyUrl,
            orderNote: `My Perfect Trips - ${booking.package_title}`,
        });

        return NextResponse.json({
            paymentSessionId: order.payment_session_id,
            orderId: order.order_id,
        });
    } catch (err: any) {
        console.error('Create Cashfree order error:', err);
        return NextResponse.json({ error: err.message || 'Failed to create payment order' }, { status: 500 });
    }
}
