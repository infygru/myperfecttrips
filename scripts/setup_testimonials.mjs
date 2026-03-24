/**
 * Setup: creates `testimonials` collection, adds fields, seeds data.
 * Run: node scripts/setup_testimonials.mjs
 */
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://admin.myperfecttrips.com";
const ADMIN_EMAIL = "hosting@infygru.com";
const ADMIN_PASSWORD = "Naren@123info";
const PUBLIC_POLICY_ID = "abf8a154-5b1c-4a46-ac9c-7300570f4f17";

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

async function exists(token, path) {
    try { await api(token, "GET", path); return true; } catch { return false; }
}

const SEEDS = [
    { name: "Rahul & Priya Sharma", location: "Bengaluru", tour_name: "Maldives Honeymoon Package", rating: 5, text: "IGHolidays planned the most magical honeymoon we could have imagined. The water villa upgrade was breathtaking, and every detail — from the sunset cruise to the private dining — was flawlessly arranged. Truly the best luxury travel agency we've ever worked with!", status: "published" },
    { name: "Suresh Ramachandran", location: "Chennai", tour_name: "Dubai Corporate MICE Summit", rating: 5, text: "Handling our 150-person corporate incentive summit in Dubai was executed flawlessly. From group visa coordination to the grand gala dinner at the Burj Al Arab, not a single thing went wrong. My Perfect Trips is our go-to partner for all MICE events.", status: "published" },
    { name: "Anjali & Vikram Mehta", location: "Mumbai", tour_name: "14-Day Europe Grand Tour", rating: 5, text: "The customized 14-day Europe itinerary was perfectly paced — Paris, Amsterdam, Zurich, and Rome. Every hotel exceeded our expectations and the private guided tours were exceptional. I've already recommended My Perfect Trips to a dozen friends!", status: "published" },
    { name: "Deepa Krishnamurthy", location: "Coimbatore", tour_name: "Rajasthan Heritage Tour", rating: 5, text: "Our Rajasthan family trip was beyond anything we expected. The palace hotel stays in Jaipur and Udaipur were incredible, and the guides were so knowledgeable. My kids are still talking about the camel ride in Jaisalmer. Thank you My Perfect Trips!", status: "published" },
    { name: "Mohammed Farhan", location: "Hyderabad", tour_name: "Thailand Group Package", rating: 5, text: "Organised a 22-person group trip to Thailand for my college reunion. The team at My Perfect Trips handled everything — flights, hotels, transfers, island hopping. Seamless from start to finish at an unbeatable group price. Highly recommended!", status: "published" },
    { name: "Meenakshi Iyer", location: "Chennai", tour_name: "Kerala Backwaters Retreat", rating: 5, text: "The houseboat stay in Alleppey was divine. My Perfect Trips curated every moment beautifully — the Thekkady spice tour, the Munnar tea estate visit, and the Kovalam beach finale. A perfect family getaway that we'll treasure forever.", status: "published" },
    { name: "Arjun & Kavitha Nair", location: "Kochi", tour_name: "Bali Honeymoon Special", rating: 5, text: "Bali was our dream honeymoon destination and My Perfect Trips made it a reality beyond our expectations. The private villa in Ubud, sunrise at Mount Batur, and the couples spa package were all perfectly arranged. Absolutely five stars!", status: "published" },
    { name: "Srinivasan Family", location: "Madurai", tour_name: "Singapore & Malaysia Tour", rating: 5, text: "A wonderful family trip to Singapore and Malaysia organised for 6 of us including senior parents and two young kids. The My Perfect Trips team was extremely patient and thoughtful — they even arranged wheelchair assistance and child-friendly activities. Superb service!", status: "published" },
];

async function main() {
    console.log("🔑 Authenticating...");
    const token = await getToken();
    if (!token) throw new Error("Authentication failed");

    // 1. Create collection
    if (await exists(token, "/collections/testimonials")) {
        console.log("↩️  testimonials collection already exists");
    } else {
        console.log("📦 Creating testimonials collection...");
        await api(token, "POST", "/collections", {
            collection: "testimonials",
            meta: { icon: "star", note: "Customer testimonials shown on the homepage" },
            schema: {},
            fields: [
                { field: "id", type: "integer", schema: { is_primary_key: true, has_auto_increment: true }, meta: { hidden: true } },
                { field: "date_created", type: "timestamp", schema: {}, meta: { special: ["date-created"], readonly: true, interface: "datetime" } },
            ],
        });
        console.log("✅ Collection created");
    }

    // 2. Add fields
    const fields = [
        { field: "name", type: "string", meta: { interface: "input", note: "Full name of the reviewer" } },
        { field: "location", type: "string", meta: { interface: "input", note: "City / state of reviewer" } },
        { field: "tour_name", type: "string", meta: { interface: "input", note: "Name of the tour they took" } },
        { field: "rating", type: "integer", schema: { default_value: 5 }, meta: { interface: "input", note: "Rating 1-5" } },
        { field: "text", type: "text", meta: { interface: "input-multiline", note: "Review text" } },
        { field: "status", type: "string", schema: { default_value: "published" }, meta: { interface: "select-dropdown", options: { choices: [{ text: "Published", value: "published" }, { text: "Draft", value: "draft" }] } } },
    ];

    for (const f of fields) {
        if (await exists(token, `/fields/testimonials/${f.field}`)) {
            console.log(`  ↩️  Field ${f.field} already exists`);
        } else {
            await api(token, "POST", "/fields/testimonials", f);
            console.log(`  ✅ Added: ${f.field}`);
        }
    }

    // 3. Public read permission
    try {
        await api(token, "POST", "/permissions", { policy: PUBLIC_POLICY_ID, collection: "testimonials", action: "read", fields: "*" });
        console.log("✅ Public read permission granted");
    } catch (e) {
        if (e.message?.includes("400") || e.message?.includes("unique")) console.log("↩️  Permission already exists");
        else console.warn("⚠️ ", e.message);
    }

    // 4. Seed
    console.log("\n🌱 Seeding testimonials...");
    let existing = [];
    try { const r = await api(token, "GET", "/items/testimonials?limit=50"); existing = r.data || []; } catch { }

    for (const seed of SEEDS) {
        if (existing.find(e => e.name === seed.name)) {
            console.log(`  ↩️  ${seed.name} already exists`);
            continue;
        }
        await api(token, "POST", "/items/testimonials", seed);
        console.log(`  ✅ ${seed.name}`);
    }

    console.log("\n🎉 Testimonials setup complete!");
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
