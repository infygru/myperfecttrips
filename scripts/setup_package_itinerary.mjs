/**
 * Properly sets up itinerary_days as an inline O2M within packages.
 * In Directus admin, opening any package shows its itinerary days directly — add, edit, reorder.
 *
 * Run: node scripts/setup_package_itinerary.mjs
 */

const DIRECTUS_URL = "https://admin.myperfecttrips.com";
const ADMIN_EMAIL = "hosting@infygru.com";
const ADMIN_PASSWORD = "Naren@123info";
const PUBLIC_POLICY_ID = "abf8a154-5b1c-4a46-ac9c-7300570f4f17";

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
    if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
    try { return JSON.parse(text); } catch { return {}; }
}

async function collectionExists(token, name) {
    try { await api(token, "GET", `/collections/${name}`); return true; } catch { return false; }
}

async function fieldExists(token, col, field) {
    try { await api(token, "GET", `/fields/${col}/${field}`); return true; } catch { return false; }
}

async function relationExists(token, col, field) {
    try {
        const r = await api(token, "GET", `/relations/${col}/${field}`);
        return !!(r?.data || r?.collection);
    } catch { return false; }
}

// ── PER-PACKAGE ITINERARY SEED DATA ──────────────────────────────────────────
const ITINERARIES = {
    // matched by slug
    "singapore-sparkle-city-of-the-future-2025": [
        { day_number: 1, title: "Arrival & Marina Bay Sands", accommodation: "Marina Bay Sands Hotel", meals: ["Dinner"], description: "<p>Arrive at Changi Airport — consistently voted the world's best. Transfer to your iconic hotel at Marina Bay Sands. After check-in, take in the breathtaking SkyPark Observation Deck for panoramic city views. Evening dinner at the hotel's rooftop restaurant overlooking the glittering skyline.</p>" },
        { day_number: 2, title: "Gardens by the Bay & Sentosa", accommodation: "Marina Bay Sands Hotel", meals: ["Breakfast", "Lunch"], description: "<p>Morning visit to the futuristic Gardens by the Bay — walk among the towering Supertrees and explore the Cloud Forest and Flower Dome. Afternoon transfer to Sentosa Island. Enjoy Universal Studios Singapore, the S.E.A. Aquarium, and a beachside sunset dinner.</p>" },
        { day_number: 3, title: "Cultural Quarter & Chinatown", accommodation: "Marina Bay Sands Hotel", meals: ["Breakfast", "Dinner"], description: "<p>Explore Singapore's multicultural heart — vibrant Chinatown with its ornate temples and hawker centres, the colourful shophouses of Little India, and the Arab Quarter (Kampong Glam). Evening visit to Orchard Road for world-class shopping and a farewell dinner.</p>" },
        { day_number: 4, title: "City Tour & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning at leisure — last-minute shopping or a relaxing breakfast. Check-out and transfer to Changi Airport for your onward journey. Depart with memories of one of Asia's most extraordinary cities.</p>" },
    ],
    "magical-malaysia-heritage-highlands": [
        { day_number: 1, title: "Kuala Lumpur Arrival", accommodation: "Hotel Istana KL", meals: ["Dinner"], description: "<p>Arrive at Kuala Lumpur International Airport. Transfer to your centrally located hotel. Evening orientation walk around Bukit Bintang — KL's vibrant entertainment and food district. Dinner at Jalan Alor, Malaysia's most famous hawker street famous for grilled seafood and satay.</p>" },
        { day_number: 2, title: "Petronas Towers & City Icons", accommodation: "Hotel Istana KL", meals: ["Breakfast", "Lunch"], description: "<p>Morning visit to the iconic Petronas Twin Towers (KLCC) — take the sky bridge on Level 41 for spectacular views. Explore the surrounding KLCC Park and Suria shopping mall. Afternoon: Batu Caves Hindu temple complex with its famous 272 rainbow-coloured steps and resident monkeys.</p>" },
        { day_number: 3, title: "Cameron Highlands Escape", accommodation: "Cameron Highlands Resort", meals: ["Breakfast", "Dinner"], description: "<p>Drive up through misty jungle roads to the cool Cameron Highlands (1,500m elevation). Visit the BOH Tea Plantation — walk among rows of emerald tea bushes and sample freshly brewed highland tea. Explore strawberry farms, mossy forest trails, and butterfly gardens. Cool evenings perfect for fireside dining.</p>" },
        { day_number: 4, title: "Penang Heritage Island", accommodation: "Eastern & Oriental Hotel, Penang", meals: ["Breakfast", "Lunch"], description: "<p>Transfer to Penang — Malaysia's food capital and a UNESCO World Heritage city. Explore George Town's incredible street art, Chinese clan jetties, and colonial-era architecture. Visit the Cheong Fatt Tze (Blue Mansion), a 19th-century Chinese merchant's palace. Penang's hawker food scene is legendary — char kway teow, asam laksa, and cendol.</p>" },
        { day_number: 5, title: "Penang & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning at leisure in Penang. Visit the Penang Hill funicular railway for views over the island. Last round of street food before transfer to Penang International Airport for your return flight.</p>" },
    ],
    "golden-triangle-india-tour": [
        { day_number: 1, title: "Arrival Delhi — Old & New", accommodation: "The Imperial Hotel, Delhi", meals: ["Dinner"], description: "<p>Arrive at Indira Gandhi International Airport, New Delhi. Transfer to your heritage hotel in Connaught Place. Evening guided walk through Connaught Place and Janpath Market. Welcome dinner featuring classic North Indian cuisine — butter chicken, dal makhani, and naan fresh from the tandoor.</p>" },
        { day_number: 2, title: "Delhi — Mughal Monuments", accommodation: "The Imperial Hotel, Delhi", meals: ["Breakfast", "Lunch"], description: "<p>Full day exploring Delhi's most iconic monuments. Morning at the Red Fort (Lal Qila) — the 17th-century Mughal citadel of red sandstone. Explore the bustling lanes of Old Delhi: Chandni Chowk spice market, Jama Masjid mosque, and a cycle-rickshaw ride through the narrow alleys. Afternoon: Humayun's Tomb (precursor to the Taj Mahal), Qutub Minar, and India Gate.</p>" },
        { day_number: 3, title: "Agra — The Eternal Taj Mahal", accommodation: "Oberoi Amarvilas, Agra", meals: ["Breakfast", "Dinner"], description: "<p>Drive from Delhi to Agra (200km, approx 3.5 hours) on the Yamuna Expressway. Afternoon visit to the Taj Mahal — spend at least 2 hours at UNESCO's most-photographed building, watching the white marble change colour with the afternoon light. Evening: Agra Fort, the great Mughal fortress where Shah Jahan was imprisoned by his own son. Sunset views of the Taj from the fort battlements.</p>" },
        { day_number: 4, title: "Fatehpur Sikri & Journey to Jaipur", accommodation: "Rambagh Palace, Jaipur", meals: ["Breakfast", "Lunch"], description: "<p>Morning visit to Fatehpur Sikri — the ghost city of Akbar, a perfectly preserved 16th-century Mughal capital abandoned after just 14 years due to water shortage. Drive onward to Jaipur through Rajasthan's golden landscape. Check in at the legendary Rambagh Palace — once the residence of the Maharaja of Jaipur.</p>" },
        { day_number: 5, title: "Jaipur — Pink City Splendour", accommodation: "Rambagh Palace, Jaipur", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Full day in the Pink City. Morning: Amber Fort — a dramatic hilltop fortress reached by elephant ride (or jeep). Explore the Sheesh Mahal (Hall of Mirrors) and the fort's intricate marble and mosaic chambers. Afternoon: City Palace (still home to the Jaipur royal family), Jantar Mantar (UNESCO astronomical observatory), and the iconic Hawa Mahal facade. Evening: Folk dance dinner at Chokhi Dhani ethnic village.</p>" },
        { day_number: 6, title: "Departure from Jaipur", accommodation: "", meals: ["Breakfast"], description: "<p>Morning at leisure — last-minute shopping at Johari Bazaar for gems, Bapu Bazaar for block-printed textiles, and Nehru Bazaar for mojaris (leather shoes). Transfer to Jaipur International Airport for your onward flight. India's Golden Triangle leaves memories that last a lifetime.</p>" },
    ],
    "kerala-backwaters-beaches": [
        { day_number: 1, title: "Arrive Kochi — Spice City", accommodation: "Brunton Boatyard, Kochi", meals: ["Dinner"], description: "<p>Arrive at Cochin International Airport. Transfer to Fort Kochi — a charming colonial peninsula with Dutch, Portuguese and British heritage layered over centuries. Evening stroll past the iconic Chinese fishing nets at sunset. Dinner at a heritage restaurant in an old Dutch mansion overlooking the harbour.</p>" },
        { day_number: 2, title: "Kochi Heritage & Kathakali", accommodation: "Brunton Boatyard, Kochi", meals: ["Breakfast", "Lunch"], description: "<p>Morning guided walk through Fort Kochi: the St. Francis Church (where Vasco da Gama was buried), the Dutch Palace (Mattancherry), and the Jewish Synagogue in the 450-year-old Jewish Quarter. Explore Princess Street's antique shops and spice markets. Evening: Kerala Kathakali classical dance performance — elaborate makeup and costume over 2 hours of storytelling.</p>" },
        { day_number: 3, title: "Munnar Tea Country", accommodation: "Tea Sanctuary Munnar", meals: ["Breakfast", "Dinner"], description: "<p>Drive up into the Western Ghats to Munnar (130km, approx 4 hours). Arrive in India's most beautiful hill station — sweeping tea estates at 1,600m carpeting the hillsides in vivid green. Evening walk through a working tea estate as the mist rolls in. Dinner of traditional Kerala sadya (banana leaf meal).</p>" },
        { day_number: 4, title: "Thekkady Spice & Wildlife", accommodation: "Spice Village, Thekkady", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Drive to Thekkady — gateway to the Periyar Tiger Reserve. Morning boat ride on Periyar Lake through the reserve — spot wild elephants, bison, otters, and abundant birdlife from the water. Afternoon: guided spice garden walk through cardamom, pepper, cinnamon, and vanilla plantations. Evening: a Kalaripayattu martial arts demonstration, the world's oldest fighting system.</p>" },
        { day_number: 5, title: "Alleppey — Houseboat on Backwaters", accommodation: "Luxury Houseboat, Alleppey", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Drive to Alleppey (Alappuzha) and board your private luxury houseboat — a renovated traditional kettuvallam (rice barge). Cruise through the legendary Kerala backwaters: a 900km network of canals, lagoons, rivers and lakes fringed with coconut palms and paddy fields. Watch village life unfold on the banks — children playing, women washing, fishermen casting nets. Overnight on the water under a canopy of stars.</p>" },
        { day_number: 6, title: "Kovalam Beach & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Disembark and drive to Kovalam (approx 3 hours) — Kerala's most beautiful crescent beach lined with coconut palms. A final swim in the Arabian Sea, an Ayurvedic massage, and a seafood lunch before transfer to Trivandrum International Airport for departure. Kerala — God's Own Country — will call you back.</p>" },
    ],
    "manali-himalayan-escape": [
        { day_number: 1, title: "Arrive Manali — Mountain Town", accommodation: "The Orchard Greens Resort, Manali", meals: ["Dinner"], description: "<p>Arrive at Bhuntar Airport (Kullu) or by road from Delhi (overnight bus/cab). Transfer to Manali — a picturesque mountain town at 2,050m in the Beas River valley. Rest and acclimatise to the altitude. Evening walk along Mall Road and Manali market — browse woolens, Tibetan jewellery, and dried fruit. Dinner of local Himachali trout and rajma chawal.</p>" },
        { day_number: 2, title: "Solang Valley — Snow & Adventure", accommodation: "The Orchard Greens Resort, Manali", meals: ["Breakfast", "Lunch"], description: "<p>Drive to Solang Valley (14km from Manali) — a spectacular alpine meadow surrounded by snow peaks used for winter sports and summer adventure. Activities: zorbing, paragliding, ATV rides, rope bridges, and in season, skiing and snow tubing. Panoramic views of Hanuman Tibba (5,982m) and Seven Sisters peaks. Return via the ancient Hadimba Devi Temple — an extraordinary 16th-century wooden pagoda in a cedar forest.</p>" },
        { day_number: 3, title: "Rohtang Pass — Top of the World", accommodation: "The Orchard Greens Resort, Manali", meals: ["Breakfast", "Dinner"], description: "<p>Early morning drive to Rohtang Pass (3,978m) on the Manali-Leh Highway — one of the world's most dramatic mountain roads. Snow-capped peaks in every direction, prayer flags strung across the pass, yaks grazing near the roadside. Play in the snow, take in the views of the Lahaul Valley on the other side, and visit the glacier. Return via the Beas Kund trekking trail for a short afternoon nature walk.</p>" },
        { day_number: 4, title: "Old Manali & Vashisht Village", accommodation: "The Orchard Greens Resort, Manali", meals: ["Breakfast", "Lunch"], description: "<p>Morning soak in the ancient Vashisht hot springs (sulphur baths used for centuries) and visit the Vashisht Temple. Explore Old Manali village — charming stone houses, apple orchards in bloom, and a relaxed café culture. The famous Manu Temple perched above the village. Afternoon: river-side walk along the Beas, picnic lunch in an apple orchard.</p>" },
        { day_number: 5, title: "Great Himalayan National Park Trek", accommodation: "The Orchard Greens Resort, Manali", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Full-day guided trek into the Great Himalayan National Park (UNESCO World Heritage Site). Trek through dense temperate forests of oak, rhododendron, and silver birch, crossing rushing mountain streams. Spot Himalayan birds — cheer pheasant, Himalayan monal, and lammergeier. Return to Manali for a celebration dinner and campfire under the stars.</p>" },
        { day_number: 6, title: "Kullu Valley & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning drive through the Kullu Valley — the Valley of Gods — past orchards of apples, apricots, and plums. Stop at the Bijli Mahadev Temple (perched dramatically at 2,438m) for panoramic valley views. Transfer to Bhuntar Airport for departure. The Himalayas leave a permanent impression on every soul who visits.</p>" },
    ],
    "maldives-luxury-overwater-villa": [
        { day_number: 1, title: "Arrival — Overwater Villa Check-In", accommodation: "Water Villa, Private Atoll", meals: ["Dinner"], description: "<p>Arrive at Velana International Airport, Malé. A private speedboat or seaplane whisks you across the turquoise Indian Ocean to your private island resort. Check into your stunning overwater villa — glass floor panels reveal the coral reef below, your private deck extends over the lagoon, and steps lead directly into the warm water. Sunset cocktails over the horizon. Romantic candlelight dinner on your deck.</p>" },
        { day_number: 2, title: "Snorkelling & Marine Discovery", accommodation: "Water Villa, Private Atoll", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Morning house-reef snorkelling — your villa sits over one of the Maldives' most pristine coral gardens. Swim with sea turtles, manta rays, blacktip reef sharks, and hundreds of vibrant reef fish. Afternoon: private guided snorkelling excursion to a drift channel teeming with pelagic life. Sunset dolphin cruise — pods of spinner dolphins frolic around the boat. Dinner at the resort's overwater restaurant.</p>" },
        { day_number: 3, title: "Scuba Diving & Water Sports", accommodation: "Water Villa, Private Atoll", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Morning scuba diving for certified divers (or a discover scuba introduction for beginners) — explore a famous thila (submerged pinnacle) alive with napoleonfish, whale sharks (seasonal), and soft corals. Afternoon: paddle boarding, kayaking, and a private catamaran sailing trip around the atoll. Spa treatment: traditional Maldivian massage using coconut oil on an overwater platform with the sound of the ocean below.</p>" },
        { day_number: 4, title: "Sandbank Picnic & Local Island", accommodation: "Water Villa, Private Atoll", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Morning excursion to a private sandbank — your resort sets up a picnic table in the middle of the Indian Ocean surrounded by nothing but white sand and perfect blue water. Afternoon visit to a local inhabited island — see authentic Maldivian life, meet local fishermen, visit a fish market, and browse handcrafted souvenirs. Farewell dinner: a private beach barbecue with a gourmet seafood spread.</p>" },
        { day_number: 5, title: "Morning at Leisure & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>A final leisurely breakfast on your deck as the sun rises over the lagoon. Last swim or snorkel. Check-out and speedboat/seaplane transfer back to Malé for your international flight. The Maldives — a place of absolute natural perfection — stays with you forever.</p>" },
    ],
    "dubai-abu-dhabi-spectacular": [
        { day_number: 1, title: "Dubai Arrival & Downtown", accommodation: "Armani Hotel, Burj Khalifa", meals: ["Dinner"], description: "<p>Arrive at Dubai International Airport. Transfer to your world-class hotel at the base of the Burj Khalifa. Evening visit to the Dubai Mall — one of the world's largest shopping centres, home to an indoor ski slope, aquarium, and ice rink. Witness the Dubai Fountain show — the world's largest choreographed fountain system dancing to music in the shadow of the Burj Khalifa.</p>" },
        { day_number: 2, title: "Burj Khalifa & Dubai Frame", accommodation: "Armani Hotel, Burj Khalifa", meals: ["Breakfast", "Lunch"], description: "<p>Morning: ascend to the Burj Khalifa's 124th-floor observation deck (At the Top) for staggering 360° views over the city, desert, and ocean. Afternoon: Dubai Frame — a 150m-tall picture-frame structure bridging old and new Dubai, with stunning views from the glass-floored sky bridge. Evening: Dubai Creek in the historic Al Bastakiya quarter — abra (traditional boat) ride across the creek, gold souk and spice souk exploration.</p>" },
        { day_number: 3, title: "Desert Safari — Dunes at Sunset", accommodation: "Armani Hotel, Burj Khalifa", meals: ["Breakfast", "Dinner"], description: "<p>Morning: Palm Jumeirah drive — the world's largest artificial island. Photo stop at Atlantis The Palm. Afternoon: pick-up for a classic Dubai Desert Safari. 4x4 dune-bashing over the red sand dunes of the Lahbab Desert, sunset camel ride, sandboarding, and henna painting. Evening: Bedouin camp dinner under the stars with live music, belly dancing, and unlimited BBQ.</p>" },
        { day_number: 4, title: "Abu Dhabi — Grand Mosque", accommodation: "Emirates Palace, Abu Dhabi", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Drive to Abu Dhabi (150km, approx 1.5 hours). Visit the Sheikh Zayed Grand Mosque — one of the world's six largest mosques and arguably the most beautiful, with 82 domes, 1,000 columns, and the world's largest hand-knotted carpet. Afternoon: Emirates Palace tour and the spectacular Louvre Abu Dhabi. Dinner at Emirates Palace's seafront restaurant.</p>" },
        { day_number: 5, title: "Yas Island & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning at Yas Marina Circuit (Formula 1 Abu Dhabi Grand Prix venue) or Ferrari World Abu Dhabi (world's fastest roller coaster). Drive back to Dubai International Airport for departure. Dubai — where tomorrow meets tradition — will astound you every time you return.</p>" },
    ],
    "thailand-bangkok-phuket-getaway": [
        { day_number: 1, title: "Bangkok Arrival & Temple Trail", accommodation: "Mandarin Oriental Bangkok", meals: ["Dinner"], description: "<p>Arrive at Suvarnabhumi Airport, Bangkok. Transfer by private car to your legendary hotel on the Chao Phraya River. Afternoon visit to Wat Pho — the Temple of the Reclining Buddha (one of Bangkok's oldest and largest temples). Watch the saffron-robed monks and take a private meditation session. Evening: rooftop bar at Lebua State Tower (featured in The Hangover Part II) for cocktails above Bangkok's glittering skyline.</p>" },
        { day_number: 2, title: "Royal Bangkok — Palaces & River", accommodation: "Mandarin Oriental Bangkok", meals: ["Breakfast", "Lunch"], description: "<p>Morning: Grand Palace complex — the dazzling Wat Phra Kaew (Temple of the Emerald Buddha) and the palace grounds are the spiritual heart of Thailand. Afternoon: private longtail boat tour of Bangkok's khlongs (canals) — explore the floating market at Taling Chan, pass wooden stilt houses and banana plantations. Evening: world-famous Patpong Night Market and Chinatown's Yaowarat Road for street food — tom yum, pad see ew, and mango sticky rice.</p>" },
        { day_number: 3, title: "Fly to Phuket — Island Arrival", accommodation: "Amanpuri Resort, Phuket", meals: ["Breakfast", "Dinner"], description: "<p>Morning flight from Bangkok to Phuket (1 hour 20 min). Transfer to your luxurious resort on Pansea Beach — a secluded, unspoiled bay on Phuket's quieter west coast. Afternoon at leisure: the private beach, infinity pool, and resort's snorkelling equipment to explore the house reef. Sunset dinner at the resort's restaurant overlooking the Andaman Sea.</p>" },
        { day_number: 4, title: "Phi Phi Islands — Emerald Bays", accommodation: "Amanpuri Resort, Phuket", meals: ["Breakfast", "Lunch"], description: "<p>Full-day private speedboat charter to the Phi Phi Islands — among the most beautiful in Southeast Asia. Snorkel in the crystal bays of Maya Bay (made famous in The Beach), Pileh Lagoon, and Monkey Beach. Swim with tropical fish in waters of every shade of turquoise and emerald. Beachside BBQ lunch on a secluded beach with your private crew. Return to Phuket in time for a spectacular Andaman sunset.</p>" },
        { day_number: 5, title: "Phang Nga Bay — James Bond Island", accommodation: "Amanpuri Resort, Phuket", meals: ["Breakfast", "Lunch", "Dinner"], description: "<p>Full-day tour to the extraordinary Phang Nga Bay — hundreds of limestone karst towers rising dramatically from jade-green water. Visit Khao Phing Kan (James Bond Island, The Man with the Golden Gun). Sea kayaking through hidden sea caves and hongs (collapsed caves open to the sky). Lunch at a floating Muslim fishing village. Return via the mangrove forest. Farewell dinner at Phuket Town's atmospheric old quarter (Sino-Portuguese architecture).</p>" },
        { day_number: 6, title: "Morning Spa & Departure", accommodation: "", meals: ["Breakfast"], description: "<p>Morning traditional Thai massage (90 minutes) at the resort spa — the perfect send-off. Last swim in the Andaman Sea. Transfer to Phuket International Airport for departure. Thailand's warmth — in climate, people, food, and scenery — makes it the world's most visited country for good reason.</p>" },
    ],
};

async function main() {
    console.log("🔑 Authenticating...");
    const token = await getToken();
    if (!token) throw new Error("Authentication failed");

    // ── STEP 1: Create itinerary_days collection ─────────────────────────────
    if (await collectionExists(token, "itinerary_days")) {
        console.log("↩️  itinerary_days collection already exists");
    } else {
        console.log("📦 Creating itinerary_days collection...");
        await api(token, "POST", "/collections", {
            collection: "itinerary_days",
            meta: {
                icon: "map",
                note: "Day-by-day itinerary entries for each package. Managed inline from within a Package.",
                sort_field: "day_number",
            },
            schema: {},
            fields: [
                {
                    field: "id",
                    type: "integer",
                    schema: { is_primary_key: true, has_auto_increment: true },
                    meta: { hidden: true },
                },
                {
                    field: "date_created",
                    type: "timestamp",
                    schema: {},
                    meta: { special: ["date-created"], readonly: true, hidden: true, interface: "datetime" },
                },
            ],
        });
        console.log("✅ itinerary_days collection created");
    }

    // ── STEP 2: Add fields to itinerary_days ─────────────────────────────────
    console.log("\n📝 Setting up itinerary_days fields...");
    const iFields = [
        {
            field: "day_number",
            type: "integer",
            schema: { default_value: 1 },
            meta: { interface: "input", display: "raw", required: true, sort: 1, width: "half", note: "Day number (1, 2, 3…)" },
        },
        {
            field: "title",
            type: "string",
            meta: { interface: "input", display: "raw", required: true, sort: 2, width: "half", note: "Short title for the day, e.g. 'Arrival & City Tour'" },
        },
        {
            field: "description",
            type: "text",
            meta: { interface: "input-rich-text-html", display: "raw", sort: 3, width: "full", note: "Detailed description of the day's activities" },
        },
        {
            field: "accommodation",
            type: "string",
            meta: { interface: "input", display: "raw", sort: 4, width: "half", note: "Hotel or stay for the night, e.g. 'Oberoi Amarvilas, Agra'" },
        },
        {
            field: "meals",
            type: "json",
            meta: { interface: "tags", display: "labels", sort: 5, width: "half", note: "Meals included: Breakfast, Lunch, Dinner" },
        },
    ];

    for (const f of iFields) {
        if (await fieldExists(token, "itinerary_days", f.field)) {
            console.log(`  ↩️  ${f.field} already exists`);
        } else {
            await api(token, "POST", "/fields/itinerary_days", f);
            console.log(`  ✅ Added: ${f.field}`);
        }
    }

    // ── STEP 3: Add package_id M2O field on itinerary_days ───────────────────
    console.log("\n🔗 Setting up M2O relationship (itinerary_days → packages)...");
    if (await fieldExists(token, "itinerary_days", "package_id")) {
        console.log("  ↩️  package_id field already exists");
    } else {
        await api(token, "POST", "/fields/itinerary_days", {
            field: "package_id",
            type: "integer",
            schema: { is_nullable: false },
            meta: {
                interface: "select-dropdown-m2o",
                display: "related-values",
                display_options: { template: "{{title}}" },
                hidden: true,
                sort: 6,
                width: "full",
            },
        });
        console.log("  ✅ package_id field added");
    }

    // ── STEP 4: Create the relation (so package_id is a proper FK) ───────────
    console.log("\n🔗 Creating relation metadata...");
    if (await relationExists(token, "itinerary_days", "package_id")) {
        console.log("  ↩️  Relation already exists");
    } else {
        try {
            await api(token, "POST", "/relations", {
                collection: "itinerary_days",
                field: "package_id",
                related_collection: "packages",
                meta: {
                    one_field: "itinerary_days",
                    one_deselect_action: "delete",
                    sort_field: "day_number",
                },
                schema: {
                    on_delete: "CASCADE",
                },
            });
            console.log("  ✅ Relation created: itinerary_days.package_id → packages");
        } catch (e) {
            if (e.message.includes("already") || e.message.includes("400")) {
                console.log("  ↩️  Relation already exists");
            } else {
                throw e;
            }
        }
    }

    // ── STEP 5: Configure the O2M alias field on packages ────────────────────
    // The relation's one_field creates packages.itinerary_days alias automatically.
    // Now patch its display meta for the admin UI.
    console.log("\n⚙️  Configuring packages.itinerary_days O2M display...");
    try {
        await api(token, "PATCH", "/fields/packages/itinerary_days", {
            meta: {
                interface: "list-o2m",
                display: "related-values",
                display_options: {
                    template: "Day {{day_number}}: {{title}}",
                },
                options: {
                    template: "Day {{day_number}}: {{title}}",
                    enableCreate: true,
                    enableSelect: false,
                    limit: 30,
                },
                note: "Day-by-day itinerary. Add each day with its title, description, accommodation and meals.",
            },
        });
        console.log("  ✅ O2M field configured on packages");
    } catch (e) {
        console.warn("  ⚠️  Could not configure O2M meta (may need manual setup in admin):", e.message.slice(0, 100));
    }

    // ── STEP 6: Public read permission ───────────────────────────────────────
    console.log("\n🔐 Setting public read permission for itinerary_days...");
    try {
        await api(token, "POST", "/permissions", {
            policy: PUBLIC_POLICY_ID,
            collection: "itinerary_days",
            action: "read",
            fields: "*",
        });
        console.log("  ✅ Public read permission granted");
    } catch (e) {
        if (e.message.includes("400") || e.message.includes("unique")) {
            console.log("  ↩️  Permission already exists");
        } else {
            console.warn("  ⚠️ ", e.message.slice(0, 100));
        }
    }

    // ── STEP 7: Fetch packages and seed itinerary days ───────────────────────
    console.log("\n📦 Fetching packages...");
    const pkgRes = await api(token, "GET", "/items/packages?limit=100&fields=id,title,slug");
    const packages = pkgRes.data || [];
    console.log(`   Found ${packages.length} packages`);

    // Check existing itinerary days
    let existingDays = [];
    try {
        const dr = await api(token, "GET", "/items/itinerary_days?limit=500&fields=id,package_id,day_number");
        existingDays = dr.data || [];
    } catch { }
    console.log(`   Found ${existingDays.length} existing itinerary day records`);

    console.log("\n🌱 Seeding itinerary days per package...");
    let seeded = 0, skipped = 0;

    for (const pkg of packages) {
        const existing = existingDays.filter(d => String(d.package_id) === String(pkg.id));
        if (existing.length > 0) {
            console.log(`  ↩️  ${pkg.title?.slice(0, 40)} — already has ${existing.length} days`);
            skipped++;
            continue;
        }

        // Find matching itinerary by slug
        const days = ITINERARIES[pkg.slug] || null;
        if (!days) {
            console.log(`  ⚠️  No seed data for: ${pkg.slug} — skipping`);
            continue;
        }

        for (const day of days) {
            try {
                await api(token, "POST", "/items/itinerary_days", {
                    ...day,
                    package_id: pkg.id,
                });
            } catch (e) {
                console.warn(`    ⚠️  Day ${day.day_number} failed: ${e.message.slice(0, 80)}`);
            }
        }
        console.log(`  ✅ ${pkg.title?.slice(0, 40)} — seeded ${days.length} days`);
        seeded++;
    }

    console.log(`\n   Seeded: ${seeded} packages | Skipped (already had data): ${skipped}`);

    console.log(`
🎉 Done! Itinerary days are now properly set up.

In Directus admin:
  → Open any Package → scroll down → you'll see "Itinerary Days" inline
  → Click "+ Add New" to add a day, or click any day to edit it
  → Each day has: Day Number, Title, Description (rich text), Accommodation, Meals

In the frontend:
  → Package detail page fetches days via readItems with fields=["*","itinerary_days.*"]
  → PDF download reads from pkg.itinerary_days
`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
