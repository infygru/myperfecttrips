import { adminFetch } from './auth';
export { MIN_REDEEM, POINT_VALUE, POINTS_PER_RUPEE } from './loyalty-constants';

export function calculatePointsEarned(amount: number): number {
    return Math.floor(amount / 100);
}

export function pointsToRupees(points: number): number {
    return points * POINT_VALUE;
}

export async function getUserLoyaltyBalance(userId: string): Promise<number> {
    try {
        const res = await adminFetch(
            `/items/loyalty_transactions?filter[user_id][_eq]=${userId}&limit=-1&fields[]=type&fields[]=points`
        );
        const data = await res.json();
        const transactions: any[] = data.data || [];
        return transactions.reduce((sum, t) => {
            if (t.type === 'earned') return sum + (t.points || 0);
            if (t.type === 'redeemed') return sum - (t.points || 0);
            return sum;
        }, 0);
    } catch {
        return 0;
    }
}

export async function getLoyaltyTransactions(userId: string, limit = 10): Promise<any[]> {
    try {
        const res = await adminFetch(
            `/items/loyalty_transactions?filter[user_id][_eq]=${userId}&sort[]=-date_created&limit=${limit}`
        );
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

export async function awardPoints(
    userId: string,
    bookingId: string,
    amount: number,
    packageTitle: string
): Promise<number> {
    const points = calculatePointsEarned(amount);
    if (points <= 0) return 0;
    await adminFetch('/items/loyalty_transactions', {
        method: 'POST',
        body: JSON.stringify({
            user_id: userId,
            booking_id: bookingId,
            type: 'earned',
            points,
            description: `Earned for booking: ${packageTitle}`,
        }),
    });
    return points;
}

export async function redeemPoints(
    userId: string,
    bookingId: string,
    points: number,
    packageTitle: string
): Promise<void> {
    await adminFetch('/items/loyalty_transactions', {
        method: 'POST',
        body: JSON.stringify({
            user_id: userId,
            booking_id: bookingId,
            type: 'redeemed',
            points,
            description: `Redeemed for booking: ${packageTitle}`,
        }),
    });
}
