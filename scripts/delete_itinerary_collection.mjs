const DIRECTUS_URL = "https://api.igholidays.com";
const ADMIN_EMAIL = "admin@igholidays.com";
const ADMIN_PASSWORD = "e4HiSzm3PsFhR3mA6Uh7YoU2uqjOHrF3";

async function getToken() {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    return (await res.json()).data?.access_token;
}

async function api(token, method, path, body) {
    const res = await fetch(`${DIRECTUS_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
    try { return JSON.parse(text); } catch { return {}; }
}

async function main() {
    const token = await getToken();
    console.log("🔑 Authenticated\n");

    // List all relations to find anything pointing to or from itinerary_days
    const rels = await api(token, "GET", "/relations");
    const related = (rels.data || []).filter(r =>
        r.collection === "itinerary_days" || r.related_collection === "itinerary_days"
    );
    console.log(`Found ${related.length} relation(s) involving itinerary_days`);

    // Delete each relation
    for (const rel of related) {
        console.log(`  🗑️  Deleting relation: ${rel.collection}.${rel.field}`);
        try {
            await api(token, "DELETE", `/relations/${rel.collection}/${rel.field}`);
            console.log(`  ✅ Deleted`);
        } catch (e) {
            console.warn(`  ⚠️  ${e.message.slice(0, 150)}`);
        }
    }

    // Delete the O2M alias field on packages if it exists
    console.log("\n  🗑️  Removing packages.itinerary_days alias field (from old O2M)...");
    try {
        // check what type it is
        const fld = await api(token, "GET", "/fields/packages/itinerary_days");
        const type = fld.data?.type || fld.type;
        console.log(`  Field type: ${type}`);
        if (type === "alias") {
            await api(token, "DELETE", "/fields/packages/itinerary_days");
            console.log("  ✅ Alias field deleted");
        } else {
            console.log("  ℹ️  Field is not alias — keeping it (it's our JSON repeater)");
        }
    } catch (e) {
        console.log("  ↩️  Field not found or already gone");
    }

    // Now delete the collection
    console.log("\n🗑️  Deleting itinerary_days collection...");
    try {
        await api(token, "DELETE", "/collections/itinerary_days");
        console.log("✅ itinerary_days collection deleted");
    } catch (e) {
        console.warn("⚠️ ", e.message.slice(0, 200));
    }

    // Verify packages.itinerary_days JSON field still exists
    console.log("\n🔍 Verifying packages.itinerary_days JSON field...");
    try {
        const fld = await api(token, "GET", "/fields/packages/itinerary_days");
        console.log(`✅ packages.itinerary_days exists — type: ${fld.data?.type || fld.type}`);
    } catch {
        console.log("⚠️  packages.itinerary_days not found — re-adding...");
        await api(token, "POST", "/fields/packages", {
            field: "itinerary_days",
            type: "json",
            meta: {
                interface: "list",
                display: "raw",
                note: "Day-by-day itinerary stored inside this package.",
                options: {
                    template: "Day {{day_number}}: {{title}}",
                    fields: [
                        { field: "day_number", name: "Day Number", type: "integer", meta: { interface: "input", width: "half", required: true } },
                        { field: "title", name: "Day Title", type: "string", meta: { interface: "input", width: "half", required: true } },
                        { field: "description", name: "Description", type: "text", meta: { interface: "input-multiline", width: "full" } },
                        { field: "accommodation", name: "Accommodation / Hotel", type: "string", meta: { interface: "input", width: "half" } },
                        { field: "meals", name: "Meals Included", type: "json", meta: { interface: "tags", width: "half", options: { placeholder: "Breakfast / Lunch / Dinner" } } },
                    ],
                },
            },
            schema: {},
        });
        console.log("✅ Re-added packages.itinerary_days JSON field");
    }

    console.log("\n🎉 Done — itinerary_days collection removed, JSON repeater on packages intact.");
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
