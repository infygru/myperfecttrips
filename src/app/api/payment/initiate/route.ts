import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/auth';
import { initiateTransaction } from '@/lib/paytm';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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

        // Fetch the booking
        const bookingRes = await adminFetch(`/items/bookings/${bookingId}`);
        const bookingData = await bookingRes.json();
        const booking = bookingData.data;

        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        if (booking.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        if (booking.payment_status === 'paid') {
            return NextResponse.json({ error: 'Already paid' }, { status: 400 });
        }

        // Use booking reference as PayTM order ID
        const orderId = booking.reference_number;

        const result = await initiateTransaction({
            orderId,
            amount: Number(booking.total_amount),
            customerId: user.id,
            customerEmail: user.email,
            customerPhone: user.phone || booking.user_phone || '',
            callbackUrl: `${SITE_URL}/api/payment/callback`,
        });

        // Save paytm_order_id to booking
        await adminFetch(`/items/bookings/${bookingId}`, {
            method: 'PATCH',
            body: JSON.stringify({ paytm_order_id: orderId }),
        });

        return NextResponse.json({ txnToken: result.txnToken, orderId });
    } catch (err: any) {
        console.error('Payment initiation error:', err);
        return NextResponse.json({ error: err.message || 'Payment initiation failed' }, { status: 500 });
    }
}
