import { adminFetch } from '@/lib/auth';
import { sendBookingConfirmationSMS } from '@/lib/sms';
import { awardPoints, redeemPoints } from '@/lib/loyalty';

const CF_BASE = 'https://api.cashfree.com/pg';

function cfHeaders() {
    return {
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
        'Content-Type': 'application/json',
    };
}

/** Normalize phone to 10-digit Indian mobile (Cashfree requirement) */
function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    if (digits.length === 10) return digits;
    return digits.slice(-10);
}

export interface CashfreeOrderInput {
    orderId: string;
    amount: number;
    customerId: string;
    customerEmail: string;
    customerPhone: string;
    returnUrl: string;
    notifyUrl?: string;
    orderNote?: string;
}

export async function createCashfreeOrder(input: CashfreeOrderInput) {
    const res = await fetch(`${CF_BASE}/orders`, {
        method: 'POST',
        headers: cfHeaders(),
        body: JSON.stringify({
            order_id: input.orderId,
            order_amount: input.amount,
            order_currency: 'GBP',
            customer_details: {
                customer_id: input.customerId.replace(/-/g, '').substring(0, 32),
                customer_email: input.customerEmail,
                customer_phone: normalizePhone(input.customerPhone) || '9999999999',
            },
            order_meta: {
                return_url: input.returnUrl,
                ...(input.notifyUrl ? { notify_url: input.notifyUrl } : {}),
            },
            order_note: input.orderNote,
        }),
        cache: 'no-store',
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Cashfree order creation failed (${res.status})`);
    }
    return res.json();
}

export async function getCashfreeOrder(orderId: string) {
    const res = await fetch(`${CF_BASE}/orders/${orderId}`, {
        headers: cfHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to fetch Cashfree order (${res.status})`);
    }
    return res.json();
}

export async function getCashfreePayments(orderId: string) {
    const res = await fetch(`${CF_BASE}/orders/${orderId}/payments`, {
        headers: cfHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to fetch Cashfree payments (${res.status})`);
    }
    return res.json();
}

/**
 * Verify a Cashfree order and update the booking if paid.
 * Idempotent — safe to call multiple times.
 * Returns { status: 'paid' | 'active' | 'expired' | 'pending', booking }
 */
export async function verifyAndUpdatePayment(orderId: string, bookingId?: string) {
    // Fetch Cashfree order status
    const [cfOrder, cfPayments] = await Promise.all([
        getCashfreeOrder(orderId).catch(() => null),
        getCashfreePayments(orderId).catch(() => [] as any[]),
    ]);

    // Find booking in Directus
    let booking: any = null;
    if (bookingId) {
        const r = await adminFetch(`/items/bookings/${bookingId}`);
        booking = (await r.json()).data;
    } else {
        const r = await adminFetch(`/items/bookings?filter[reference_number][_eq]=${encodeURIComponent(orderId)}&limit=1`);
        booking = (await r.json()).data?.[0];
    }

    if (!booking) throw new Error('Booking not found');

    // Already paid — return early
    if (booking.payment_status === 'paid') {
        return { status: 'paid' as const, booking };
    }

    const successPayment = Array.isArray(cfPayments)
        ? cfPayments.find((p: any) => p.payment_status === 'SUCCESS')
        : null;
    const isPaid = cfOrder?.order_status === 'PAID' || !!successPayment;

    if (!isPaid) {
        const status = cfOrder?.order_status?.toLowerCase() || 'pending';
        return { status: status as string, booking };
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
                currency: 'GBP',
                gateway: 'cashfree',
                transaction_id: successPayment?.cf_payment_id?.toString() || cfOrder?.cf_order_id,
                order_id: booking.reference_number,
                status: 'paid',
                gateway_response: JSON.stringify(successPayment || cfOrder),
            }),
        });
    }

    // Loyalty points (idempotent — lib handles duplicates)
    if (booking.points_redeemed > 0) {
        await redeemPoints(booking.user_id, booking.id, booking.points_redeemed, booking.package_title).catch(() => {});
    }
    await awardPoints(booking.user_id, booking.id, Number(booking.total_amount), booking.package_title).catch(() => {});

    // SMS confirmation
    if (booking.user_phone) {
        const travelDate = booking.travel_date
            ? new Date(booking.travel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'TBD';
        await sendBookingConfirmationSMS(
            booking.user_phone,
            booking.user_name?.split(' ')[0] || 'Traveller',
            booking.package_title,
            booking.reference_number,
            travelDate,
        ).catch(() => {});
    }

    return { status: 'paid' as const, booking: { ...booking, payment_status: 'paid' } };
}
