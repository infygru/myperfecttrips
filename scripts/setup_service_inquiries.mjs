/**
 * Setup script: creates `service_inquiries` collection in Directus
 * with all required fields and public create permission.
 *
 * Run: node scripts/setup_service_inquiries.mjs
 */

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://admin.myperfecttrips.com";
const ADMIN_EMAIL = "hosting@infygru.com";
const ADMIN_PASSWORD = "Naren@123info";
const PUBLIC_POLICY_ID = "abf8a154-5b1c-4a46-ac9c-7300570f4f17";

async function getToken() {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const data = await res.json();
    return data.data?.access_token;
}

async function apiCall(token, method, path, body) {
    const res = await fetch(`${DIRECTUS_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${method} ${path} → ${res.status}: ${text}`);
    }
    return res.json().catch(() => ({}));
}

async function collectionExists(token, name) {
    try {
        await apiCall(token, "GET", `/collections/${name}`);
        return true;
    } catch {
        return false;
    }
}

async function fieldExists(token, collection, field) {
    try {
        await apiCall(token, "GET", `/fields/${collection}/${field}`);
        return true;
    } catch {
        return false;
    }
}

async function main() {
    console.log("🔑 Authenticating...");
    const token = await getToken();
    if (!token) throw new Error("Authentication failed");

    // 1. Create collection if needed
    if (await collectionExists(token, "service_inquiries")) {
        console.log("✅ service_inquiries collection already exists");
    } else {
        console.log("📦 Creating service_inquiries collection...");
        await apiCall(token, "POST", "/collections", {
            collection: "service_inquiries",
            meta: { icon: "support_agent", note: "Service enquiry form submissions from the website" },
            schema: {},
            fields: [
                { field: "id", type: "integer", schema: { is_primary_key: true, has_auto_increment: true }, meta: { hidden: true } },
                { field: "date_created", type: "timestamp", schema: {}, meta: { special: ["date-created"], readonly: true, hidden: false, interface: "datetime" } },
            ],
        });
        console.log("✅ Collection created");
    }

    // 2. Add fields
    const fields = [
        { field: "name", type: "string", meta: { interface: "input", note: "Full name of the enquirer" } },
        { field: "email", type: "string", meta: { interface: "input" } },
        { field: "phone", type: "string", meta: { interface: "input" } },
        { field: "service_type", type: "string", meta: { interface: "input", note: "The service being enquired about" } },
        { field: "company_name", type: "string", meta: { interface: "input" } },
        { field: "num_people", type: "integer", meta: { interface: "input" } },
        { field: "preferred_date", type: "timestamp", meta: { interface: "datetime" } },
        { field: "message", type: "text", meta: { interface: "input-multiline" } },
        { field: "status", type: "string", schema: { default_value: "New" }, meta: { interface: "select-dropdown", options: { choices: [{ text: "New", value: "New" }, { text: "In Progress", value: "In Progress" }, { text: "Closed", value: "Closed" }] } } },
    ];

    for (const f of fields) {
        if (await fieldExists(token, "service_inquiries", f.field)) {
            console.log(`  ↩️  Field ${f.field} already exists`);
        } else {
            await apiCall(token, "POST", `/fields/service_inquiries`, f);
            console.log(`  ✅ Added field: ${f.field}`);
        }
    }

    // 3. Set public create permission
    console.log("🔐 Setting public create permission...");
    try {
        await apiCall(token, "POST", "/permissions", {
            policy: PUBLIC_POLICY_ID,
            collection: "service_inquiries",
            action: "create",
            fields: "*",
        });
        console.log("✅ Public create permission granted");
    } catch (e) {
        if (e.message?.includes("400") || e.message?.includes("already")) {
            console.log("↩️  Permission already exists");
        } else {
            console.warn("⚠️  Permission setup failed:", e.message);
        }
    }

    console.log("\n🎉 service_inquiries setup complete!");
}

main().catch((e) => {
    console.error("❌ Setup failed:", e.message);
    process.exit(1);
});
