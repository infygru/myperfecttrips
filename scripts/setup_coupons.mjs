/**
 * setup_coupons.mjs
 * Creates the `coupons` and `coupon_usages` Directus collections,
 * and adds coupon fields to the existing `bookings` collection.
 *
 * Run: node scripts/setup_coupons.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ─────────────────────────────────────────────────────────
let ADMIN_TOKEN = '';
let DIRECTUS_URL = 'https://api.igholidays.com';

try {
    const env = readFileSync(join(__dirname, '..', '.env.local'), 'utf8');
    for (const line of env.split('\n')) {
        const eqIdx = line.indexOf('=');
        if (eqIdx === -1) continue;
        const key   = line.slice(0, eqIdx).trim();
        const value = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (key === 'DIRECTUS_ADMIN_TOKEN')      ADMIN_TOKEN  = value;
        if (key === 'NEXT_PUBLIC_DIRECTUS_URL')  DIRECTUS_URL = value;
    }
} catch {}

if (!ADMIN_TOKEN) { console.error('Missing DIRECTUS_ADMIN_TOKEN in .env.local'); process.exit(1); }

// ── Helpers ──────────────────────────────────────────────────────────────────
const headers = { Authorization: `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' };

async function d(path, opts = {}) {
    const res  = await fetch(`${DIRECTUS_URL}${path}`, { ...opts, headers });
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }
    return { ok: res.ok, status: res.status, body };
}

async function collectionExists(name) {
    const { ok, body } = await d(`/collections/${name}`);
    return ok && body?.data?.collection === name;
}

async function fieldExists(collection, field) {
    const { ok, body } = await d(`/fields/${collection}/${field}`);
    return ok && body?.data?.field === field;
}

async function createField(collection, spec) {
    if (await fieldExists(collection, spec.field)) {
        console.log(`  ~ field already exists: ${spec.field}`);
        return;
    }
    const { ok, body } = await d(`/fields/${collection}`, {
        method: 'POST',
        body: JSON.stringify(spec),
    });
    if (ok) {
        console.log(`  ✓ field: ${spec.field}`);
    } else {
        console.error(`  ✗ field: ${spec.field}`, body?.errors?.[0]?.message || body);
    }
}

// ── Create coupons collection ────────────────────────────────────────────────
async function setupCouponsCollection() {
    console.log('\n[coupons] collection');

    if (await collectionExists('coupons')) {
        console.log('  ~ collection already exists — skipping creation');
    } else {
        const { ok, body } = await d('/collections', {
            method: 'POST',
            body: JSON.stringify({
                collection: 'coupons',
                meta: {
                    icon: 'local_offer',
                    display_template: '{{code}} — {{type}} {{value}}',
                    singleton: false,
                },
                schema: { name: 'coupons', comment: 'Discount coupon definitions' },
            }),
        });
        if (ok) console.log('  ✓ collection created');
        else { console.error('  ✗ create collection', body?.errors?.[0]?.message); return; }
    }

    await createField('coupons', {
        field: 'code',
        type: 'string',
        schema: { is_nullable: false, is_unique: true, max_length: 50 },
        meta: { interface: 'input', display: 'raw', required: true, note: 'Uppercase alphanumeric, e.g. SAVE20' },
    });

    await createField('coupons', {
        field: 'description',
        type: 'string',
        schema: { is_nullable: true, max_length: 255 },
        meta: { interface: 'input', display: 'raw', note: 'Short customer-facing message shown after coupon is applied' },
    });

    await createField('coupons', {
        field: 'type',
        type: 'string',
        schema: { is_nullable: false, max_length: 20 },
        meta: {
            interface: 'select-dropdown',
            display: 'labels',
            required: true,
            options: {
                choices: [
                    { text: 'Percentage (%)', value: 'percentage' },
                    { text: 'Fixed Amount (₹)', value: 'fixed' },
                ],
            },
        },
    });

    await createField('coupons', {
        field: 'value',
        type: 'decimal',
        schema: { is_nullable: false, numeric_precision: 10, numeric_scale: 2 },
        meta: { interface: 'input', display: 'raw', required: true, note: 'Percentage (0–100) or fixed INR amount' },
    });

    await createField('coupons', {
        field: 'min_order_amount',
        type: 'decimal',
        schema: { is_nullable: true, numeric_precision: 10, numeric_scale: 2 },
        meta: { interface: 'input', display: 'raw', note: 'Minimum cart value in ₹ required to apply this coupon' },
    });

    await createField('coupons', {
        field: 'max_discount_amount',
        type: 'decimal',
        schema: { is_nullable: true, numeric_precision: 10, numeric_scale: 2 },
        meta: { interface: 'input', display: 'raw', note: 'Max discount cap in ₹ (for percentage coupons)' },
    });

    await createField('coupons', {
        field: 'usage_limit',
        type: 'integer',
        schema: { is_nullable: true },
        meta: { interface: 'input', display: 'raw', note: 'Total redemptions allowed (leave empty for unlimited)' },
    });

    await createField('coupons', {
        field: 'usage_count',
        type: 'integer',
        schema: { is_nullable: false, default_value: 0 },
        meta: { interface: 'input', display: 'raw', readonly: true, note: 'Auto-incremented on each successful redemption' },
    });

    await createField('coupons', {
        field: 'per_user_limit',
        type: 'integer',
        schema: { is_nullable: false, default_value: 1 },
        meta: { interface: 'input', display: 'raw', note: 'Max times a single user can use this coupon (0 = unlimited)' },
    });

    await createField('coupons', {
        field: 'valid_from',
        type: 'dateTime',
        schema: { is_nullable: true },
        meta: { interface: 'datetime', display: 'datetime', note: 'Coupon activation date/time (leave empty = active immediately)' },
    });

    await createField('coupons', {
        field: 'valid_until',
        type: 'dateTime',
        schema: { is_nullable: true },
        meta: { interface: 'datetime', display: 'datetime', note: 'Coupon expiry date/time (leave empty = never expires)' },
    });

    await createField('coupons', {
        field: 'is_active',
        type: 'boolean',
        schema: { is_nullable: false, default_value: true },
        meta: { interface: 'boolean', display: 'boolean' },
    });

    await createField('coupons', {
        field: 'applicable_packages',
        type: 'json',
        schema: { is_nullable: true },
        meta: {
            interface: 'tags',
            display: 'labels',
            note: 'Package slugs this coupon applies to (leave empty = all packages)',
        },
    });

    await createField('coupons', {
        field: 'date_created',
        type: 'timestamp',
        schema: { is_nullable: true },
        meta: { interface: 'datetime', display: 'datetime', readonly: true, special: ['date-created'], hidden: true },
    });

    await createField('coupons', {
        field: 'date_updated',
        type: 'timestamp',
        schema: { is_nullable: true },
        meta: { interface: 'datetime', display: 'datetime', readonly: true, special: ['date-updated'], hidden: true },
    });

    console.log('  ✓ coupons collection ready');
}

// ── Create coupon_usages collection ──────────────────────────────────────────
async function setupCouponUsagesCollection() {
    console.log('\n[coupon_usages] collection');

    if (await collectionExists('coupon_usages')) {
        console.log('  ~ collection already exists — skipping creation');
    } else {
        const { ok, body } = await d('/collections', {
            method: 'POST',
            body: JSON.stringify({
                collection: 'coupon_usages',
                meta: {
                    icon: 'receipt_long',
                    display_template: '{{coupon_code}} — user {{user_id}}',
                    singleton: false,
                },
                schema: { name: 'coupon_usages', comment: 'Tracks per-user coupon redemptions' },
            }),
        });
        if (ok) console.log('  ✓ collection created');
        else { console.error('  ✗ create collection', body?.errors?.[0]?.message); return; }
    }

    await createField('coupon_usages', {
        field: 'coupon_id',
        type: 'string',
        schema: { is_nullable: false, max_length: 36 },
        meta: { interface: 'input', display: 'raw', required: true, note: 'UUID of the coupon record' },
    });

    await createField('coupon_usages', {
        field: 'coupon_code',
        type: 'string',
        schema: { is_nullable: false, max_length: 50 },
        meta: { interface: 'input', display: 'raw' },
    });

    await createField('coupon_usages', {
        field: 'user_id',
        type: 'string',
        schema: { is_nullable: false, max_length: 36 },
        meta: { interface: 'input', display: 'raw', required: true },
    });

    await createField('coupon_usages', {
        field: 'booking_id',
        type: 'integer',
        schema: { is_nullable: false },
        meta: { interface: 'input', display: 'raw', required: true },
    });

    await createField('coupon_usages', {
        field: 'discount_amount',
        type: 'decimal',
        schema: { is_nullable: false, numeric_precision: 10, numeric_scale: 2 },
        meta: { interface: 'input', display: 'raw' },
    });

    await createField('coupon_usages', {
        field: 'date_created',
        type: 'timestamp',
        schema: { is_nullable: true },
        meta: { interface: 'datetime', display: 'datetime', readonly: true, special: ['date-created'], hidden: true },
    });

    console.log('  ✓ coupon_usages collection ready');
}

// ── Add coupon fields to bookings ─────────────────────────────────────────────
async function migrateBookingsCollection() {
    console.log('\n[bookings] coupon fields migration');

    if (!(await collectionExists('bookings'))) {
        console.log('  ✗ bookings collection does not exist — run setup_bookings.mjs first');
        return;
    }

    await createField('bookings', {
        field: 'coupon_code',
        type: 'string',
        schema: { is_nullable: true, max_length: 50 },
        meta: { interface: 'input', display: 'raw', note: 'Coupon code applied at checkout' },
    });

    await createField('bookings', {
        field: 'coupon_id',
        type: 'string',
        schema: { is_nullable: true, max_length: 36 },
        meta: { interface: 'input', display: 'raw', hidden: true },
    });

    await createField('bookings', {
        field: 'coupon_discount',
        type: 'decimal',
        schema: { is_nullable: true, numeric_precision: 10, numeric_scale: 2, default_value: 0 },
        meta: { interface: 'input', display: 'raw', note: 'Discount amount applied via coupon (₹)' },
    });

    console.log('  ✓ bookings migration complete');
}

// ── Seed a demo coupon ────────────────────────────────────────────────────────
async function seedDemoCoupon() {
    console.log('\n[seed] demo coupon WELCOME10');

    const { ok: checkOk, body: checkBody } = await d(
        '/items/coupons?filter[code][_eq]=WELCOME10&limit=1'
    );
    if (checkOk && checkBody?.data?.length > 0) {
        console.log('  ~ WELCOME10 already exists — skipping');
        return;
    }

    const now = new Date().toISOString();
    const oneYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    const { ok, body } = await d('/items/coupons', {
        method: 'POST',
        body: JSON.stringify({
            code: 'WELCOME10',
            description: 'Welcome offer! 10% off your first booking',
            type: 'percentage',
            value: 10,
            min_order_amount: 5000,
            max_discount_amount: 5000,
            usage_limit: null,
            per_user_limit: 1,
            valid_from: now,
            valid_until: oneYear,
            is_active: true,
            applicable_packages: null,
        }),
    });

    if (ok) console.log('  ✓ WELCOME10 seeded');
    else console.error('  ✗ seed failed', body?.errors?.[0]?.message || body);
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log(`Connecting to ${DIRECTUS_URL}…`);

await setupCouponsCollection();
await setupCouponUsagesCollection();
await migrateBookingsCollection();
await seedDemoCoupon();

console.log('\nDone! Coupon system is ready.');
console.log('Demo coupon: WELCOME10 (10% off, max ₹5,000, per user once, min order ₹5,000)');
