/**
 * Change packages.inclusions and packages.exclusions
 * from rich-text HTML → plain multiline text (one item per line).
 *
 * Admin experience: textarea, one inclusion/exclusion per line.
 * Frontend: split("\n").filter(Boolean) → clean list with tick/cross.
 *
 * NOTE: Existing HTML data in these fields will be cleared.
 *       Re-enter inclusions/exclusions as plain text, one per line.
 *
 * Run: node scripts/fix_inclusions_exclusions.mjs
 */

const DIRECTUS_URL = "https://api.igholidays.com";
const ADMIN_EMAIL  = "admin@igholidays.com";
const ADMIN_PASSWORD = "e4HiSzm3PsFhR3mA6Uh7YoU2uqjOHrF3";

async function getToken() {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const data = await res.json();
    if (!data.data?.access_token) throw new Error("Auth failed: " + JSON.stringify(data));
    return data.data.access_token;
}

async function api(token, method, path, body) {
    const res = await fetch(`${DIRECTUS_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
    catch { return { ok: res.ok, status: res.status, data: text }; }
}

async function main() {
    console.log("🔑 Authenticating...");
    const token = await getToken();
    console.log("✅ Authenticated\n");

    const fields = [
        {
            field: "inclusions",
            label: "Inclusions",
            note: "What's included — one item per line.\nExample:\nHandpicked Premium Accommodation\nDaily Breakfast & Select Meals\nAll Airport & Hotel Transfers",
        },
        {
            field: "exclusions",
            label: "Exclusions",
            note: "What's NOT included — one item per line.\nExample:\nInternational / Domestic Flights\nVisa Fees & Documentation\nPersonal & Shopping Expenses",
        },
    ];

    for (const { field, label, note } of fields) {
        console.log(`🔧 Updating packages.${field} → input-multiline (one item per line)...`);

        const r = await api(token, "PATCH", `/fields/packages/${field}`, {
            type: "text",
            meta: {
                interface: "input-multiline",
                display: "raw",
                note,
                width: "half",
                options: {
                    placeholder: `Enter each ${label.toLowerCase().slice(0, -1)} on a new line…`,
                    rows: 8,
                },
            },
        });

        if (r.ok) {
            console.log(`  ✅ ${field} updated to input-multiline`);
        } else {
            console.error(`  ❌ ${field} failed:`, JSON.stringify(r.data?.errors?.[0]?.message || r.data));
        }
    }

    console.log(`
✅ Done!

How to use in Directus admin:
  • Open any package → scroll to Inclusions / Exclusions fields
  • Type one item per line, e.g.:
      Handpicked Premium Accommodation
      Daily Breakfast & Select Meals
      All Airport & Hotel Transfers

The frontend will automatically split by line and render as
a clean ✓ / ✗ list. No HTML needed.
`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
