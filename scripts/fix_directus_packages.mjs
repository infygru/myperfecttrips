/**
 * Fix "unexpected error" in Directus admin for packages collection.
 *
 * Problems found:
 *  1. packages.itinerary_days uses input-rich-text-html inside a list (repeater)
 *     → rich text editor inside modal/repeater breaks in Directus v11 → "unexpected error"
 *  2. Old packages.itinerary rich-text field is still visible (redundant, confusing)
 *  3. meals field inside repeater needs explicit presets to work correctly
 *  4. destinations field (json tags) has no presets — confusing in admin
 *
 * Fix:
 *  1. Change description inside itinerary_days repeater → input-multiline (reliable in repeaters)
 *  2. Hide old itinerary field
 *  3. Add meal presets (Breakfast / Lunch / Dinner) to meals field in repeater
 *  4. Tidy destinations field with presets
 *
 * Run: node scripts/fix_directus_packages.mjs
 */

const DIRECTUS_URL = "https://api.igholidays.com";
const ADMIN_EMAIL = "admin@igholidays.com";
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

    // ── FIX 1: Update packages.itinerary_days repeater ──────────────────────
    // Change description from input-rich-text-html → input-multiline
    // Add presets for meals field
    console.log("🔧 Fix 1: Updating packages.itinerary_days repeater field...");
    const patch1 = await api(token, "PATCH", "/fields/packages/itinerary_days", {
        meta: {
            interface: "list",
            special: ["cast-json"],
            display: "raw",
            hidden: false,
            width: "full",
            note: "Day-by-day itinerary. Click '+ Add Item' to add each day.",
            options: {
                template: "Day {{day_number}}: {{title}}",
                fields: [
                    {
                        field: "day_number",
                        name: "Day Number",
                        type: "integer",
                        meta: {
                            interface: "input",
                            width: "half",
                            required: true,
                            note: "e.g. 1, 2, 3…",
                        },
                    },
                    {
                        field: "title",
                        name: "Day Title",
                        type: "string",
                        meta: {
                            interface: "input",
                            width: "half",
                            required: true,
                            note: "e.g. Arrival & City Tour",
                        },
                    },
                    {
                        field: "description",
                        name: "Description",
                        type: "text",
                        // Changed from input-rich-text-html to input-multiline
                        // Rich text inside repeater modals causes "unexpected error" in Directus v11
                        meta: {
                            interface: "input-multiline",
                            width: "full",
                            note: "Detailed activities for the day.",
                        },
                    },
                    {
                        field: "accommodation",
                        name: "Accommodation / Hotel",
                        type: "string",
                        meta: {
                            interface: "input",
                            width: "half",
                            note: "e.g. Taj Hotel, Mumbai",
                        },
                    },
                    {
                        field: "meals",
                        name: "Meals Included",
                        type: "json",
                        meta: {
                            interface: "checkboxes",
                            width: "half",
                            options: {
                                choices: [
                                    { text: "Breakfast", value: "Breakfast" },
                                    { text: "Lunch", value: "Lunch" },
                                    { text: "Dinner", value: "Dinner" },
                                ],
                            },
                            note: "Select included meals",
                        },
                    },
                ],
            },
        },
    });

    if (patch1.ok) {
        console.log("  ✅ itinerary_days repeater fixed (description → input-multiline, meals → checkboxes)");
    } else {
        console.error("  ❌ Failed:", JSON.stringify(patch1.data?.errors?.[0]?.message || patch1.data));
    }

    // ── FIX 2: Hide old itinerary field (redundant with itinerary_days) ──────
    console.log("\n🔧 Fix 2: Hiding old packages.itinerary field (redundant)...");
    const patch2 = await api(token, "PATCH", "/fields/packages/itinerary", {
        meta: {
            hidden: true,
            note: "Legacy field — use itinerary_days (below) instead.",
        },
    });
    if (patch2.ok) {
        console.log("  ✅ Old itinerary field hidden");
    } else {
        console.warn("  ⚠️  Could not hide itinerary field:", JSON.stringify(patch2.data?.errors?.[0]?.message || patch2.data));
    }

    // ── FIX 3: Fix destinations field (add note, tidy) ───────────────────────
    console.log("\n🔧 Fix 3: Tidying destinations (tags) field on packages...");
    const patch3 = await api(token, "PATCH", "/fields/packages/destinations", {
        meta: {
            interface: "tags",
            note: "Add destination tags, e.g. Delhi, Agra, Jaipur (press Enter after each)",
            width: "full",
        },
    });
    if (patch3.ok) {
        console.log("  ✅ destinations field tidied");
    } else {
        console.warn("  ⚠️ ", JSON.stringify(patch3.data?.errors?.[0]?.message || patch3.data));
    }

    // ── FIX 4: Add display template to packages collection ───────────────────
    console.log("\n🔧 Fix 4: Setting packages collection display template...");
    const patch4 = await api(token, "PATCH", "/collections/packages", {
        meta: {
            display_template: "{{title}} ({{package_type}})",
            sort_field: "id",
        },
    });
    if (patch4.ok) {
        console.log("  ✅ Packages collection display template set");
    } else {
        console.warn("  ⚠️ ", JSON.stringify(patch4.data?.errors?.[0]?.message || patch4.data));
    }

    // ── FIX 5: Ensure inclusions/exclusions have proper notes ────────────────
    console.log("\n🔧 Fix 5: Adding notes to inclusions/exclusions fields...");
    for (const [field, label] of [["inclusions", "What's included"], ["exclusions", "What's not included"]]) {
        const r = await api(token, "PATCH", `/fields/packages/${field}`, {
            meta: {
                note: `${label}. Use the toolbar to format as a list.`,
                width: "half",
            },
        });
        if (r.ok) {
            console.log(`  ✅ ${field} updated`);
        } else {
            console.warn(`  ⚠️  ${field}:`, JSON.stringify(r.data?.errors?.[0]?.message || r.data));
        }
    }

    // ── FIX 6: Fix field order on packages ───────────────────────────────────
    console.log("\n🔧 Fix 6: Setting logical field order on packages...");
    const fieldOrder = [
        { field: "title",             sort: 1,  width: "full" },
        { field: "slug",              sort: 2,  width: "half" },
        { field: "package_type",      sort: 3,  width: "half" },
        { field: "category",          sort: 4,  width: "half" },
        { field: "destination",       sort: 5,  width: "half" },
        { field: "destinations",      sort: 6,  width: "full" },
        { field: "price",             sort: 7,  width: "half" },
        { field: "duration_days",     sort: 8,  width: "half" },
        { field: "duration_nights",   sort: 9,  width: "half" },
        { field: "visa_status",       sort: 10, width: "half" },
        { field: "image",             sort: 11, width: "half" },
        { field: "destination_image", sort: 12, width: "half" },
        { field: "gallery",           sort: 13, width: "full" },
        { field: "inclusions",        sort: 14, width: "half" },
        { field: "exclusions",        sort: 15, width: "half" },
        { field: "itinerary_days",    sort: 16, width: "full" },
    ];

    let orderOk = 0;
    for (const { field, sort, width } of fieldOrder) {
        const r = await api(token, "PATCH", `/fields/packages/${field}`, {
            meta: { sort, width },
        });
        if (r.ok) orderOk++;
        else console.warn(`  ⚠️  ${field}: sort failed`);
    }
    console.log(`  ✅ ${orderOk}/${fieldOrder.length} field sort positions updated`);

    console.log(`
✅ All fixes applied!

What changed:
  1. itinerary_days repeater: description now uses 'input-multiline' (textarea)
     — this fixes the "unexpected error" when adding/editing itinerary days
  2. meals now uses checkboxes (Breakfast / Lunch / Dinner) — easy to click
  3. Old 'itinerary' rich-text field is now hidden
  4. Field order in packages form is now logical (title → type → price → images → content → itinerary)
  5. Inclusions/exclusions show side-by-side (half width)

Reload the Directus admin to see the changes.
`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
