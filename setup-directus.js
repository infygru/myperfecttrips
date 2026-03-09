// Directus Auto-Setup Script for IGHolidays
// Run: node setup-directus.js

const DIRECTUS_URL = "http://localhost:8055";
const ADMIN_EMAIL = "admin@igholidays.com";
const ADMIN_PASSWORD = "Admin123!";

async function getToken() {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const data = await res.json();
    if (!data.data?.access_token) throw new Error("Login failed: " + JSON.stringify(data));
    console.log("✅ Logged in to Directus");
    return data.data.access_token;
}

async function createField(token, collection, field) {
    const res = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(field),
    });
    const data = await res.json();
    if (data.errors) {
        // Skip if already exists
        if (data.errors[0]?.message?.includes("already exists") || data.errors[0]?.extensions?.code === "RECORD_NOT_UNIQUE") {
            console.log(`  ⚠️  Field '${field.field}' already exists in '${collection}' — skipping`);
        } else {
            console.log(`  ❌ Field '${field.field}' in '${collection}': ${data.errors[0]?.message}`);
        }
    } else {
        console.log(`  ✅ Field '${field.field}' added to '${collection}'`);
    }
}

async function createCollection(token, name, fields) {
    // Try to create collection
    const res = await fetch(`${DIRECTUS_URL}/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ collection: name, meta: { icon: "box" }, schema: {}, fields: [] }),
    });
    const data = await res.json();
    if (data.errors) {
        if (data.errors[0]?.message?.toLowerCase().includes("already exists")) {
            console.log(`\n⚠️  Collection '${name}' already exists — adding fields only`);
        } else {
            console.log(`\n❌ Failed to create collection '${name}': ${data.errors[0]?.message}`);
        }
    } else {
        console.log(`\n✅ Collection '${name}' created`);
    }
    // Add fields regardless
    console.log(`  Adding fields to '${name}'...`);
    for (const field of fields) {
        await createField(token, name, field);
    }
}

async function grantPublicAccess(token, collection, action) {
    // Get public policy ID
    const polRes = await fetch(`${DIRECTUS_URL}/policies?filter[name][_eq]=Public`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const polData = await polRes.json();
    const policyId = polData.data?.[0]?.id;
    if (!policyId) { console.log("  ⚠️  Could not find Public policy"); return; }

    const res = await fetch(`${DIRECTUS_URL}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ collection, action, policy: policyId, fields: ["*"] }),
    });
    const data = await res.json();
    if (data.errors) {
        if (data.errors[0]?.extensions?.code === "RECORD_NOT_UNIQUE") {
            console.log(`  ⚠️  Public ${action} access on '${collection}' already exists`);
        } else {
            console.log(`  ❌ Permission error: ${data.errors[0]?.message}`);
        }
    } else {
        console.log(`  ✅ Public ${action} access granted on '${collection}'`);
    }
}

