/**
 * 1. Updates packages.itinerary_days to use plain inputs (no WYSIWYG)
 * 2. Deletes the itinerary_days collection entirely
 */
const DIRECTUS_URL = "https://admin.myperfecttrips.com";
const ADMIN_EMAIL = "hosting@infygru.com";
const ADMIN_PASSWORD = "Naren@123info";

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
    console.log("🔑 Authenticating...");
    const token = await getToken();

    // ── 1. Update itinerary_days field to use plain inputs only ──────────────
    console.log("🔄 Updating packages.itinerary_days — switching to plain input fields...");
    await api(token, "PATCH", "/fields/packages/itinerary_days", {
        meta: {
            interface: "list",
            display: "raw",
            note: "Day-by-day itinerary. Add each day directly inside this package.",
            options: {
                template: "Day {{day_number}}: {{title}}",
                fields: [
                    {
                        field: "day_number",
                        name: "Day Number",
                        type: "integer",
                        meta: { interface: "input", width: "half", required: true },
                    },
                    {
                        field: "title",
                        name: "Day Title",
                        type: "string",
                        meta: { interface: "input", width: "half", required: true },
                    },
                    {
                        field: "description",
                        name: "Description",
                        type: "text",
                        meta: { interface: "input-multiline", width: "full" },
                    },
                    {
                        field: "accommodation",
                        name: "Accommodation / Hotel",
                        type: "string",
                        meta: { interface: "input", width: "half" },
                    },
                    {
                        field: "meals",
                        name: "Meals Included",
                        type: "json",
                        meta: {
                            interface: "tags",
                            width: "half",
                            options: { placeholder: "Type Breakfast / Lunch / Dinner and press Enter" },
                        },
                    },
                ],
            },
        },
    });
    console.log("✅ packages.itinerary_days updated — all plain inputs, no WYSIWYG");

    // ── 2. Delete itinerary_days collection ───────────────────────────────────
    console.log("\n🗑️  Deleting itinerary_days collection...");
    try {
        await api(token, "DELETE", "/collections/itinerary_days");
        console.log("✅ itinerary_days collection deleted");
    } catch (e) {
        if (e.message.includes("404")) {
            console.log("↩️  itinerary_days collection not found — already gone");
        } else {
            console.warn("⚠️ ", e.message.slice(0, 200));
        }
    }

    console.log(`
🎉 Done!

packages.itinerary_days repeater fields:
  • Day Number     → number input
  • Day Title      → text input
  • Description    → multiline textarea (no rich text)
  • Accommodation  → text input
  • Meals Included → tag input (type and press Enter)

itinerary_days collection → deleted.
`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
