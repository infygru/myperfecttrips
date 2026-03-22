import { NextRequest, NextResponse } from 'next/server';
import { verifyAndUpdatePayment } from '@/lib/cashfree';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const timestamp = req.headers.get('x-webhook-timestamp') || '';
        const signature = req.headers.get('x-webhook-signature') || '';

        // Verify Cashfree webhook signature: HMAC-SHA256(timestamp + rawBody, secretKey) → base64
        const expectedSig = crypto
            .createHmac('sha256', process.env.CASHFREE_SECRET_KEY!)
            .update(timestamp + rawBody)
            .digest('base64');

        if (signature !== expectedSig) {
            console.error('Cashfree webhook: signature mismatch');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const payload = JSON.parse(rawBody);
        const { type, data } = payload;

        // Only process successful payments
        if (type !== 'PAYMENT_SUCCESS_WEBHOOK') {
            return NextResponse.json({ received: true });
        }

        const orderId = data?.order?.order_id;
        if (!orderId) return NextResponse.json({ received: true });

        await verifyAndUpdatePayment(orderId).catch(err =>
            console.error('Webhook: verifyAndUpdatePayment error:', err)
        );

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Cashfree webhook error:', err);
        // Return 200 so Cashfree doesn't retry on our processing errors
        return NextResponse.json({ received: true });
    }
}
