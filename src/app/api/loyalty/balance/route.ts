import { NextRequest, NextResponse } from 'next/server';
import { getUserLoyaltyBalance, getLoyaltyTransactions } from '@/lib/loyalty';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!userRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: user } = await userRes.json();

        const [balance, transactions] = await Promise.all([
            getUserLoyaltyBalance(user.id),
            getLoyaltyTransactions(user.id, 5),
        ]);

        return NextResponse.json({ balance, transactions });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
