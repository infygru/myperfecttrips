/**
 * Fix packages collection fields:
 * 1. Ensure description (Trip Overview) field exists + is visible + input-multiline
 * 2. Change itinerary_days.description → input-multiline (not rich-text)
 *
 * Run: node scripts/fix_package_fields.mjs
 */

const DIRECTUS_URL  = "https://api.igholidays.com";
const ADMIN_EMAIL   = "admin@igholidays.com";
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

async function fieldExists(token, collection, field) {
    const r = await api(token, "GET", `/fields/${collection}/${field}`);
    return r.ok;
}

async function main() {
    console.log("🔑 Authenticating...");
    const token = await getToken();
    console.log("✅ Authenticated\n");

    // ── FIX 1: packages.description (Trip Overview) ──────────────────────────
    console.log("🔧 Fix 1: packages.description (Trip Overview)...");
    const descExists = await fieldExists(token, "packages", "description");

    if (!descExists) {
        const r = await api(token, "POST", "/fields/packages", {
            field: "description",
            type: "text",
            meta: {
                interface: "input-multiline",
                display: "raw",
                hidden: false,
                sort: 13,
                width: "full",
                note: "Trip Overview — shown on the package detail page above the itinerary. Write a compelling summary of the holiday.",
                options: { placeholder: "Describe the holiday experience, highlights, and what makes it special…", rows: 6 },
            },
        });
        if (r.ok) console.log("  ✅ description field created");
        else console.error("  ❌ Failed:", JSON.stringify(r.data?.errors?.[0]?.message || r.data));
    } else {
        // Field exists — just make sure it's visible and has the right interface
        const r = await api(token, "PATCH", "/fields/packages/description", {
            meta: {
                interface: "input-multiline",
                display: "raw",
                hidden: false,
                width: "full",
                sort: 13,
                note: "Trip Overview — shown on the package detail page. Write a compelling summary of the holiday.",
                options: { placeholder: "Describe the holiday experience, highlights, and what makes it special…", rows: 6 },
            },
        });
        if (r.ok) console.log("  ✅ description field updated (made visible, input-multiline)");
        else console.error("  ❌ Failed:", JSON.stringify(r.data?.errors?.[0]?.message || r.data));
    }

    // ── FIX 2: itinerary_days.description → input-multiline ──────────────────
    console.log("\n🔧 Fix 2: itinerary_days.description → input-multiline...");
    const r2 = await api(token, "PATCH", "/fields/itinerary_days/description", {
        meta: {
            interface: "input-multiline",
            display: "raw",
            width: "full",
            sort: 3,
            note: "Full description of the day's activities. Plain text — no HTML needed.",
            options: { placeholder: "Describe the day's activities, sightseeing, meals, transport…", rows: 6 },
        },
    });
    if (r2.ok) console.log("  ✅ itinerary_days.description → input-multiline");
    else console.error("  ❌ Failed:", JSON.stringify(r2.data?.errors?.[0]?.message || r2.data));

    console.log(`
✅ Done! Reload Directus admin to see changes.

packages.description  → "Trip Overview" textarea (plain text, full width)
itinerary_days.description → plain multiline textarea (no rich text toolbar)
`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
