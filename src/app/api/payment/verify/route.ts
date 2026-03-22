import { NextRequest, NextResponse } from 'next/server';
import { verifyAndUpdatePayment } from '@/lib/cashfree';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const bookingId = searchParams.get('bookingId') || undefined;

    if (!orderId) {
        return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    try {
        const result = await verifyAndUpdatePayment(orderId, bookingId);
        return NextResponse.json(result);
    } catch (err: any) {
        console.error('Payment verify error:', err);
        return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
    }
}
