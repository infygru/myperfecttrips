/**
 * Sets up bookings and payments collections in Directus.
 * Run: node scripts/setup_bookings.mjs
 *
 * Requires DIRECTUS_ADMIN_TOKEN in .env.local
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
    envContent.split('\n').filter(l => l.includes('=')).map(l => {
        const [k, ...v] = l.split('=');
        return [k.trim(), v.join('=').trim()];
    })
);

const BASE_URL = env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const TOKEN = env.DIRECTUS_ADMIN_TOKEN;

if (!TOKEN || TOKEN === 'your_directus_admin_token_here') {
    console.error('❌ DIRECTUS_ADMIN_TOKEN not set in .env.local');
    console.log('   Go to Directus Admin → Settings → API Tokens → Create Token with admin role');
    process.exit(1);
}

async function api(path, method = 'GET', body = null) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const text = await res.text();
    try {
        return { ok: res.ok, status: res.status, data: JSON.parse(text) };
    } catch {
        return { ok: res.ok, status: res.status, data: text };
    }
}

async function createCollection(name, fields, meta = {}) {
    console.log(`\n📦 Creating collection: ${name}`);

    // Check if exists
    const check = await api(`/collections/${name}`);
    if (check.ok) {
        console.log(`   ⏭  Already exists — skipping`);
        return;
    }

    const res = await api('/collections', 'POST', {
        collection: name,
        meta: {
            icon: 'receipt',
            note: '',
            display_template: null,
            ...meta,
        },
        schema: {},
        fields: [
            {
                field: 'id',
                type: 'integer',
                meta: { hidden: true, readonly: true, interface: 'input', special: ['cast-to-integer'] },
                schema: { is_primary_key: true, has_auto_increment: true },
            },
            ...fields,
        ],
    });

    if (res.ok) {
        console.log(`   ✅ Created`);
    } else {
        console.error(`   ❌ Failed:`, res.data?.errors?.[0]?.message || res.data);
    }
}

async function addField(collection, field) {
    const check = await api(`/fields/${collection}/${field.field}`);
    if (check.ok) {
        console.log(`   ⏭  Field ${field.field} exists`);
        return;
    }
    const res = await api(`/fields/${collection}`, 'POST', field);
    if (res.ok) {
        console.log(`   ✅ Field ${field.field} added`);
    } else {
        console.error(`   ❌ Field ${field.field} failed:`, res.data?.errors?.[0]?.message);
    }
}

async function setPermission(collection, action, policy) {
    await api('/permissions', 'POST', {
        policy,
        collection,
        action,
        fields: ['*'],
        permissions: {},
        validation: {},
    });
}

// Public policy
const PUBLIC_POLICY = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17';

const bookingFields = [
    { field: 'user_id', type: 'string', meta: { interface: 'input', note: 'Directus user UUID' }, schema: {} },
    { field: 'user_name', type: 'string', meta: { interface: 'input' }, schema: {} },
    { field: 'user_email', type: 'string', meta: { interface: 'input' }, schema: {} },
    { field: 'user_phone', type: 'string', meta: { interface: 'input' }, schema: { is_nullable: true } },
    { field: 'package_id', type: 'string', meta: { interface: 'input' }, schema: { is_nullable: true } },
    { field: 'package_title', type: 'string', meta: { interface: 'input' }, schema: {} },
    { field: 'package_slug', type: 'string', meta: { interface: 'input' }, schema: { is_nullable: true } },
    { field: 'travel_date', type: 'date', meta: { interface: 'datetime' }, schema: { is_nullable: true } },
    { field: 'num_adults', type: 'integer', meta: { interface: 'input' }, schema: { default_value: 1 } },
    { field: 'num_children', type: 'integer', meta: { interface: 'input' }, schema: { default_value: 0 } },
    { field: 'total_amount', type: 'decimal', meta: { interface: 'input' }, schema: { numeric_precision: 10, numeric_scale: 2 } },
    {
        field: 'status',
        type: 'string',
        meta: {
            interface: 'select-dropdown',
            options: { choices: [{ text: 'Pending', value: 'pending' }, { text: 'Confirmed', value: 'confirmed' }, { text: 'Cancelled', value: 'cancelled' }, { text: 'Completed', value: 'completed' }] },
        },
        schema: { default_value: 'pending' },
    },
    {
        field: 'payment_status',
        type: 'string',
        meta: {
            interface: 'select-dropdown',
            options: { choices: [{ text: 'Pending', value: 'pending' }, { text: 'Paid', value: 'paid' }, { text: 'Failed', value: 'failed' }, { text: 'Refunded', value: 'refunded' }] },
        },
        schema: { default_value: 'pending' },
    },
    { field: 'paytm_order_id', type: 'string', meta: { interface: 'input' }, schema: { is_nullable: true } },
    { field: 'paytm_txn_id', type: 'string', meta: { interface: 'input' }, schema: { is_nullable: true } },
    { field: 'reference_number', type: 'string', meta: { interface: 'input' }, schema: { is_nullable: true } },
    { field: 'special_requests', type: 'text', meta: { interface: 'input-multiline' }, schema: { is_nullable: true } },
    {
        field: 'date_created',
        type: 'timestamp',
        meta: { readonly: true, hidden: false, special: ['date-created'], interface: 'datetime' },
        schema: { is_nullable: true },
    },
    {
        field: 'date_updated',
        type: 'timestamp',
        meta: { readonly: true, hidden: false, special: ['date-updated'], interface: 'datetime' },
        schema: { is_nullable: true },
    },
];

const paymentFields = [
    { field: 'booking_id', type: 'string', meta: { interface: 'input' }, schema: {} },
    { field: 'amount', type: 'decimal', meta: { interface: 'input' }, schema: { numeric_precision: 10, numeric_scale: 2 } },
    { field: 'currency', type: 'string', meta: { interface: 'input' }, schema: { default_value: 'INR' } },
    { field: 'gateway', type: 'string', meta: { interface: 'input' }, schema: { default_value: 'paytm' } },
    { field: 'transaction_id', type: 'string', meta: { interface: 'input' }, schema: { is_nullable: true } },
    { field: 'order_id', type: 'string', meta: { interface: 'input' }, schema: { is_nullable: true } },
    {
        field: 'status',
        type: 'string',
        meta: {
            interface: 'select-dropdown',
            options: { choices: [{ text: 'Pending', value: 'pending' }, { text: 'Success', value: 'success' }, { text: 'Failed', value: 'failed' }] },
        },
        schema: { default_value: 'pending' },
    },
    { field: 'gateway_response', type: 'json', meta: { interface: 'input-code', options: { language: 'json' } }, schema: { is_nullable: true } },
    {
        field: 'date_created',
        type: 'timestamp',
        meta: { readonly: true, special: ['date-created'], interface: 'datetime' },
        schema: { is_nullable: true },
    },
];

console.log('🚀 My Perfect Trips — Setting up bookings & payments collections');
console.log(`   API: ${BASE_URL}`);

await createCollection('bookings', bookingFields, {
    icon: 'receipt_long',
    display_template: '{{package_title}} — {{user_name}} ({{status}})',
});

await createCollection('payments', paymentFields, {
    icon: 'payments',
    display_template: '₹{{amount}} — {{status}} — {{order_id}}',
});

// Public create permission for bookings (authenticated users via API; handled server-side)
// For the admin panel, no public permissions needed (all done via admin token on server)
console.log('\n✅ Setup complete!');
console.log('\n📝 Next steps:');
console.log('   1. Go to Directus Admin → Data Model → bookings');
console.log('   2. The collections should now be visible');
console.log('   3. No public permissions needed (server uses admin token for these collections)');
