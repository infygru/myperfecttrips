import { NextRequest, NextResponse } from 'next/server';
import { generateOTP } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';
import { sendOTPSMS } from '@/lib/sms';

export async function POST(req: NextRequest) {
    try {
        const { phone, email } = await req.json();
        if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 });

        const normalized = phone.replace(/[^0-9]/g, '').slice(-10);
        if (normalized.length !== 10) {
            return NextResponse.json({ error: 'Enter a valid 10-digit mobile number' }, { status: 400 });
        }

        const otp = generateOTP(normalized);
        // Always log to server console for debugging
        console.log(`[OTP] +91${normalized} → ${otp}`);

        // Primary: send via email (Resend — reliable)
        if (email) {
            await sendOTPEmail(email, otp, normalized).catch(err =>
                console.error('[OTP email] failed:', err)
            );
        }

        // Secondary: attempt SMS (Fast2SMS — best effort)
        sendOTPSMS(normalized, otp).catch(() => {});

        const delivery = email
            ? `OTP sent to ${email.replace(/(.{2}).*(@.*)/, '$1****$2')}`
            : `OTP sent to +91 ${normalized.slice(0, 2)}XXXXXX${normalized.slice(-2)}`;

        return NextResponse.json({ success: true, message: delivery });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
