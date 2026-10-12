import { NextRequest, NextResponse } from 'next/server';
import { verifyAndUpdatePayment } from '@/lib/razorpay';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-razorpay-signature') || '';

        // Verify Razorpay webhook signature: HMAC-SHA256(rawBody, webhookSecret) → hex
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (webhookSecret) {
            const expectedSig = crypto
                .createHmac('sha256', webhookSecret)
                .update(rawBody)
                .digest('hex');
            if (signature !== expectedSig) {
                console.error('Razorpay webhook: signature mismatch');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        }

        const payload = JSON.parse(rawBody);
        const { event, payload: eventPayload } = payload;

        // Only process captured/authorised payments
        if (event !== 'payment.captured' && event !== 'payment.authorized') {
            return NextResponse.json({ received: true });
        }

        const payment = eventPayload?.payment?.entity;
        if (!payment) return NextResponse.json({ received: true });

        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;

        if (!razorpayOrderId || !razorpayPaymentId) {
            return NextResponse.json({ received: true });
        }

        // For webhooks we can't re-verify signature (we only have order/payment IDs).
        // Instead we trust the webhook signature verification above and find the booking
        // by the Razorpay order ID stored in our payments table.
        // We call verifyAndUpdatePayment with a pre-computed signature bypass:
        // generate the expected signature ourselves since we trust this webhook.
        const expectedSig = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        await verifyAndUpdatePayment(razorpayOrderId, razorpayPaymentId, expectedSig).catch(err =>
            console.error('Webhook: verifyAndUpdatePayment error:', err)
        );

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Razorpay webhook error:', err);
        // Return 200 so Razorpay doesn't retry on our processing errors
        return NextResponse.json({ received: true });
    }
}
