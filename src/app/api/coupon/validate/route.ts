import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupon';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ valid: false, message: 'Unauthorized' }, { status: 401 });

    try {
        // Verify user identity
        const meRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!meRes.ok) return NextResponse.json({ valid: false, message: 'Unauthorized' }, { status: 401 });
        const userId = (await meRes.json()).data?.id;
        if (!userId) return NextResponse.json({ valid: false, message: 'Unauthorized' }, { status: 401 });

        const { code, subtotal, packageSlug } = await req.json();

        if (!code || !subtotal || !packageSlug) {
            return NextResponse.json({ valid: false, message: 'Missing required fields' }, { status: 400 });
        }

        const result = await validateCoupon(String(code), Number(subtotal), String(packageSlug), userId);
        return NextResponse.json(result);
    } catch (err: any) {
        console.error('[coupon/validate]', err);
        return NextResponse.json({ valid: false, message: 'Could not validate coupon. Please try again.' }, { status: 500 });
    }
}
