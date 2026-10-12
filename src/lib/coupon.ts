/**
 * Server-side coupon validation utilities.
 * Only import this in API routes / server components — never in client code.
 */
import { adminFetch } from '@/lib/auth';

export interface CouponValidationResult {
    valid: boolean;
    message: string;
    couponId?: string;
    code?: string;
    type?: 'percentage' | 'fixed';
    value?: number;
    discountAmount?: number;
}

/**
 * Validates a coupon code and returns the discount amount.
 *
 * @param code        Raw coupon code (normalised to UPPERCASE internally)
 * @param subtotal    Pre-discount cart total in INR
 * @param packageSlug Package slug being booked
 * @param userId      Directus user UUID (for per-user limit check)
 */
export async function validateCoupon(
    code: string,
    subtotal: number,
    packageSlug: string,
    userId: string,
): Promise<CouponValidationResult> {
    const normalised = code.trim().toUpperCase();
    if (!normalised) return { valid: false, message: 'Please enter a coupon code' };

    // ── Fetch coupon ─────────────────────────────────────────────────────────
    const couponRes = await adminFetch(
        `/items/coupons?filter[code][_eq]=${encodeURIComponent(normalised)}&filter[is_active][_eq]=true&limit=1`
    );
    const couponData = await couponRes.json();
    const coupon = couponData?.data?.[0];

    if (!coupon) {
        return { valid: false, message: 'Invalid or expired coupon code' };
    }

    // ── Date range check ─────────────────────────────────────────────────────
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        return { valid: false, message: 'This coupon is not yet active' };
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        return { valid: false, message: 'This coupon has expired' };
    }

    // ── Global usage limit ───────────────────────────────────────────────────
    if (coupon.usage_limit != null && Number(coupon.usage_count) >= Number(coupon.usage_limit)) {
        return { valid: false, message: 'This coupon has reached its usage limit' };
    }

    // ── Per-user limit ───────────────────────────────────────────────────────
    const perUserLimit = Number(coupon.per_user_limit ?? 1);
    if (perUserLimit > 0) {
        const usageRes = await adminFetch(
            `/items/coupon_usages?filter[coupon_id][_eq]=${encodeURIComponent(coupon.id)}&filter[user_id][_eq]=${encodeURIComponent(userId)}&limit=100`
        );
        const usageData = await usageRes.json();
        const userUsageCount = usageData?.data?.length ?? 0;
        if (userUsageCount >= perUserLimit) {
            return { valid: false, message: 'You have already used this coupon' };
        }
    }

    // ── Minimum order amount ─────────────────────────────────────────────────
    const minOrder = Number(coupon.min_order_amount ?? 0);
    if (minOrder > 0 && subtotal < minOrder) {
        return {
            valid: false,
            message: `Minimum booking value of ₹${minOrder.toLocaleString('en-IN')} required for this coupon`,
        };
    }

    // ── Package restriction ──────────────────────────────────────────────────
    const applicablePackages: string[] | null =
        Array.isArray(coupon.applicable_packages) && coupon.applicable_packages.length > 0
            ? coupon.applicable_packages
            : null;
    if (applicablePackages && !applicablePackages.includes(packageSlug)) {
        return { valid: false, message: 'This coupon is not applicable for this package' };
    }

    // ── Discount calculation ─────────────────────────────────────────────────
    let discountAmount = 0;
    const couponValue  = Number(coupon.value);

    if (coupon.type === 'percentage') {
        discountAmount = Math.round(subtotal * (couponValue / 100));
        const cap = coupon.max_discount_amount != null ? Number(coupon.max_discount_amount) : Infinity;
        discountAmount = Math.min(discountAmount, cap);
    } else if (coupon.type === 'fixed') {
        discountAmount = couponValue;
    }

    // Never discount the entire amount (ensure at least ₹1 remains payable)
    discountAmount = Math.max(0, Math.min(discountAmount, subtotal - 1));
    discountAmount = Math.round(discountAmount);

    const displayDiscount = `₹${discountAmount.toLocaleString('en-IN')}`;
    const message =
        coupon.description ||
        (coupon.type === 'percentage'
            ? `${couponValue}% off applied — you save ${displayDiscount}`
            : `Flat ${displayDiscount} off applied`);

    return {
        valid: true,
        message,
        couponId:       coupon.id,
        code:           coupon.code,
        type:           coupon.type,
        value:          couponValue,
        discountAmount,
    };
}

/**
 * Records coupon usage and increments the usage_count counter.
 * Idempotent — checks for existing usage record for the same booking.
 */
export async function recordCouponUsage(
    couponId: string,
    couponCode: string,
    userId: string,
    bookingId: number | string,
    discountAmount: number,
): Promise<void> {
    // Idempotency: check if usage already recorded for this booking
    const existingRes = await adminFetch(
        `/items/coupon_usages?filter[coupon_id][_eq]=${encodeURIComponent(couponId)}&filter[booking_id][_eq]=${bookingId}&limit=1`
    );
    const existingData = await existingRes.json();
    if (existingData?.data?.length > 0) return; // already recorded

    // Create usage record
    await adminFetch('/items/coupon_usages', {
        method: 'POST',
        body: JSON.stringify({ coupon_id: couponId, coupon_code: couponCode, user_id: userId, booking_id: bookingId, discount_amount: discountAmount }),
    });

    // Increment usage_count (read-then-write — acceptable for coupon tracking)
    const couponRes  = await adminFetch(`/items/coupons/${encodeURIComponent(couponId)}?fields=usage_count`);
    const couponBody = await couponRes.json();
    const currentCount = Number(couponBody?.data?.usage_count ?? 0);
    await adminFetch(`/items/coupons/${encodeURIComponent(couponId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ usage_count: currentCount + 1 }),
    });
}
