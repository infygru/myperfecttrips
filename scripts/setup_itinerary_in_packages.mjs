/**
 * Migrates itinerary_days collection → JSON field inside packages.
 * 1. Adds `itinerary_days` JSON field to packages collection
 * 2. For each package, fetches its itinerary_days and saves as JSON into packages.itinerary_days
 * 3. Reports on migration
 *
 * Run: node scripts/setup_itinerary_in_packages.mjs
 */
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://admin.myperfecttrips.com";
const ADMIN_EMAIL = "hosting@infygru.com";
const ADMIN_PASSWORD = "Naren@123info";

async function getToken() {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const data = await res.json();
    return data.data?.access_token;
}

async function api(token, method, path, body) {
    const res = await fetch(`${DIRECTUS_URL}${path}`, {
        method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) { const t = await res.text(); throw new Error(`${method} ${path} → ${res.status}: ${t}`); }
    return res.json().catch(() => ({}));
}

async function fieldExists(token, collection, field) {
    try { await api(token, "GET", `/fields/${collection}/${field}`); return true; } catch { return false; }
}

async function collectionExists(token, name) {
    try { await api(token, "GET", `/collections/${name}`); return true; } catch { return false; }
}

async function main() {
    console.log("🔑 Authenticating...");
    const token = await getToken();
    if (!token) throw new Error("Authentication failed");

    // 1. Add itinerary_days JSON field to packages
    if (await fieldExists(token, "packages", "itinerary_days")) {
        console.log("↩️  packages.itinerary_days field already exists");
    } else {
        console.log("📝 Adding itinerary_days JSON field to packages...");
        await api(token, "POST", "/fields/packages", {
            field: "itinerary_days",
            type: "json",
            meta: {
                interface: "list",
                note: "Day-by-day itinerary stored as JSON array. Each item: { day_number, title, description, accommodation, meals[] }",
                options: {
                    fields: [
                        { field: "day_number", name: "Day Number", type: "integer", meta: { interface: "input" } },
                        { field: "title", name: "Day Title", type: "string", meta: { interface: "input" } },
                        { field: "description", name: "Description", type: "text", meta: { interface: "input-rich-text-html" } },
                        { field: "accommodation", name: "Accommodation", type: "string", meta: { interface: "input" } },
                        { field: "meals", name: "Meals", type: "json", meta: { interface: "tags" } },
                    ],
                },
            },
        });
        console.log("✅ itinerary_days field added to packages");
    }

    // 2. Check if itinerary_days collection exists, migrate if so
    if (!await collectionExists(token, "itinerary_days")) {
        console.log("ℹ️  No itinerary_days collection found — skipping migration");
        console.log("\n🎉 Done. itinerary_days JSON field is ready in packages.");
        console.log("   Edit packages in Directus admin to add day-by-day itineraries.");
        return;
    }

    console.log("\n📦 itinerary_days collection found — migrating to packages...");

    // Fetch all packages
    const pkgRes = await api(token, "GET", "/items/packages?limit=200&fields=id,title,slug");
    const packages = pkgRes.data || [];
    console.log(`   Found ${packages.length} packages`);

    // Fetch all itinerary_days
    const daysRes = await api(token, "GET", "/items/itinerary_days?limit=1000&sort=day_number");
    const allDays = daysRes.data || [];
    console.log(`   Found ${allDays.length} itinerary day records`);

    if (allDays.length === 0) {
        console.log("ℹ️  No itinerary days to migrate");
    } else {
        let migrated = 0;
        for (const pkg of packages) {
            const days = allDays
                .filter(d => String(d.package_id) === String(pkg.id))
                .sort((a, b) => (a.day_number || 0) - (b.day_number || 0))
                .map(d => ({
                    day_number: d.day_number,
                    title: d.title || "",
                    description: d.description || "",
                    accommodation: d.accommodation || "",
                    meals: Array.isArray(d.meals) ? d.meals : (d.meals ? [d.meals] : []),
                }));

            if (days.length === 0) continue;

            try {
                await api(token, "PATCH", `/items/packages/${pkg.id}`, { itinerary_days: days });
                console.log(`   ✅ Migrated ${days.length} days for: ${pkg.title?.slice(0, 40)}`);
                migrated++;
            } catch (e) {
                console.warn(`   ⚠️  Failed for ${pkg.id}:`, e.message);
            }
        }
        console.log(`\n   ✅ Migration complete: ${migrated} packages updated`);
    }

    console.log("\n🎉 Setup complete!");
    console.log("   → packages.itinerary_days JSON field is ready");
    console.log("   → You can now safely remove the itinerary_days collection from Directus admin");
    console.log("   → The frontend will read itinerary from pkg.itinerary_days");
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
