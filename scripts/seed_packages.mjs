// Seed sample packages + itinerary_days into Directus
const BASE = "https://api.igholidays.com";

async function login() {
  const r = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@igholidays.com", password: "e4HiSzm3PsFhR3mA6Uh7YoU2uqjOHrF3" }),
  });
  const d = await r.json();
  return d.data.access_token;
}

async function api(token, method, path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  return r.json();
}

const PACKAGES = [
  // ── DOMESTIC ────────────────────────────────────────────────────────────
  {
    pkg: {
      title: "Golden Triangle India Tour",
      slug: "golden-triangle-india-tour",
      category: "Cultural",
      package_type: "domestic",
      destination: "Delhi · Agra · Jaipur",
      price: 28999,
      duration_days: 6,
      duration_nights: 5,
      inclusions: `<ul><li>4-star hotel accommodation (twin sharing)</li><li>Daily breakfast & one dinner</li><li>AC vehicle for all transfers & sightseeing</li><li>Taj Mahal sunrise entry ticket</li><li>Expert English-speaking guide</li><li>All applicable taxes</li></ul>`,
      exclusions: `<ul><li>Airfare to/from Delhi</li><li>Lunches & dinners (except one included dinner)</li><li>Monument entry fees (except Taj Mahal)</li><li>Tips & personal expenses</li><li>Travel insurance</li></ul>`,
    },
    days: [
      { day_number: 1, title: "Arrival in Delhi — The Heart of India", description: "Arrive at Indira Gandhi International Airport. Transfer to your hotel and check in. After freshening up, enjoy an evening orientation walk through Connaught Place. Welcome dinner at a rooftop restaurant with views of the illuminated city skyline.", accommodation: "The Imperial New Delhi (or similar 4-star)", meals: ["Dinner"] },
      { day_number: 2, title: "Delhi Sightseeing — Old & New", description: "Morning visit to Old Delhi: explore the grand Jama Masjid, take a rickshaw ride through the colourful lanes of Chandni Chowk, and see the mighty Red Fort from outside. Post lunch, visit Humayun's Tomb, Qutb Minar, and India Gate. Evening free for shopping at Janpath market.", accommodation: "The Imperial New Delhi (or similar 4-star)", meals: ["Breakfast"] },
      { day_number: 3, title: "Delhi to Agra — City of the Taj", description: "Post breakfast, drive to Agra (approx 3.5 hrs). Check in to hotel and freshen up. Afternoon visit to Agra Fort, a UNESCO World Heritage Site. As the sun sets, head to Mehtab Bagh for a breathtaking sunset view of the Taj Mahal across the Yamuna River.", accommodation: "Radisson Blu Agra (or similar)", meals: ["Breakfast"] },
      { day_number: 4, title: "Taj Mahal Sunrise & Drive to Jaipur", description: "Wake up early for the magical Taj Mahal sunrise visit — the most iconic experience of this tour. Spend 2 hours exploring the monument and its perfectly manicured gardens. Post breakfast, drive to Jaipur (approx 5 hrs) via Fatehpur Sikri, the deserted Mughal capital. Arrive and check in to Jaipur hotel.", accommodation: "Jai Mahal Palace (or similar heritage hotel)", meals: ["Breakfast"] },
      { day_number: 5, title: "Jaipur — The Pink City", description: "Full day Jaipur sightseeing: Amber Fort (elephant or jeep ride to the top), City Palace Museum, Jantar Mantar (UNESCO Observatory), and photo stop at Hawa Mahal. Evening free for shopping in the vibrant bazaars for gems, textiles, and handicrafts. Farewell dinner included.", accommodation: "Jai Mahal Palace (or similar heritage hotel)", meals: ["Breakfast", "Dinner"] },
      { day_number: 6, title: "Jaipur to Delhi — Departure", description: "After a leisurely breakfast, check out and transfer to Jaipur Airport or drive back to Delhi for your onward journey. Tour ends with wonderful memories of India's Golden Triangle.", meals: ["Breakfast"] },
    ],
  },
  {
    pkg: {
      title: "Kerala Backwaters & Beaches",
      slug: "kerala-backwaters-beaches",
      category: "Nature & Beach",
      package_type: "domestic",
      destination: "Kochi · Munnar · Alleppey · Kovalam",
      price: 34500,
      duration_days: 7,
      duration_nights: 6,
      inclusions: `<ul><li>Deluxe hotel & houseboat accommodation</li><li>Daily breakfast + houseboat meals</li><li>One night on premium Kerala houseboat</li><li>AC vehicle for all transfers</li><li>Kathakali dance show tickets</li><li>Spice plantation guided tour</li></ul>`,
      exclusions: `<ul><li>Flights to/from Kochi</li><li>Ayurvedic treatments (available at surcharge)</li><li>Meals not mentioned</li><li>Travel insurance</li><li>Personal expenses</li></ul>`,
    },
    days: [
      { day_number: 1, title: "Arrival in Kochi — The Queen of the Arabian Sea", description: "Arrive at Cochin International Airport. Transfer to hotel in Fort Kochi. Afternoon heritage walk: Chinese Fishing Nets, Dutch Palace, Jewish Synagogue, and the narrow lanes of Fort Kochi with their colonial-era architecture. Evening Kathakali dance performance at Kerala Kathakali Centre.", accommodation: "Forte Kochi (heritage boutique)", meals: ["Dinner"] },
      { day_number: 2, title: "Kochi to Munnar — Tea Country", description: "Drive to Munnar (approx 4 hrs) through stunning mountain scenery. En route, stop at Cheeyappara Waterfalls and Valara Waterfalls. Afternoon visit to a tea plantation and factory — see how the famous Munnar tea is made. Evening stroll through Munnar town.", accommodation: "Windermere Estate Munnar", meals: ["Breakfast"] },
      { day_number: 3, title: "Munnar — Misty Hills & Spice Gardens", description: "Morning visit to the KDHP Tea Museum and the Mattupetty Dam with its panoramic views of the Kundala Valley. Afternoon: visit a spice plantation for a guided tour through cardamom, pepper, and vanilla groves. Sunset at Top Station — the highest point on the Munnar–Kodaikanal road.", accommodation: "Windermere Estate Munnar", meals: ["Breakfast"] },
      { day_number: 4, title: "Munnar to Alleppey — Backwater Country", description: "Drive down from the hills to Alleppey (approx 4 hrs). Check in to your premium Kerala houseboat for a 24-hour cruise through the magical backwaters of Vembanad Lake. Enjoy freshly prepared fish curry and coconut-based Kerala meals on board. Watch village life unfold along the palm-fringed canals.", accommodation: "Deluxe Kerala Houseboat (private)", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day_number: 5, title: "Backwater Cruise to Kovalam", description: "Morning on the houseboat — watch the sunrise over the tranquil backwaters. Disembark post breakfast and drive to Kovalam Beach (approx 3.5 hrs). Check in to beach resort. Afternoon free at the crescent-shaped Lighthouse Beach.", accommodation: "Leela Kovalam (or similar beach resort)", meals: ["Breakfast"] },
      { day_number: 6, title: "Kovalam — Beach, Ayurveda & Sunset", description: "Leisure day at Kovalam. Morning swim or optional Ayurvedic massage at the resort spa. Afternoon explore Vizhinjam Mosque and the local harbour. Evening sunset dinner at a cliff-top beach restaurant.", accommodation: "Leela Kovalam (or similar beach resort)", meals: ["Breakfast"] },
      { day_number: 7, title: "Departure from Trivandrum", description: "Post breakfast transfer to Trivandrum International Airport for your departure flight. Tour concludes with the incredible memories of God's Own Country.", meals: ["Breakfast"] },
    ],
  },
  {
    pkg: {
      title: "Manali Himalayan Escape",
      slug: "manali-himalayan-escape",
      category: "Adventure",
      package_type: "domestic",
      destination: "Delhi · Shimla · Manali",
      price: 22500,
      duration_days: 7,
      duration_nights: 6,
      inclusions: `<ul><li>3-star & boutique hotel accommodation</li><li>Daily breakfast</li><li>Volvo bus Delhi–Shimla–Manali–Delhi</li><li>Local sightseeing by taxi</li><li>Solang Valley snow activities</li><li>Rohtang Pass permit (seasonal)</li></ul>`,
      exclusions: `<ul><li>Train/flight to Delhi</li><li>Meals except breakfast</li><li>Personal adventure activity charges</li><li>Tips & personal shopping</li><li>Travel insurance</li></ul>`,
    },
    days: [
      { day_number: 1, title: "Delhi to Shimla by Volvo", description: "Board an overnight Volvo bus from Delhi (ISBT Kashmere Gate) at 10 PM. Comfortable semi-sleeper coach winds through the foothills of the Shivaliks. Arrive Shimla early morning.", meals: [] },
      { day_number: 2, title: "Shimla — The Summer Capital", description: "Arrive Shimla, check in and freshen up. Visit The Mall Road, Christ Church, Viceregal Lodge (now IIAS), and the famous Shimla Ridge. Afternoon: toy train ride on the UNESCO-listed Kalka–Shimla Railway. Evening stroll on The Mall with local street food.", accommodation: "Hotel Willow Banks Shimla", meals: ["Breakfast"] },
      { day_number: 3, title: "Shimla to Manali — Mountain Drive", description: "Scenic drive to Manali via Mandi and the Kullu Valley (approx 7–8 hrs). En route, stop at Pandoh Dam and the Kullu Shawl factories. Arrive Manali and check in. Evening walk on Mall Road, Manali.", accommodation: "Snow Valley Resorts Manali", meals: ["Breakfast"] },
      { day_number: 4, title: "Solang Valley & Snow Activities", description: "Morning visit to Solang Valley, famous for its year-round snow and adventure sports: zorbing, rope-way cable car, and skiing (subject to snow conditions). Afternoon: visit Hidimba Devi Temple (a 500-year-old wooden temple), Vashisht Hot Springs, and Old Manali village.", accommodation: "Snow Valley Resorts Manali", meals: ["Breakfast"] },
      { day_number: 5, title: "Rohtang Pass Excursion (Seasonal)", description: "Early morning drive to Rohtang Pass (3,978m) — one of the highest motorable passes in the world. Experience snow, glaciers, and panoramic Himalayan views. En route, visit Rahala Falls and Marhi. Return to Manali by evening (subject to road/permit conditions). Alternative: Solang Snow Point or Chandratal Lake on non-permit days.", accommodation: "Snow Valley Resorts Manali", meals: ["Breakfast"] },
      { day_number: 6, title: "Manali Local & Overnight Return", description: "Morning visit to the Naggar Castle, Great Himalayan National Park viewpoint, and the Buddhist Monasteries of Manali. Afternoon free for shopping. Board overnight Volvo bus back to Delhi at 6 PM.", meals: ["Breakfast"] },
      { day_number: 7, title: "Arrival Delhi", description: "Arrive Delhi by morning. Tour ends. Transfer on your own to onwards destination.", meals: [] },
    ],
  },

  // ── INTERNATIONAL ────────────────────────────────────────────────────────
  {
    pkg: {
      title: "Maldives Luxury Overwater Villa",
      slug: "maldives-luxury-overwater-villa",
      category: "Honeymoon",
      package_type: "international",
      destination: "Maldives",
      price: 124999,
      duration_days: 6,
      duration_nights: 5,
      inclusions: `<ul><li>Overwater villa accommodation (5 nights)</li><li>All-inclusive meals & beverages</li><li>Seaplane / speedboat transfers</li><li>Snorkelling gear & sunset cruise</li><li>Couples spa treatment (60 min)</li><li>Private beach dinner setup (one night)</li></ul>`,
      exclusions: `<ul><li>International flights to Malé</li><li>Visa on arrival fee (approx USD 50)</li><li>Premium alcohol & minibar</li><li>Diving courses & watersports</li><li>Travel insurance</li></ul>`,
    },
    days: [
      { day_number: 1, title: "Arrival in Malé — Island Paradise Begins", description: "Arrive at Velana International Airport, Malé. Our representative will meet and assist with the seaplane transfer to your resort island (approx 30–45 min scenic flight over the turquoise atolls). Check in to your overwater villa. Settle in, enjoy a welcome cocktail on your deck, and savour the private steps leading directly into the crystal-clear lagoon.", accommodation: "Overwater Villa, Private Resort", meals: ["Dinner"] },
      { day_number: 2, title: "Snorkelling & House Reef Exploration", description: "Morning: complimentary guided snorkelling tour of the house reef — spot sea turtles, reef sharks, and vibrant tropical fish. Afternoon: relax on the pristine sandbank or enjoy the overwater hammock on your villa deck. Sunset cocktails at the over-water bar. Evening: fresh seafood dinner at the main restaurant.", accommodation: "Overwater Villa, Private Resort", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day_number: 3, title: "Couples Spa & Sunset Dolphin Cruise", description: "Late morning: 60-minute couples' spa treatment (deep tissue or Balinese massage). Afternoon: explore the island's watersports centre — kayaking, paddleboarding, or jet-skiing (at own cost). Evening: sunset dolphin-watching cruise followed by a private beach barbecue dinner under the stars.", accommodation: "Overwater Villa, Private Resort", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day_number: 4, title: "Leisure Day — Your Private Paradise", description: "A completely free day to do as you please. Breakfast in bed on your villa deck. Swim in the lagoon, read a book in the sun, or book a certified PADI diving session (extra cost). The resort's chef can prepare a personalised in-villa lunch. Evening: candle-lit dinner in your villa with a custom menu.", accommodation: "Overwater Villa, Private Resort", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day_number: 5, title: "Island Hopping & Local Culture", description: "Morning: guided island-hopping tour to a local Maldivian island — visit the colourful harbour, local market, and mosque. Learn about traditional fishing and boat-making. Afternoon: return to resort and spend your last afternoon at leisure. Private beach dinner setup with flower decoration included tonight.", accommodation: "Overwater Villa, Private Resort", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day_number: 6, title: "Farewell to Paradise", description: "Enjoy your final Maldivian breakfast on the villa deck. Check out and take the seaplane / speedboat back to Malé for your international flight home. Tour ends with a lifetime of memories from the world's most beautiful archipelago.", meals: ["Breakfast"] },
    ],
  },
  {
    pkg: {
      title: "Dubai & Abu Dhabi Spectacular",
      slug: "dubai-abu-dhabi-spectacular",
      category: "City & Desert",
      package_type: "international",
      destination: "Dubai · Abu Dhabi",
      price: 64999,
      duration_days: 6,
      duration_nights: 5,
      inclusions: `<ul><li>4-star hotel (Dubai 3N + Abu Dhabi 2N)</li><li>Daily breakfast</li><li>Desert safari with BBQ dinner</li><li>Burj Khalifa 124th floor (At the Top)</li><li>Abu Dhabi city tour including Sheikh Zayed Mosque</li><li>Dhow cruise dinner</li><li>All airport & hotel transfers</li></ul>`,
      exclusions: `<ul><li>International flights</li><li>UAE Visa charges</li><li>Lunch & dinners (except ones mentioned)</li><li>Theme park tickets (optional)</li><li>Travel insurance</li></ul>`,
    },
    days: [
      { day_number: 1, title: "Arrival in Dubai — City of Gold", description: "Arrive at Dubai International Airport. Meet and greet by our representative and transfer to your hotel. Check in and freshen up. Evening at leisure to explore Dubai Mall — the world's largest shopping centre — and watch the spectacular Dubai Fountain show at sunset. Overnight at hotel.", accommodation: "Premier Inn Dubai Al Jaddaf (or similar 4-star)", meals: ["Dinner"] },
      { day_number: 2, title: "Dubai City Tour & Burj Khalifa", description: "Morning half-day Dubai city tour: Jumeirah Mosque photo stop, Al Fahidi Historic District (Dubai Museum), Gold Souk, and Spice Souk. Abra (water taxi) ride across the Dubai Creek. Afternoon: visit the iconic Burj Khalifa — ascend to the 124th floor observation deck (At the Top) for breathtaking views of the city and the Arabian Gulf.", accommodation: "Premier Inn Dubai Al Jaddaf (or similar 4-star)", meals: ["Breakfast"] },
      { day_number: 3, title: "Desert Safari & BBQ Dinner", description: "Morning at leisure — optional visit to Palm Jumeirah and Atlantis photo stop. Afternoon: thrilling desert safari — dune bashing in 4WDs through the red sand dunes of the Arabian Desert, camel ride, sandboarding, and henna painting. Evening at a Bedouin desert camp with belly dance performance, tanoura show, and a lavish BBQ buffet dinner under the stars.", accommodation: "Premier Inn Dubai Al Jaddaf (or similar 4-star)", meals: ["Breakfast", "Dinner"] },
      { day_number: 4, title: "Dhow Cruise & Drive to Abu Dhabi", description: "Morning: Dubai Creek traditional Dhow Cruise lunch (optional) or visit Dubai Frame. Check out post lunch and drive to Abu Dhabi (approx 90 min). Check in to Abu Dhabi hotel. Evening: spectacular Abu Dhabi Corniche walk and dinner at a waterfront restaurant.", accommodation: "Centro Capital Abu Dhabi (or similar)", meals: ["Breakfast"] },
      { day_number: 5, title: "Abu Dhabi City Tour — Sheikh Zayed Mosque", description: "Full day Abu Dhabi city tour: Sheikh Zayed Grand Mosque — one of the world's largest and most beautiful mosques; Emirates Palace photo stop; Qasr Al Watan (Presidential Palace); Heritage Village on the Breakwater. Afternoon: optional Ferrari World Abu Dhabi or Yas Island (own cost). Evening: Dhow Cruise dinner on the Abu Dhabi Corniche.", accommodation: "Centro Capital Abu Dhabi (or similar)", meals: ["Breakfast", "Dinner"] },
      { day_number: 6, title: "Abu Dhabi Departure", description: "After breakfast, check out and transfer to Abu Dhabi International Airport or back to Dubai Airport for your departure flight. Tour concludes.", meals: ["Breakfast"] },
    ],
  },
  {
    pkg: {
      title: "Thailand — Bangkok Phuket Getaway",
      slug: "thailand-bangkok-phuket-getaway",
      category: "Beach & Culture",
      package_type: "international",
      destination: "Bangkok · Phuket",
      price: 49999,
      duration_days: 7,
      duration_nights: 6,
      inclusions: `<ul><li>3-star & 4-star hotel accommodation</li><li>Daily breakfast</li><li>Bangkok city tour (temples & floating market)</li><li>Phi Phi Island speedboat day trip</li><li>Elephant ethical sanctuary visit</li><li>Return airport transfers</li><li>Thailand e-Visa assistance</li></ul>`,
      exclusions: `<ul><li>International flights</li><li>Thailand Visa fee (approx ₹2,500)</li><li>Lunch & dinners</li><li>Personal expenses & shopping</li><li>Travel insurance</li></ul>`,
    },
    days: [
      { day_number: 1, title: "Arrival in Bangkok — The City of Angels", description: "Arrive at Suvarnabhumi International Airport, Bangkok. Transfer to hotel on Sukhumvit Road — the heart of the city. Check in and freshen up. Evening: iconic Asiatique Night Market for dinner and shopping. Experience Bangkok's vibrant street food scene.", accommodation: "Novotel Bangkok Sukhumvit (or similar)", meals: [] },
      { day_number: 2, title: "Bangkok City Tour — Temples & River", description: "Full day Bangkok city tour: Wat Phra Kaew (Temple of the Emerald Buddha) and the Grand Palace, Wat Pho (Reclining Buddha), and a longtail boat ride through Bangkok's famous khlongs (canals). Afternoon: visit the Damnoen Saduak Floating Market — one of Thailand's most colourful markets. Evening: Chaophraya River dinner cruise.", accommodation: "Novotel Bangkok Sukhumvit (or similar)", meals: ["Breakfast"] },
      { day_number: 3, title: "Bangkok to Phuket — Pearl of the Andaman", description: "Morning at leisure — optional Chatuchak Weekend Market visit or Thai cooking class. Afternoon: domestic flight Bangkok–Phuket. Transfer to beach resort. Check in and enjoy a welcome sunset on Patong or Kata Beach.", accommodation: "Holiday Inn Resort Phuket (or similar 4-star)", meals: ["Breakfast"] },
      { day_number: 4, title: "Phi Phi Island Speedboat Day Trip", description: "Full day speedboat excursion to the world-famous Phi Phi Islands: snorkelling at Shark Point, kayaking through the Viking Cave lagoon, swimming at the crystal-clear Maya Bay (as featured in 'The Beach'), and lunch on Phi Phi Don island. Return to Phuket by 5 PM.", accommodation: "Holiday Inn Resort Phuket (or similar 4-star)", meals: ["Breakfast", "Lunch"] },
      { day_number: 5, title: "Elephant Sanctuary & Phuket Old Town", description: "Morning: half-day ethical elephant sanctuary experience — feed, bathe, and walk with rescued elephants in a natural forest setting (no riding). Afternoon: explore Phuket Old Town's Sino-Portuguese architecture, colourful temples, and vibrant street art. Evening: rooftop bar sunset cocktails and seafood dinner on the beach.", accommodation: "Holiday Inn Resort Phuket (or similar 4-star)", meals: ["Breakfast"] },
      { day_number: 6, title: "Leisure Beach Day", description: "A completely free day to enjoy Phuket at your own pace. Options: ATV adventure, bangla road nightlife experience, Big Buddha Temple visit (free), or simply relax on the beach. Optional: sunset tour to Phromthep Cape — Phuket's southernmost point and best sunset viewpoint.", accommodation: "Holiday Inn Resort Phuket (or similar 4-star)", meals: ["Breakfast"] },
      { day_number: 7, title: "Phuket Departure", description: "After breakfast, check out and transfer to Phuket International Airport for your departure flight. Tour concludes. Sawadee kha — goodbye from Thailand!", meals: ["Breakfast"] },
    ],
  },
];

async function run() {
  const token = await login();
  console.log("Logged in. Seeding packages...\n");

  for (const { pkg, days } of PACKAGES) {
    // Create package
    const pkgRes = await api(token, "POST", "/items/packages", pkg);
    if (!pkgRes.data?.id) {
      console.error(`FAILED to create "${pkg.title}":`, JSON.stringify(pkgRes));
      continue;
    }
    const pkgId = pkgRes.data.id;
    console.log(`✓ Created package: ${pkg.title} (id: ${pkgId})`);

    // Create itinerary days
    for (const day of days) {
      const dayRes = await api(token, "POST", "/items/itinerary_days", {
        ...day,
        package_id: pkgId,
      });
      if (dayRes.data?.id) {
        process.stdout.write(`  ✓ Day ${day.day_number}: ${day.title}\n`);
      } else {
        console.error(`  ✗ Failed day ${day.day_number}:`, JSON.stringify(dayRes));
      }
    }
    console.log();
  }

  console.log("Done! All packages seeded.");
}

run().catch(console.error);
