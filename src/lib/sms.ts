const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || '';
const TWOFACTOR_API_KEY = process.env.TWOFACTOR_API_KEY || '';

// Normalize phone to 10 digits (India)
function normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '').slice(-10);
}

// ── OTP via 2Factor.in (free, 10K/month) ─────────────────────────────────────
// Returns session_id used later for verification, or null on failure
export async function send2FactorOTP(phone: string): Promise<string | null> {
    if (!TWOFACTOR_API_KEY) return null;
    const normalized = normalizePhone(phone);
    try {
        const res = await fetch(
            `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/${normalized}/AUTOGEN`,
            { method: 'GET' }
        );
        const data = await res.json();
        if (data.Status === 'Success') return data.Details; // session_id
        console.error('2Factor OTP error:', data);
        return null;
    } catch (err) {
        console.error('2Factor send failed:', err);
        return null;
    }
}

export async function verify2FactorOTP(sessionId: string, otp: string): Promise<boolean> {
    if (!TWOFACTOR_API_KEY) return false;
    try {
        const res = await fetch(
            `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`,
            { method: 'GET' }
        );
        const data = await res.json();
        return data.Status === 'Success';
    } catch (err) {
        console.error('2Factor verify failed:', err);
        return false;
    }
}

// ── Generic SMS via Fast2SMS (requires 100 INR recharge) ─────────────────────
export async function sendSMS(phone: string, message: string): Promise<boolean> {
    if (!FAST2SMS_API_KEY) {
        console.warn('[SMS] FAST2SMS_API_KEY not set — skipping SMS');
        return false;
    }
    const normalized = normalizePhone(phone);
    try {
        const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: { authorization: FAST2SMS_API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ route: 'q', message, language: 'english', flash: 0, numbers: normalized }),
        });
        const data = await res.json();
        if (!data.return) console.error('[Fast2SMS] error:', data);
        return !!data.return;
    } catch (err) {
        console.error('[SMS] send failed:', err);
        return false;
    }
}

export async function sendBookingConfirmationSMS(
    phone: string, name: string, packageTitle: string, reference: string, travelDate: string
) {
    const msg = `Hi ${name}, your booking for ${packageTitle} is confirmed! Ref: ${reference}. Travel Date: ${travelDate}. Thank you for choosing IG Holidays! - igholidays.com`;
    return sendSMS(phone, msg);
}

export async function sendTravelReminderSMS(
    phone: string, name: string, packageTitle: string, daysLeft: number, travelDate: string
) {
    const when = daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`;
    const msg = `Hi ${name}, your trip to ${packageTitle} is ${when} (${travelDate}). Call +91 8807709919 for help. - IG Holidays`;
    return sendSMS(phone, msg);
}

export async function sendBookingCancelledSMS(
    phone: string, name: string, packageTitle: string, reference: string
) {
    const msg = `Hi ${name}, your booking for ${packageTitle} (Ref: ${reference}) has been cancelled. Call +91 8807709919 for refunds. - IG Holidays`;
    return sendSMS(phone, msg);
}
