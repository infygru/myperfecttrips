import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '@/lib/otp';

export async function POST(req: NextRequest) {
    try {
        const { phone } = await req.json();
        if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 });

        const normalized = phone.replace(/[^0-9]/g, '').slice(-10);
        if (normalized.length !== 10) {
            return NextResponse.json({ error: 'Enter a valid 10-digit Indian mobile number' }, { status: 400 });
        }

        const sent = await sendOTP(normalized);
        if (!sent) {
            return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: `OTP sent to +91 ${normalized.slice(0, 2)}XXXXXX${normalized.slice(-2)}` });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
