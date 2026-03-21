import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const amount = searchParams.get('amount') || '0';
    const ref = searchParams.get('ref') || 'booking';

    const upiUrl = `upi://pay?pa=infyguru@sbi&pn=IG%20Holidays&am=${amount}&cu=INR&tn=Booking%20${ref}`;

    const pngBuffer = await QRCode.toBuffer(upiUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#1c1917', light: '#ffffff' },
    });

    return new NextResponse(pngBuffer, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store',
        },
    });
}
