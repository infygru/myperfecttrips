import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '@/lib/otp';

export async function POST(req: NextRequest) {
    try {
        const { phone } = await req.json();
        if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 });

        const normalized = phone.replace(/[^0-9]/g, '').slice(-10);
        if (normalized.length !== 10) {
            return NextResponse.json({ error: 'Enter a valid 10-digit mobile number' }, { status: 400 });
        }

        const result = await sendOTP(normalized);

        if (!result.sent) {
            return NextResponse.json(
                { error: 'SMS service unavailable. Please add TWOFACTOR_API_KEY to your environment variables (free at 2factor.in).' },
                { status: 500 }
            );
        }

        const masked = `+91 ${normalized.slice(0, 2)}XXXXXX${normalized.slice(-2)}`;
        return NextResponse.json({
            success: true,
            message: `OTP sent to ${masked}`,
            // Only expose in non-production for testing
            ...(result.method === 'console' && process.env.NODE_ENV !== 'production'
                ? { _dev_note: 'SMS provider not configured — check server console for OTP' }
                : {}),
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
