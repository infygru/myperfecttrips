import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/auth';
import { sendTravelReminderSMS } from '@/lib/sms';

// This endpoint should be called daily by a cron job (e.g., Vercel Cron or an external cron).
// Protect it with a secret header.
const CRON_SECRET = process.env.CRON_SECRET || 'igholidays-cron-secret';

export async function GET(req: NextRequest) {
    // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
    const authHeader = req.headers.get('authorization');
    const bearerSecret = authHeader?.replace('Bearer ', '');
    const querySecret = req.nextUrl.searchParams.get('secret');
    const headerSecret = req.headers.get('x-cron-secret');

    if (bearerSecret !== CRON_SECRET && querySecret !== CRON_SECRET && headerSecret !== CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const reminder7 = new Date(today); reminder7.setDate(today.getDate() + 7);
    const reminder1 = new Date(today); reminder1.setDate(today.getDate() + 1);

    const fmt = (d: Date) => d.toISOString().split('T')[0];

    try {
        // Get bookings with travel dates 7 and 1 days away (confirmed only)
        const [res7, res1] = await Promise.all([
            adminFetch(`/items/bookings?filter[travel_date][_eq]=${fmt(reminder7)}&filter[status][_eq]=confirmed`),
            adminFetch(`/items/bookings?filter[travel_date][_eq]=${fmt(reminder1)}&filter[status][_eq]=confirmed`),
        ]);

        const [data7, data1] = await Promise.all([res7.json(), res1.json()]);
        const bookings7: any[] = data7.data || [];
        const bookings1: any[] = data1.data || [];

        let sent = 0;
        for (const b of bookings7) {
            if (b.user_phone) {
                await sendTravelReminderSMS(
                    b.user_phone,
                    b.user_name?.split(' ')[0] || 'Traveller',
                    b.package_title,
                    7,
                    fmt(reminder7)
                );
                sent++;
            }
        }
        for (const b of bookings1) {
            if (b.user_phone) {
                await sendTravelReminderSMS(
                    b.user_phone,
                    b.user_name?.split(' ')[0] || 'Traveller',
                    b.package_title,
                    1,
                    fmt(reminder1)
                );
                sent++;
            }
        }

        return NextResponse.json({ success: true, sent, bookings7: bookings7.length, bookings1: bookings1.length });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
