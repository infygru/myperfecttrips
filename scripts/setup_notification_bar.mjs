/**
 * Creates the `notification_bar` collection in Directus.
 * Run once: node scripts/setup_notification_bar.mjs
 */

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN  = process.env.DIRECTUS_ADMIN_TOKEN   || 'igholidays_admin_token_2026';

async function api(method, path, body) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function main() {
  console.log('Setting up notification_bar collection...\n');

  // 1. Create collection
  const col = await api('POST', '/collections', {
    collection: 'notification_bar',
    meta: {
      collection: 'notification_bar',
      icon: 'notifications',
      note: 'Site-wide notification/promo bar shown at the top of every page. Only the first active record is shown.',
      display_template: '{{text}}',
    },
    schema: { name: 'notification_bar' },
    fields: [
      {
        field: 'id',
        type: 'integer',
        schema: { is_primary_key: true, has_auto_increment: true, is_nullable: false },
        meta: { hidden: true, readonly: true, interface: 'input' },
      },
    ],
  });
  console.log('Collection:', col?.data?.collection || col?.errors?.[0]?.message);

  // 2. Fields
  const fields = [
    {
      field: 'is_active',
      type: 'boolean',
      schema: { is_nullable: false, default_value: true },
      meta: { interface: 'boolean', display: 'boolean', width: 'half', note: 'Toggle bar on/off instantly' },
    },
    {
      field: 'is_dismissible',
      type: 'boolean',
      schema: { is_nullable: false, default_value: true },
      meta: { interface: 'boolean', display: 'boolean', width: 'half', note: 'Show a close (×) button to users' },
    },
    {
      field: 'text',
      type: 'string',
      schema: { is_nullable: false, max_length: 300 },
      meta: { interface: 'input', display: 'raw', width: 'full', required: true, note: 'Main notification text, e.g. "Limited time: 10% off on UPI payments 🎉"' },
    },
    {
      field: 'url',
      type: 'string',
      schema: { is_nullable: true, max_length: 500 },
      meta: { interface: 'input', display: 'raw', width: 'half', note: 'Optional link URL. Use /packages for internal pages.' },
    },
    {
      field: 'url_label',
      type: 'string',
      schema: { is_nullable: true, max_length: 60 },
      meta: { interface: 'input', display: 'raw', width: 'half', note: 'CTA label, e.g. "View Offers" (only shown if URL is set)' },
    },
    {
      field: 'bg_color',
      type: 'string',
      schema: { is_nullable: false, default_value: 'gold', max_length: 20 },
      meta: {
        interface: 'select-dropdown',
        display: 'labels',
        width: 'half',
        options: {
          choices: [
            { text: 'Gold / Amber (offers)', value: 'gold' },
            { text: 'Brand Dark (general)', value: 'brand' },
            { text: 'Green (positive news)', value: 'green' },
            { text: 'Red (urgent)', value: 'red' },
            { text: 'Blue (info)', value: 'blue' },
          ],
        },
      },
    },
    {
      field: 'date_updated',
      type: 'timestamp',
      schema: { is_nullable: true },
      meta: { interface: 'datetime', readonly: true, hidden: true, special: ['date-updated'], width: 'half' },
    },
  ];

  for (const f of fields) {
    const r = await api('POST', `/fields/notification_bar`, f);
    console.log(`  field ${f.field}:`, r?.data?.field || r?.errors?.[0]?.message || 'ok');
  }

  // 3. Public read permission (only active records)
  const publicPolicyId = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17';
  const perm = await api('POST', '/permissions', {
    policy: publicPolicyId,
    collection: 'notification_bar',
    action: 'read',
    fields: ['*'],
    permissions: { is_active: { _eq: true } },
    validation: null,
  });
  console.log('\nPublic read permission:', perm?.data?.id || perm?.errors?.[0]?.message);

  // 4. Seed one starter bar
  const seed = await api('POST', '/items/notification_bar', {
    is_active: true,
    is_dismissible: true,
    text: '🎉 Limited time: Pay via UPI and get ₹200 off on your next holiday booking!',
    url: '/packages',
    url_label: 'Explore Packages',
    bg_color: 'gold',
  });
  console.log('\nSeeded bar id:', seed?.data?.id || seed?.errors?.[0]?.message);
  console.log('\nDone! Manage at /admin/content/notification_bar');
}

main().catch(console.error);
