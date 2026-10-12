/**
 * Creates the `payment_offers` collection in Directus.
 * Run once: node scripts/setup_offers.mjs
 */

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN  = process.env.DIRECTUS_ADMIN_TOKEN || 'igholidays_admin_token_2026';

async function api(method, path, body) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function main() {
  console.log('Setting up payment_offers collection...\n');

  // 1. Create collection
  const col = await api('POST', '/collections', {
    collection: 'payment_offers',
    meta: {
      collection: 'payment_offers',
      icon: 'local_offer',
      note: 'Active payment gateway promotional offers shown to users',
      display_template: '{{title}}',
      sort_field: 'sort',
    },
    schema: { name: 'payment_offers' },
    fields: [
      {
        field: 'id',
        type: 'integer',
        schema: { is_primary_key: true, has_auto_increment: true, is_nullable: false },
        meta: { hidden: true, readonly: true, interface: 'input', special: null },
      },
    ],
  });
  console.log('Collection:', col?.data?.collection || col?.errors?.[0]?.message || col);

  // 2. Add fields
  const fields = [
    {
      field: 'sort',
      type: 'integer',
      schema: { is_nullable: true },
      meta: { interface: 'input', display: 'raw', hidden: true, special: null },
    },
    {
      field: 'is_active',
      type: 'boolean',
      schema: { is_nullable: false, default_value: true },
      meta: {
        interface: 'boolean',
        display: 'boolean',
        width: 'half',
        note: 'Only active offers are shown to users',
      },
    },
    {
      field: 'payment_method',
      type: 'string',
      schema: { is_nullable: false, max_length: 50 },
      meta: {
        interface: 'select-dropdown',
        display: 'labels',
        width: 'half',
        options: {
          choices: [
            { text: 'All Methods', value: 'all' },
            { text: 'Credit / Debit Card', value: 'card' },
            { text: 'UPI', value: 'upi' },
            { text: 'Net Banking', value: 'netbanking' },
            { text: 'Wallet', value: 'wallet' },
            { text: 'EMI', value: 'emi' },
          ],
        },
        note: 'Payment method this offer applies to',
      },
    },
    {
      field: 'title',
      type: 'string',
      schema: { is_nullable: false, max_length: 120 },
      meta: {
        interface: 'input',
        display: 'raw',
        width: 'full',
        required: true,
        note: 'e.g. "10% off on Credit Cards"',
      },
    },
    {
      field: 'subtitle',
      type: 'string',
      schema: { is_nullable: true, max_length: 200 },
      meta: {
        interface: 'input',
        display: 'raw',
        width: 'full',
        note: 'e.g. "Valid on Visa, Mastercard & RuPay credit cards"',
      },
    },
    {
      field: 'discount_label',
      type: 'string',
      schema: { is_nullable: false, max_length: 30 },
      meta: {
        interface: 'input',
        display: 'raw',
        width: 'half',
        required: true,
        note: 'Bold badge text, e.g. "10% OFF" or "₹200 OFF"',
      },
    },
    {
      field: 'badge_color',
      type: 'string',
      schema: { is_nullable: false, default_value: 'blue', max_length: 20 },
      meta: {
        interface: 'select-dropdown',
        display: 'labels',
        width: 'half',
        options: {
          choices: [
            { text: 'Blue (Card)', value: 'blue' },
            { text: 'Purple (UPI)', value: 'purple' },
            { text: 'Green (Net Banking)', value: 'green' },
            { text: 'Orange (Wallet)', value: 'orange' },
            { text: 'Amber (EMI)', value: 'amber' },
          ],
        },
      },
    },
    {
      field: 'terms',
      type: 'string',
      schema: { is_nullable: true, max_length: 300 },
      meta: {
        interface: 'input',
        display: 'raw',
        width: 'full',
        note: 'Short T&C text shown below the offer, e.g. "Max discount ₹1,000. T&C apply."',
      },
    },
    {
      field: 'valid_until',
      type: 'timestamp',
      schema: { is_nullable: true },
      meta: {
        interface: 'datetime',
        display: 'datetime',
        width: 'half',
        note: 'Leave blank for no expiry',
      },
    },
    {
      field: 'date_created',
      type: 'timestamp',
      schema: { is_nullable: true },
      meta: {
        interface: 'datetime',
        display: 'datetime',
        readonly: true,
        hidden: true,
        special: ['date-created'],
        width: 'half',
      },
    },
    {
      field: 'date_updated',
      type: 'timestamp',
      schema: { is_nullable: true },
      meta: {
        interface: 'datetime',
        display: 'datetime',
        readonly: true,
        hidden: true,
        special: ['date-updated'],
        width: 'half',
      },
    },
  ];

  for (const f of fields) {
    const r = await api('POST', `/fields/payment_offers`, f);
    const ok = r?.data?.field || r?.errors?.[0]?.message;
    console.log(`  field ${f.field}:`, ok || 'ok');
  }

  // 3. Grant public read access
  const publicPolicyId = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17';
  const perm = await api('POST', '/permissions', {
    policy: publicPolicyId,
    collection: 'payment_offers',
    action: 'read',
    fields: ['*'],
    permissions: { is_active: { _eq: true } },
    validation: null,
  });
  console.log('\nPublic read permission:', perm?.data?.id || perm?.errors?.[0]?.message || perm);

  // 4. Seed starter offers
  const seedOffers = [
    {
      is_active: true,
      sort: 1,
      payment_method: 'card',
      title: '10% off on Credit Cards',
      subtitle: 'Valid on Visa, Mastercard & RuPay credit cards',
      discount_label: '10% OFF',
      badge_color: 'blue',
      terms: 'Max discount ₹1,000. Min booking ₹10,000. T&C apply.',
      valid_until: null,
    },
    {
      is_active: true,
      sort: 2,
      payment_method: 'upi',
      title: 'Flat ₹200 off on UPI',
      subtitle: 'Pay via PhonePe, Google Pay, Paytm or any UPI app',
      discount_label: '₹200 OFF',
      badge_color: 'purple',
      terms: 'Min booking ₹5,000. T&C apply.',
      valid_until: null,
    },
    {
      is_active: true,
      sort: 3,
      payment_method: 'netbanking',
      title: '5% cashback on Net Banking',
      subtitle: 'Valid on all major Indian banks',
      discount_label: '5% BACK',
      badge_color: 'green',
      terms: 'Max cashback ₹500. T&C apply.',
      valid_until: null,
    },
    {
      is_active: true,
      sort: 4,
      payment_method: 'emi',
      title: 'No-cost EMI available',
      subtitle: 'Convert your booking to easy monthly instalments',
      discount_label: '0% EMI',
      badge_color: 'amber',
      terms: 'Available on select credit cards at checkout.',
      valid_until: null,
    },
  ];

  console.log('\nSeeding starter offers...');
  for (const offer of seedOffers) {
    const r = await api('POST', '/items/payment_offers', offer);
    console.log(`  "${offer.title}":`, r?.data?.id ? `id=${r.data.id}` : r?.errors?.[0]?.message || 'ok');
  }

  console.log('\nDone! Visit your Directus admin to manage offers at /admin/content/payment_offers');
}

main().catch(console.error);