async function main() {
    console.log("🚀 IGHolidays Directus Auto-Setup Starting...\n");
    const token = await getToken();

    // ── PACKAGES ────────────────────────────────────────────────
    await createCollection(token, "packages", [
        { field: "title", type: "string", meta: { interface: "input", required: true } },
        { field: "slug", type: "string", meta: { interface: "input", required: true } },
        {
            field: "category", type: "string", meta: {
                interface: "select-dropdown",
                options: {
                    choices: [
                        { text: "Flights", value: "Flights" },
                        { text: "Hotels", value: "Hotels" },
                        { text: "Holiday Package", value: "Holiday Package" },
                        { text: "Cruise", value: "Cruise" },
                        { text: "Bachelor Tour", value: "Bachelor Tour" },
                        { text: "Solo Tour", value: "Solo Tour" },
                        { text: "Adventure Tour", value: "Adventure Tour" },
                        { text: "Island Resorts", value: "Island Resorts" },
                        { text: "MICE", value: "MICE" },
                        { text: "Custom", value: "Custom" },
                    ]
                },
            }
        },
        { field: "image", type: "uuid", meta: { interface: "file-image", special: ["file"] } },
        { field: "price", type: "integer", meta: { interface: "input" } },
        { field: "duration_days", type: "integer", meta: { interface: "input" } },
        { field: "duration_nights", type: "integer", meta: { interface: "input" } },
        { field: "destinations", type: "json", meta: { interface: "tags", special: ["cast-json"] } },
        { field: "itinerary", type: "text", meta: { interface: "input-rich-text-html" } },
        { field: "inclusions", type: "text", meta: { interface: "input-rich-text-html" } },
        { field: "exclusions", type: "text", meta: { interface: "input-rich-text-html" } },
    ]);
    await grantPublicAccess(token, "packages", "read");

    // ── BLOG POSTS ───────────────────────────────────────────────
    await createCollection(token, "blog_posts", [
        { field: "title", type: "string", meta: { interface: "input", required: true } },
        { field: "slug", type: "string", meta: { interface: "input", required: true } },
        { field: "featured_image", type: "uuid", meta: { interface: "file-image", special: ["file"] } },
        { field: "excerpt", type: "text", meta: { interface: "input-multiline" } },
        { field: "content", type: "text", meta: { interface: "input-rich-text-html" } },
        { field: "author", type: "string", meta: { interface: "input" } },
        { field: "published_date", type: "timestamp", meta: { interface: "datetime" } },
        {
            field: "status", type: "string", meta: {
                interface: "select-dropdown",
                options: {
                    choices: [
                        { text: "Draft", value: "Draft" },
                        { text: "Published", value: "Published" },
                        { text: "Archived", value: "Archived" },
                    ]
                },
            }
        },
    ]);
    await grantPublicAccess(token, "blog_posts", "read");

    // ── LEADS ────────────────────────────────────────────────────
    await createCollection(token, "leads", [
        { field: "name", type: "string", meta: { interface: "input", required: true } },
        { field: "email", type: "string", meta: { interface: "input", required: true } },
        { field: "phone", type: "string", meta: { interface: "input" } },
        { field: "package_interest", type: "string", meta: { interface: "input" } },
        { field: "budget", type: "string", meta: { interface: "input" } },
        { field: "notes", type: "text", meta: { interface: "input-multiline" } },
        { field: "travel_date", type: "date", meta: { interface: "datetime" } },
        { field: "num_adults", type: "integer", meta: { interface: "input" } },
        { field: "num_children", type: "integer", meta: { interface: "input" } },
        {
            field: "trip_type", type: "string", meta: {
                interface: "select-dropdown",
                options: {
                    choices: [
                        { text: "Honeymoon", value: "Honeymoon" },
                        { text: "Family", value: "Family" },
                        { text: "Corporate", value: "Corporate" },
                        { text: "Solo", value: "Solo" },
                        { text: "Friends", value: "Friends" },
                    ]
                },
            }
        },
        {
            field: "status", type: "string", meta: {
                interface: "select-dropdown",
                options: {
                    choices: [
                        { text: "New", value: "New" },
                        { text: "Contacted", value: "Contacted" },
                        { text: "Qualified", value: "Qualified" },
                        { text: "Lost", value: "Lost" },
                        { text: "Converted", value: "Converted" },
                    ]
                },
            }
        },
    ]);
    await grantPublicAccess(token, "leads", "create");

    // ── ENQUIRIES ────────────────────────────────────────────────
    await createCollection(token, "enquiries", [
        { field: "name", type: "string", meta: { interface: "input", required: true } },
        { field: "email", type: "string", meta: { interface: "input", required: true } },
        { field: "phone", type: "string", meta: { interface: "input" } },
        { field: "message", type: "text", meta: { interface: "input-multiline", required: true } },
        {
            field: "status", type: "string", meta: {
                interface: "select-dropdown",
                options: {
                    choices: [
                        { text: "Pending", value: "Pending" },
                        { text: "In Progress", value: "In Progress" },
                        { text: "Resolved", value: "Resolved" },
                    ]
                },
            }
        },
    ]);
    await grantPublicAccess(token, "enquiries", "create");

    // ── CUSTOM SETTINGS FIELDS ───────────────────────────────────
    console.log("\n📋 Adding custom fields to directus_settings...");
    const settingsFields = [
        { field: "hero_image", type: "uuid", meta: { interface: "file-image", special: ["file"] } },
        { field: "hero_video", type: "uuid", meta: { interface: "file", special: ["file"] } },
        { field: "contact_phone", type: "string", meta: { interface: "input" } },
        { field: "contact_email", type: "string", meta: { interface: "input" } },
        { field: "office_address", type: "text", meta: { interface: "input-multiline" } },
        { field: "facebook_url", type: "string", meta: { interface: "input" } },
        { field: "instagram_url", type: "string", meta: { interface: "input" } },
        { field: "linkedin_url", type: "string", meta: { interface: "input" } },
    ];
    for (const field of settingsFields) {
        await createField(token, "directus_settings", field);
    }

    console.log("\n🎉 Setup complete! Your Directus is fully configured.");
    console.log("   Go to http://localhost:8055 → Content → Packages → Create Item");
    console.log("   Your website at http://localhost:3000 will show the data instantly.");
}

main().catch(console.error);
