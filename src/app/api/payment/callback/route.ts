import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/auth';
import { verifyCallbackChecksum, verifyTransaction } from '@/lib/paytm';
import { sendBookingConfirmationSMS } from '@/lib/sms';
import { awardPoints, redeemPoints } from '@/lib/loyalty';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const params: Record<string, string> = {};
        formData.forEach((value, key) => { params[key] = value.toString(); });

        const checksumHash = params.CHECKSUMHASH;
        const orderId = params.ORDERID;
        const txnId = params.TXNID;
        const status = params.STATUS;
        const txnAmount = params.TXNAMOUNT;

        if (!orderId) {
            return NextResponse.redirect(`${SITE_URL}/payment/failure?error=missing_order`);
        }

        // Verify checksum
        const paramsWithoutChecksum = { ...params };
        delete paramsWithoutChecksum.CHECKSUMHASH;
        const isValid = verifyCallbackChecksum(paramsWithoutChecksum, checksumHash);

        if (!isValid) {
            console.error('Checksum verification failed for order:', orderId);
            return NextResponse.redirect(`${SITE_URL}/payment/failure?error=invalid_checksum&orderId=${orderId}`);
        }

        // Find booking by reference_number
        const bookingRes = await adminFetch(
            `/items/bookings?filter[reference_number][_eq]=${orderId}&limit=1`
        );
        const bookingData = await bookingRes.json();
        const booking = bookingData.data?.[0];

        if (!booking) {
            return NextResponse.redirect(`${SITE_URL}/payment/failure?error=booking_not_found`);
        }

        if (status === 'TXN_SUCCESS') {
            // Double-verify with PayTM server
            const verification = await verifyTransaction(orderId);

            if (verification.status === 'TXN_SUCCESS') {
                // Update booking to confirmed
                await adminFetch(`/items/bookings/${booking.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        status: 'confirmed',
                        payment_status: 'paid',
                        paytm_txn_id: txnId,
                    }),
                });

                // Save payment record
                await adminFetch('/items/payments', {
                    method: 'POST',
                    body: JSON.stringify({
                        booking_id: booking.id,
                        amount: txnAmount,
                        currency: 'INR',
                        gateway: 'paytm',
                        transaction_id: txnId,
                        order_id: orderId,
                        status: 'success',
                        gateway_response: JSON.stringify(params),
                    }),
                });

                // Handle loyalty points
                const amountPaid = Number(txnAmount || booking.total_amount);
                // Redeem points if any were promised
                if (booking.points_redeemed > 0) {
                    await redeemPoints(booking.user_id, booking.id, booking.points_redeemed, booking.package_title);
                }
                // Award points on net amount paid (after discount)
                const netAmount = amountPaid; // points already deducted from total_amount before payment
                await awardPoints(booking.user_id, booking.id, netAmount, booking.package_title);

                // Send confirmation SMS
                if (booking.user_phone) {
                    const travelDate = booking.travel_date
                        ? new Date(booking.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'TBD';
                    await sendBookingConfirmationSMS(
                        booking.user_phone,
                        booking.user_name?.split(' ')[0] || 'Traveller',
                        booking.package_title,
                        booking.reference_number,
                        travelDate
                    );
                }

                return NextResponse.redirect(`${SITE_URL}/payment/success?bookingId=${booking.id}&ref=${orderId}`);
            }
        }

        // Payment failed
        await adminFetch(`/items/bookings/${booking.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ payment_status: 'failed' }),
        });
        await adminFetch('/items/payments', {
            method: 'POST',
            body: JSON.stringify({
                booking_id: booking.id,
                amount: txnAmount || '0',
                currency: 'INR',
                gateway: 'paytm',
                transaction_id: txnId || '',
                order_id: orderId,
                status: 'failed',
                gateway_response: JSON.stringify(params),
            }),
        });

        return NextResponse.redirect(`${SITE_URL}/payment/failure?bookingId=${booking.id}&ref=${orderId}`);
    } catch (err: any) {
        console.error('Payment callback error:', err);
        return NextResponse.redirect(`${SITE_URL}/payment/failure?error=server_error`);
    }
}

// PayTM sometimes uses GET for callback too
export async function GET(req: NextRequest) {
    return NextResponse.redirect(`${SITE_URL}/payment/failure?error=invalid_callback`);
}
