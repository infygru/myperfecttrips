import { NextRequest, NextResponse } from 'next/server';
import { verifyAndUpdatePayment } from '@/lib/razorpay';
import { sendBookingConfirmationEmail, sendAdminBookingAlert } from '@/lib/email';
import { adminFetch } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
        }

        const result = await verifyAndUpdatePayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId,
        );

        // If webhook already marked it paid before we got here, emails were skipped
        // in verifyAndUpdatePayment — send them now from here so customer always gets confirmation
        if (result.alreadyPaid) {
            console.log('[verify route] booking was already paid — sending emails now');
            const booking = result.booking;

            const travelDate = booking.travel_date
                ? new Date(booking.travel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'TBD';

            const emailData = {
                customerName:    booking.user_name    || 'Traveller',
                customerEmail:   booking.user_email   || '',
                customerPhone:   booking.user_phone   || '',
                packageTitle:    booking.package_title,
                destination:     booking.package_title,
                travelDate,
                numAdults:       Number(booking.num_adults)   || 1,
                numChildren:     Number(booking.num_children) || 0,
                totalAmount:     Number(booking.total_amount),
                referenceNumber: booking.reference_number,
                specialRequests: booking.special_requests || '',
            };

            if (booking.user_email) {
                const sent = await sendBookingConfirmationEmail(emailData)
                    .catch(err => { console.error('[verify/alreadyPaid email] failed:', err); return false; });
                console.log(`[verify/alreadyPaid email] result: ${sent}`);
            }
            await sendAdminBookingAlert(emailData)
                .catch(err => console.error('[verify/alreadyPaid admin alert] failed:', err));
        }

        return NextResponse.json(result);
    } catch (err: any) {
        console.error('Payment verify error:', err);
        return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
    }
}
