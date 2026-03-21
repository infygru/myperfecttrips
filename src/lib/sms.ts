const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || '';

export async function sendSMS(phone: string, message: string): Promise<boolean> {
    if (!FAST2SMS_API_KEY) {
        console.warn('FAST2SMS_API_KEY not set — skipping SMS');
        return false;
    }

    // Normalize phone: remove +91 prefix, keep 10 digits
    const normalized = phone.replace(/[^0-9]/g, '').slice(-10);

    try {
        const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                authorization: FAST2SMS_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                route: 'q',
                message,
                language: 'english',
                flash: 0,
                numbers: normalized,
            }),
        });

        const data = await res.json();
        if (!data.return) {
            console.error('Fast2SMS error:', data);
        }
        return !!data.return;
    } catch (err) {
        console.error('SMS send failed:', err);
        return false;
    }
}

export async function sendBookingConfirmationSMS(
    phone: string,
    name: string,
    packageTitle: string,
    reference: string,
    travelDate: string
) {
    const msg = `Hi ${name}, your booking for ${packageTitle} is confirmed! Ref: ${reference}. Travel Date: ${travelDate}. Thank you for choosing IG Holidays! - igholidays.com`;
    return sendSMS(phone, msg);
}

export async function sendTravelReminderSMS(
    phone: string,
    name: string,
    packageTitle: string,
    daysLeft: number,
    travelDate: string
) {
    const when = daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`;
    const msg = `Hi ${name}, your trip to ${packageTitle} is ${when} (${travelDate}). We hope you're all packed! Call us at +91 8807709919 for any help. - IG Holidays`;
    return sendSMS(phone, msg);
}

export async function sendBookingCancelledSMS(
    phone: string,
    name: string,
    packageTitle: string,
    reference: string
) {
    const msg = `Hi ${name}, your booking for ${packageTitle} (Ref: ${reference}) has been cancelled. For refunds or queries, call +91 8807709919. - IG Holidays`;
    return sendSMS(phone, msg);
}
