import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/auth';
import { sendBookingConfirmationSMS } from '@/lib/sms';
import { awardPoints, redeemPoints } from '@/lib/loyalty';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

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

        const { bookingId, utrNumber } = await req.json();

        if (!bookingId || !utrNumber?.trim()) {
            return NextResponse.json({ error: 'Booking ID and UTR number are required' }, { status: 400 });
        }

        const bookingRes = await adminFetch(`/items/bookings/${bookingId}`);
        const bookingData = await bookingRes.json();
        const booking = bookingData.data;

        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        if (booking.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        if (booking.payment_status === 'paid') return NextResponse.json({ error: 'Already paid' }, { status: 400 });

        // Mark booking as pending verification (confirmed once admin verifies UTR)
        await adminFetch(`/items/bookings/${booking.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                payment_status: 'pending_verification',
                status: 'confirmed',
            }),
        });

        // Save payment record
        await adminFetch('/items/payments', {
            method: 'POST',
            body: JSON.stringify({
                booking_id: booking.id,
                amount: booking.total_amount,
                currency: 'GBP',
                gateway: 'upi',
                transaction_id: utrNumber.trim(),
                order_id: booking.reference_number,
                status: 'pending_verification',
                gateway_response: JSON.stringify({ utr: utrNumber.trim(), upi_id: 'infyguru@sbi' }),
            }),
        });

        // Redeem loyalty points if any were promised
        if (booking.points_redeemed > 0) {
            await redeemPoints(booking.user_id, booking.id, booking.points_redeemed, booking.package_title);
        }
        // Award points on net amount paid
        await awardPoints(booking.user_id, booking.id, Number(booking.total_amount), booking.package_title);

        // Send SMS confirmation
        if (booking.user_phone) {
            const travelDate = booking.travel_date
                ? new Date(booking.travel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'TBD';
            await sendBookingConfirmationSMS(
                booking.user_phone,
                booking.user_name?.split(' ')[0] || 'Traveller',
                booking.package_title,
                booking.reference_number,
                travelDate
            );
        }

        return NextResponse.json({ success: true, bookingId: booking.id, ref: booking.reference_number });
    } catch (err: any) {
        console.error('Payment confirm error:', err);
        return NextResponse.json({ error: err.message || 'Failed to confirm payment' }, { status: 500 });
    }
}
