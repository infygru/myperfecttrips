/**
 * Adds `itinerary_days` as a JSON LIST (repeater) field DIRECTLY inside the packages collection.
 * In Directus admin, open a package → you see an "Itinerary Days" repeater with sub-fields.
 * No separate collection. Everything stored as JSON inside packages.
 *
 * Run: node scripts/fix_itinerary_in_packages.mjs
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

async function fieldExists(token, col, field) {
    try { await api(token, "GET", `/fields/${col}/${field}`); return true; } catch { return false; }
}

// ── ITINERARY DATA per package slug ──────────────────────────────────────────
const ITINERARIES = {
    "magical-malaysia-heritage-highlands": [
        { day_number: 1, title: "Kuala Lumpur Arrival", accommodation: "Hotel Istana KL", meals: ["Dinner"], description: "<p>Arrive at Kuala Lumpur International Airport and transfer to your centrally located hotel. Evening walk around Bukit Bintang — KL's vibrant entertainment and food district. Dinner at Jalan Alor, Malaysia's most famous hawker street famous for grilled seafood and satay.</p>" },
        { day_number: 2, title: "Petronas Towers & Batu Caves", accommodation: "Hotel Istana KL", meals: ["Breakfast", "Lunch"], description: "<p>Morning visit to the iconic Petronas Twin Towers — take the sky bridge on Level 41 for spectacular views. Explore the surrounding KLCC Park and Suria shopping mall. Afternoon: Batu Caves Hindu temple complex with its famous 272 rainbow-coloured steps.</p>" },
        { day_number: 3, title: "Cameron Highlands Escape", accommodation: "Cameron Highlands Resort", meals: ["Breakfast", "Dinner"], description: "<p>Drive up through misty jungle roads to the cool Cameron Highlands (1,500m elevation). Visit the BOH Tea Plantation — walk among rows of emerald tea bushes and sample freshly brewed highland tea. Explore strawberry farms and mossy forest trails.</p>" },
        { day_number: 4, title: "Penang Heritage Island", accommodation: "Eastern & Oriental Hotel, Penang", meals: ["Breakfast", "Lunch"], description: "<p>Transfer to Penang — Malaysia's food capital and a UNESCO World Heritage city. Explore George Town's incredible street art, Chinese clan jetties, and colonial-era architecture. Penang's hawker food scene is legendary — char kway teow, asam laksa, and cendol.</p>" },
        { day_number: 5, title: "Penang Hill & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning visit to the Penang Hill funicular railway for views over the island. Last round of street food before transfer to Penang International Airport for your return flight.</p>" },
    ],
    "golden-triangle-india-tour": [
        { day_number: 1, title: "Arrive Delhi — Old & New", accommodation: "The Imperial Hotel, Delhi", meals: ["Dinner"], description: "<p>Arrive at Indira Gandhi International Airport, New Delhi. Transfer to your heritage hotel in Connaught Place. Evening walk through Old Delhi's Chandni Chowk. Welcome dinner featuring classic North Indian cuisine — butter chicken, dal makhani, and naan fresh from the tandoor.</p>" },
        { day_number: 2, title: "Delhi — Mughal Monuments", accommodation: "The Imperial Hotel, Delhi", meals: ["Breakfast", "Lunch"], description: "<p>Full day exploring Delhi's iconic monuments. Morning at the Red Fort. Explore Old Delhi by cycle-rickshaw through Chandni Chowk spice market and Jama Masjid mosque. Afternoon: Humayun's Tomb, Qutub Minar, and India Gate.</p>" },
        { day_number: 3, title: "Agra — The Eternal Taj Mahal", accommodation: "Oberoi Amarvilas, Agra", meals: ["Breakfast", "Dinner"], description: "<p>Drive from Delhi to Agra (200km, approx 3.5 hours). Afternoon visit to the Taj Mahal — 2 hours at UNESCO's most iconic monument, watching the white marble change colour with the afternoon light. Evening: Agra Fort with sunset views of the Taj from its battlements.</p>" },
        { day_number: 4, title: "Fatehpur Sikri & Jaipur", accommodation: "Rambagh Palace, Jaipur", meals: ["Breakfast", "Lunch"], description: "<p>Morning visit to Fatehpur Sikri — a perfectly preserved 16th-century Mughal capital abandoned after 14 years. Drive onward to Jaipur through Rajasthan's golden landscape. Check in at the legendary Rambagh Palace — once the Maharaja of Jaipur's residence.</p>" },
        { day_number: 5, title: "Jaipur — Pink City Splendour", accommodation: "Rambagh Palace, Jaipur", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Full day in the Pink City. Morning: Amber Fort by elephant ride. Explore the Sheesh Mahal (Hall of Mirrors). Afternoon: City Palace, Jantar Mantar (UNESCO observatory), and the iconic Hawa Mahal facade. Evening: Folk dance dinner at Chokhi Dhani ethnic village.</p>" },
        { day_number: 6, title: "Jaipur Shopping & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning shopping at Johari Bazaar for gems, Bapu Bazaar for block-printed textiles, and Nehru Bazaar for mojaris. Transfer to Jaipur International Airport for your onward flight.</p>" },
    ],
    "kerala-backwaters-beaches": [
        { day_number: 1, title: "Arrive Kochi — Spice City", accommodation: "Brunton Boatyard, Kochi", meals: ["Dinner"], description: "<p>Arrive at Cochin International Airport. Transfer to Fort Kochi — a charming colonial peninsula with Dutch, Portuguese and British heritage. Evening stroll past the iconic Chinese fishing nets at sunset. Dinner at a heritage restaurant in an old Dutch mansion overlooking the harbour.</p>" },
        { day_number: 2, title: "Kochi Heritage & Kathakali", accommodation: "Brunton Boatyard, Kochi", meals: ["Breakfast", "Lunch"], description: "<p>Morning guided walk through Fort Kochi: St. Francis Church, Dutch Palace, and the Jewish Synagogue. Explore Princess Street's antique shops and spice markets. Evening: Kerala Kathakali classical dance performance with elaborate makeup and costume.</p>" },
        { day_number: 3, title: "Munnar Tea Country", accommodation: "Tea Sanctuary Munnar", meals: ["Breakfast", "Dinner"], description: "<p>Drive up into the Western Ghats to Munnar (130km, ~4 hours). India's most beautiful hill station — sweeping tea estates at 1,600m. Evening walk through a working tea estate as the mist rolls in. Dinner of traditional Kerala sadya on banana leaf.</p>" },
        { day_number: 4, title: "Thekkady Wildlife & Spices", accommodation: "Spice Village, Thekkady", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Drive to Thekkady — gateway to Periyar Tiger Reserve. Morning boat ride on Periyar Lake — spot wild elephants, bison, and abundant birdlife. Afternoon: guided spice garden walk through cardamom, pepper, and cinnamon plantations. Evening: Kalaripayattu martial arts demonstration.</p>" },
        { day_number: 5, title: "Alleppey Backwater Houseboat", accommodation: "Luxury Houseboat, Alleppey", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Board your private luxury houseboat at Alleppey — a renovated traditional kettuvallam. Cruise through Kerala's legendary backwater network: canals, lagoons, and rivers fringed with coconut palms. Watch village life unfold on the banks. Overnight on the water under the stars.</p>" },
        { day_number: 6, title: "Kovalam Beach & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Disembark and drive to Kovalam (3 hours) — Kerala's most beautiful crescent beach. A final swim in the Arabian Sea, an Ayurvedic massage, and seafood lunch before transfer to Trivandrum Airport for departure.</p>" },
    ],
    "manali-himalayan-escape": [
        { day_number: 1, title: "Arrive Manali", accommodation: "The Orchard Greens Resort", meals: ["Dinner"], description: "<p>Arrive at Bhuntar Airport (Kullu) or by road from Delhi. Transfer to Manali at 2,050m in the Beas River valley. Rest and acclimatise. Evening walk along Mall Road — browse woolens, Tibetan jewellery, and dried fruit. Dinner of local Himachali trout and rajma chawal.</p>" },
        { day_number: 2, title: "Solang Valley Adventure", accommodation: "The Orchard Greens Resort", meals: ["Breakfast", "Lunch"], description: "<p>Drive to Solang Valley — a spectacular alpine meadow surrounded by snow peaks. Activities: zorbing, paragliding, ATV rides, and rope bridges. Panoramic views of Hanuman Tibba (5,982m). Return via the ancient Hadimba Devi Temple — a 16th-century wooden pagoda in a cedar forest.</p>" },
        { day_number: 3, title: "Rohtang Pass", accommodation: "The Orchard Greens Resort", meals: ["Breakfast", "Dinner"], description: "<p>Early morning drive to Rohtang Pass (3,978m) — one of the world's most dramatic mountain roads. Snow-capped peaks in every direction, prayer flags at the pass. Play in the snow and take in views of the Lahaul Valley. Return via the Beas Kund trekking trail for a short afternoon walk.</p>" },
        { day_number: 4, title: "Old Manali & Vashisht Village", accommodation: "The Orchard Greens Resort", meals: ["Breakfast", "Lunch"], description: "<p>Morning soak in the ancient Vashisht hot springs and visit the Vashisht Temple. Explore Old Manali village — stone houses, apple orchards in bloom, and a relaxed café culture. Afternoon: river-side walk along the Beas and a picnic lunch in an apple orchard.</p>" },
        { day_number: 5, title: "Himalayan Trek", accommodation: "The Orchard Greens Resort", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Full-day guided trek into the Great Himalayan National Park (UNESCO World Heritage Site). Trek through temperate forests of oak and rhododendron, crossing mountain streams. Spot Himalayan birds — cheer pheasant and Himalayan monal. Return for a celebration dinner and campfire under the stars.</p>" },
        { day_number: 6, title: "Kullu Valley & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning drive through the Kullu Valley — the Valley of Gods — past orchards of apples, apricots, and plums. Stop at Bijli Mahadev Temple (2,438m) for panoramic valley views. Transfer to Bhuntar Airport for departure.</p>" },
    ],
    "maldives-luxury-overwater-villa": [
        { day_number: 1, title: "Arrival & Overwater Villa", accommodation: "Water Villa, Private Atoll", meals: ["Dinner"], description: "<p>Arrive at Velana International Airport, Malé. A private speedboat transfers you to your private island resort. Check into your overwater villa — glass floor panels reveal the coral reef below, your deck extends over the lagoon with direct water access. Sunset cocktails and romantic candlelight dinner on your deck.</p>" },
        { day_number: 2, title: "Snorkelling & Marine Discovery", accommodation: "Water Villa, Private Atoll", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Morning house-reef snorkelling over pristine coral gardens — swim with sea turtles, manta rays, and reef sharks. Afternoon: private guided snorkelling excursion to a drift channel teeming with pelagic life. Sunset dolphin cruise. Dinner at the resort's overwater restaurant.</p>" },
        { day_number: 3, title: "Scuba & Water Sports", accommodation: "Water Villa, Private Atoll", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Morning scuba diving (or discover scuba for beginners) — explore a famous thila alive with napoleonfish and soft corals. Afternoon: paddle boarding, kayaking, and catamaran sailing. Spa treatment: traditional Maldivian massage using coconut oil on an overwater platform.</p>" },
        { day_number: 4, title: "Sandbank Picnic & Local Island", accommodation: "Water Villa, Private Atoll", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Morning excursion to a private sandbank — a picnic table in the middle of the Indian Ocean surrounded by nothing but white sand and perfect blue water. Afternoon visit to a local Maldivian island — meet fishermen and browse handcrafted souvenirs. Farewell beach barbecue dinner.</p>" },
        { day_number: 5, title: "Leisure Morning & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>A final leisurely breakfast on your deck as the sun rises over the lagoon. Last swim or snorkel. Check-out and speedboat transfer back to Malé for your international flight.</p>" },
    ],
    "dubai-abu-dhabi-spectacular": [
        { day_number: 1, title: "Dubai Arrival & Downtown", accommodation: "Armani Hotel, Burj Khalifa", meals: ["Dinner"], description: "<p>Arrive at Dubai International Airport. Transfer to your hotel at the base of the Burj Khalifa. Evening visit to the Dubai Mall. Witness the Dubai Fountain show — the world's largest choreographed fountain dancing to music in the shadow of the Burj Khalifa.</p>" },
        { day_number: 2, title: "Burj Khalifa & Old Dubai", accommodation: "Armani Hotel, Burj Khalifa", meals: ["Breakfast", "Lunch"], description: "<p>Morning: ascend to the Burj Khalifa's 124th floor for 360° views. Afternoon: Dubai Frame — the 150m picture-frame structure bridging old and new Dubai. Evening: Dubai Creek — abra ride across the creek, gold souk and spice souk exploration in the historic Al Bastakiya quarter.</p>" },
        { day_number: 3, title: "Desert Safari", accommodation: "Armani Hotel, Burj Khalifa", meals: ["Breakfast", "Dinner"], description: "<p>Morning: Palm Jumeirah drive with photo stop at Atlantis. Afternoon: classic Dubai Desert Safari — 4x4 dune-bashing, sunset camel ride, sandboarding, and henna painting. Evening: Bedouin camp dinner under the stars with live music, belly dancing, and unlimited BBQ.</p>" },
        { day_number: 4, title: "Abu Dhabi — Grand Mosque", accommodation: "Emirates Palace, Abu Dhabi", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Drive to Abu Dhabi. Visit the Sheikh Zayed Grand Mosque — one of the world's six largest mosques, with 82 domes and the world's largest hand-knotted carpet. Afternoon: Louvre Abu Dhabi. Dinner at Emirates Palace's seafront restaurant.</p>" },
        { day_number: 5, title: "Yas Island & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning at Ferrari World Abu Dhabi (world's fastest roller coaster) or Yas Marina Circuit. Drive back to Dubai International Airport for departure.</p>" },
    ],
    "thailand-bangkok-phuket-getaway": [
        { day_number: 1, title: "Bangkok Arrival & Temples", accommodation: "Mandarin Oriental Bangkok", meals: ["Dinner"], description: "<p>Arrive at Suvarnabhumi Airport. Transfer to your legendary hotel on the Chao Phraya River. Afternoon visit to Wat Pho — the Temple of the Reclining Buddha. Evening: rooftop cocktails at Lebua State Tower (featured in The Hangover Part II) above Bangkok's glittering skyline.</p>" },
        { day_number: 2, title: "Grand Palace & River Canals", accommodation: "Mandarin Oriental Bangkok", meals: ["Breakfast", "Lunch"], description: "<p>Morning: Grand Palace complex and Wat Phra Kaew (Temple of the Emerald Buddha) — Thailand's spiritual heart. Afternoon: private longtail boat tour of Bangkok's canals, passing wooden stilt houses and banana plantations. Evening: Chinatown's Yaowarat Road for street food — tom yum, pad see ew, and mango sticky rice.</p>" },
        { day_number: 3, title: "Fly Phuket — Island Arrival", accommodation: "Amanpuri Resort, Phuket", meals: ["Breakfast", "Dinner"], description: "<p>Morning flight from Bangkok to Phuket (1 hr 20 min). Transfer to your luxurious resort on Pansea Beach — a secluded bay on Phuket's quieter west coast. Afternoon at leisure: private beach, infinity pool, and house reef snorkelling. Sunset dinner overlooking the Andaman Sea.</p>" },
        { day_number: 4, title: "Phi Phi Islands", accommodation: "Amanpuri Resort, Phuket", meals: ["Breakfast", "Lunch"], description: "<p>Full-day private speedboat charter to the Phi Phi Islands. Snorkel in Maya Bay, Pileh Lagoon, and Monkey Beach — waters of every shade of turquoise and emerald. Beachside BBQ lunch on a secluded beach. Return to Phuket for a spectacular Andaman sunset.</p>" },
        { day_number: 5, title: "Phang Nga Bay — James Bond Island", accommodation: "Amanpuri Resort, Phuket", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Full-day tour to Phang Nga Bay — hundreds of limestone karsts rising from jade-green water. Visit Khao Phing Kan (James Bond Island). Sea kayaking through hidden sea caves. Lunch at a floating Muslim fishing village. Farewell dinner at Phuket Town's atmospheric old quarter.</p>" },
        { day_number: 6, title: "Spa Morning & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning traditional Thai massage (90 minutes) at the resort spa. Last swim in the Andaman Sea. Transfer to Phuket International Airport for departure.</p>" },
    ],
};

async function main() {
    console.log("🔑 Authenticating...");
    const token = await getToken();
    if (!token) throw new Error("Authentication failed");

    // ── 1. Add / update itinerary_days JSON list field on packages ────────────
    const fieldPayload = {
        field: "itinerary_days",
        type: "json",
        meta: {
            interface: "list",
            display: "raw",
            note: "Day-by-day itinerary. Add each day directly here — stored inside this package.",
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
                        meta: { interface: "input-rich-text-html", width: "full" },
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
                        meta: { interface: "tags", width: "half", options: { placeholder: "e.g. Breakfast" } },
                    },
                ],
            },
        },
        schema: {},
    };

    if (await fieldExists(token, "packages", "itinerary_days")) {
        console.log("🔄 Updating itinerary_days field options on packages...");
        await api(token, "PATCH", "/fields/packages/itinerary_days", { meta: fieldPayload.meta });
        console.log("✅ Field updated");
    } else {
        console.log("➕ Adding itinerary_days JSON list field to packages...");
        await api(token, "POST", "/fields/packages", fieldPayload);
        console.log("✅ Field added");
    }

    // ── 2. Fetch all packages ─────────────────────────────────────────────────
    console.log("\n📦 Fetching packages...");
    const pkgRes = await api(token, "GET", "/items/packages?limit=100&fields=id,title,slug");
    const packages = pkgRes.data || [];
    console.log(`   Found ${packages.length} packages\n`);

    // ── 3. Populate itinerary_days data on each package ───────────────────────
    console.log("🌱 Populating itinerary data inside packages...");
    let updated = 0, skipped = 0;

    for (const pkg of packages) {
        const days = ITINERARIES[pkg.slug];
        if (!days) {
            console.log(`  ⚠️  No seed data for slug: "${pkg.slug}"`);
            continue;
        }

        await api(token, "PATCH", `/items/packages/${pkg.id}`, { itinerary_days: days });
        console.log(`  ✅ ${pkg.title?.slice(0, 45)} — saved ${days.length} days`);
        updated++;
    }

    console.log(`\n   Updated: ${updated} | Skipped: ${skipped}`);
    console.log(`
🎉 Done!

In Directus admin:
  → Open any Package
  → Scroll down to find the "Itinerary Days" repeater field
  → Click "+ Add Item" to add a new day directly inside the package
  → Click any existing day to edit it inline
  → Everything saves to the packages table — no separate collection

Frontend reads: pkg.itinerary_days (array of {day_number, title, description, accommodation, meals})
`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
