import crypto from 'crypto';
import { adminFetch } from '@/lib/auth';
import { sendBookingConfirmationSMS } from '@/lib/sms';
import { awardPoints, redeemPoints } from '@/lib/loyalty';
import { sendBookingConfirmationEmail, sendAdminBookingAlert } from '@/lib/email';
import { recordCouponUsage } from '@/lib/coupon';

const RZP_BASE = 'https://api.razorpay.com/v1';

function rzpHeaders() {
    const auth = Buffer.from(
        `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString('base64');
    return {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
    };
}

export interface RazorpayOrderInput {
    orderId: string;      // our reference number (used as receipt)
    amount: number;       // in INR — converted to paise internally
    orderNote?: string;
}

export async function createRazorpayOrder(input: RazorpayOrderInput) {
    const res = await fetch(`${RZP_BASE}/orders`, {
        method: 'POST',
        headers: rzpHeaders(),
        body: JSON.stringify({
            amount: Math.round(input.amount * 100), // paise
            currency: 'INR',
            receipt: input.orderId.substring(0, 40),
            notes: { order_note: input.orderNote || '' },
        }),
        cache: 'no-store',
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.description || `Razorpay order creation failed (${res.status})`);
    }
    return res.json(); // { id, amount, currency, receipt, status, ... }
}

export function verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string,
): boolean {
    const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');
    return expected === signature;
}

/**
 * Verify a Razorpay payment and update the booking if signature is valid.
 * Idempotent — safe to call multiple times.
 * Returns { status: 'paid' | 'failed', booking }
 */
export async function verifyAndUpdatePayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    bookingId?: string,
) {
    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) throw new Error('Payment signature verification failed');

    // Find booking in Directus
    let booking: any = null;
    if (bookingId) {
        const r = await adminFetch(`/items/bookings/${bookingId}`);
        booking = (await r.json()).data;
    } else {
        const r = await adminFetch(
            `/items/payments?filter[order_id][_eq]=${encodeURIComponent(razorpayOrderId)}&limit=1`
        );
        const payments = (await r.json()).data;
        if (payments?.[0]?.booking_id) {
            const br = await adminFetch(`/items/bookings/${payments[0].booking_id}`);
            booking = (await br.json()).data;
        }
    }

    if (!booking) throw new Error('Booking not found');

    // Already paid — idempotent, but still return the booking so callers can send email
    const alreadyPaid = booking.payment_status === 'paid';
    if (alreadyPaid) {
        return { status: 'paid' as const, booking, alreadyPaid: true };
    }

    // Mark booking as paid
    await adminFetch(`/items/bookings/${booking.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ payment_status: 'paid', status: 'confirmed' }),
    });

    // Avoid duplicate payment records
    const existingR = await adminFetch(
        `/items/payments?filter[booking_id][_eq]=${booking.id}&filter[status][_eq]=paid&limit=1`
    );
    const existingPayments = (await existingR.json()).data;
    if (!existingPayments?.length) {
        await adminFetch('/items/payments', {
            method: 'POST',
            body: JSON.stringify({
                booking_id: booking.id,
                amount: booking.total_amount,
                currency: 'INR',
                gateway: 'razorpay',
                transaction_id: razorpayPaymentId,
                order_id: razorpayOrderId,
                status: 'paid',
                gateway_response: JSON.stringify({ razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId }),
            }),
        });
    }

    // Coupon usage (idempotent — recordCouponUsage checks for existing record)
    if (booking.coupon_id) {
        await recordCouponUsage(
            booking.coupon_id,
            booking.coupon_code || '',
            booking.user_id,
            booking.id,
            Number(booking.coupon_discount || 0),
        ).catch(err => console.error('[Coupon usage] failed to record:', err));
    }

    // Loyalty points (idempotent — lib handles duplicates)
    if (booking.points_redeemed > 0) {
        await redeemPoints(booking.user_id, booking.id, booking.points_redeemed, booking.package_title).catch(() => {});
    }
    await awardPoints(booking.user_id, booking.id, Number(booking.total_amount), booking.package_title).catch(() => {});

    const travelDate = booking.travel_date
        ? new Date(booking.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'TBD';

    // SMS confirmation
    if (booking.user_phone) {
        await sendBookingConfirmationSMS(
            booking.user_phone,
            booking.user_name?.split(' ')[0] || 'Traveller',
            booking.package_title,
            booking.reference_number,
            travelDate,
        ).catch(err => console.error('[SMS confirmation] failed:', err));
    }

    // Email confirmation to customer + admin alert
    const emailData = {
        customerName:    booking.user_name  || 'Traveller',
        customerEmail:   booking.user_email || '',
        customerPhone:   booking.user_phone || '',
        packageTitle:    booking.package_title,
        destination:     booking.destination || booking.package_title,
        travelDate,
        numAdults:       Number(booking.num_adults)   || 1,
        numChildren:     Number(booking.num_children) || 0,
        totalAmount:     Number(booking.total_amount),
        referenceNumber: booking.reference_number,
        specialRequests: booking.special_requests || '',
    };

    console.log(`[Email] sending confirmation to: ${emailData.customerEmail || '(no email)'}`);

    if (booking.user_email) {
        const sent = await sendBookingConfirmationEmail(emailData)
            .catch(err => { console.error('[Email confirmation] failed:', err); return false; });
        console.log(`[Email confirmation] result: ${sent}`);
    } else {
        console.warn('[Email confirmation] skipped — no user_email on booking', booking.id);
    }

    await sendAdminBookingAlert(emailData)
        .catch(err => console.error('[Email admin alert] failed:', err));

    return { status: 'paid' as const, booking: { ...booking, payment_status: 'paid' }, alreadyPaid: false };
}
