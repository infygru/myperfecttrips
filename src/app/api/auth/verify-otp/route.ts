import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';

export async function POST(req: NextRequest) {
    try {
        const { phone, otp } = await req.json();
        if (!phone || !otp) {
            return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 });
        }

        const normalized = phone.replace(/[^0-9]/g, '').slice(-10);
        const valid = verifyOTP(normalized, otp.toString().trim());

        if (!valid) {
            return NextResponse.json({ error: 'Invalid or expired OTP. Please try again.' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
