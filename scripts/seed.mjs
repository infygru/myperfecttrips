/**
 * Seed script — My Perfect Trips
 * Seeds Packages and testimonials to Directus.
 * Run: node scripts/seed.mjs
 */

const BASE = 'https://admin.myperfecttrips.com';
const TOKEN = 'LmVN-qWYDuvwiK8_wDnha6bSremeR7zd';

async function post(collection, data) {
  const res = await fetch(`${BASE}/items/${collection}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`  ✗ ${collection}:`, json.errors?.[0]?.message || JSON.stringify(json));
    return null;
  }
  return json.data;
}

// ── PACKAGES ─────────────────────────────────────────────────────────────────

const packages = [
  {
    title: 'Maldives Overwater Villa Escape',
    slug: 'maldives-overwater-villa-escape',
    price: 2499,
    price_without_flight: 1899,
    duration_days: 7,
    duration_nights: 6,
    package_type: 'international',
    category: 'Honeymoon',
    destination_name: 'Maldives',
    is_featured: true,
    description: 'Indulge in absolute paradise with your own overwater villa, turquoise lagoons, and pristine white-sand beaches. Perfect for honeymooners and couples seeking a truly unforgettable escape from the UK.',
    overview: 'Six nights in a luxury overwater villa in the Maldives, including daily breakfast, sunset dolphin cruise, snorkelling excursion, and all airport speedboat transfers. Depart from any major UK airport.',
    inclusions: JSON.stringify([
      'Return flights from UK (Manchester/London)',
      '6 nights overwater villa with ocean views',
      'Daily breakfast & dinner (half board)',
      'Speedboat airport transfers',
      'Sunset dolphin watching cruise',
      'Snorkelling gear & guided reef tour',
      'Welcome fruit basket & flowers',
      '24/7 My Perfect Trips support',
    ]),
    exclusions: JSON.stringify([
      'Travel insurance',
      'Visa fees',
      'Personal expenses & spa treatments',
      'Alcoholic beverages',
      'Lunch meals',
    ]),
    itinerary_json: JSON.stringify([
      { day: 1, title: 'Arrival & Check-in', description: 'Arrive at Velana International Airport, transfer via speedboat to your resort. Evening welcome dinner at the overwater restaurant.' },
      { day: 2, title: 'Reef Snorkelling', description: 'Morning guided snorkelling at the house reef. Afternoon free to relax on your villa deck or by the pool.' },
      { day: 3, title: 'Dolphin Sunset Cruise', description: 'Full day at leisure. Evening sunset cruise with dolphin watching and canapes.' },
      { day: 4, title: 'Island Hopping', description: 'Visit a local Maldivian island village, fish market, and sandbank picnic.' },
      { day: 5, title: 'Spa & Relaxation', description: 'Day free for spa, water sports, or simply relaxing. Optional diving excursion available.' },
      { day: 6, title: 'Beach Day', description: 'Final full day on the beach. Farewell dinner under the stars.' },
      { day: 7, title: 'Departure', description: 'After breakfast, speedboat transfer to airport for return flight to the UK.' },
    ]),
    tags: JSON.stringify(['honeymoon', 'beach', 'luxury', 'couples', 'overwater villa']),
  },
  {
    title: 'Bali Tropical Discovery – 8 Days',
    slug: 'bali-tropical-discovery-8-days',
    price: 1699,
    price_without_flight: 1099,
    duration_days: 8,
    duration_nights: 7,
    package_type: 'international',
    category: 'Adventure',
    destination_name: 'Bali, Indonesia',
    is_featured: true,
    description: 'Explore the magical island of Bali — from rice terraces and ancient temples to volcanic peaks and surf beaches. A perfect blend of adventure, culture, and relaxation for UK travellers.',
    overview: 'Seven nights across Ubud and Seminyak covering Bali\'s cultural heartland and beach resort strip. Includes guided tours, cooking class, sunrise trek, and daily breakfast.',
    inclusions: JSON.stringify([
      'Return flights from UK',
      '3 nights in Ubud boutique resort',
      '4 nights in Seminyak beach hotel',
      'Daily breakfast',
      'Airport transfers & inter-hotel transfers',
      'Mount Batur sunrise trekking tour',
      'Ubud cultural tour (Tegalalang, temples, monkey forest)',
      'Balinese cooking class',
      'Traditional Balinese massage (1 session)',
    ]),
    exclusions: JSON.stringify([
      'Travel insurance',
      'Visa on arrival fee (~£25)',
      'Lunches & dinners (except where stated)',
      'Personal expenses',
      'Optional white-water rafting',
    ]),
    tags: JSON.stringify(['adventure', 'culture', 'beach', 'temples', 'tropical']),
  },
  {
    title: 'Dubai City & Desert Adventure',
    slug: 'dubai-city-desert-adventure',
    price: 1299,
    price_without_flight: 799,
    duration_days: 6,
    duration_nights: 5,
    package_type: 'international',
    category: 'City Break',
    destination_name: 'Dubai, UAE',
    is_featured: true,
    description: 'Experience the glittering skyline, world-class shopping, and thrilling desert safaris of Dubai. A seamless city-and-desert escape from the UK with guaranteed quality hotels.',
    overview: 'Five nights in a 5-star Dubai hotel with Burj Khalifa and Dubai Mall visit, dhow cruise dinner, and a classic desert safari with BBQ dinner under the stars.',
    inclusions: JSON.stringify([
      'Return flights from UK',
      '5 nights 5-star hotel (city view)',
      'Daily breakfast',
      'Airport transfers',
      'Burj Khalifa At The Top (124th floor) entry',
      'Desert safari with dune bashing, camel ride & BBQ dinner',
      'Dubai Creek dhow cruise with dinner',
      'Dubai Frame entry ticket',
    ]),
    exclusions: JSON.stringify([
      'Travel insurance',
      'Visa fees (approx £90 for UK passport holders)',
      'Lunches',
      'Personal shopping',
      'Alcohol (limited availability)',
    ]),
    tags: JSON.stringify(['city break', 'luxury', 'desert', 'skyscraper', 'shopping']),
  },
  {
    title: 'Thailand Island Hopper – Phuket & Krabi',
    slug: 'thailand-island-hopper-phuket-krabi',
    price: 1499,
    price_without_flight: 899,
    duration_days: 10,
    duration_nights: 9,
    package_type: 'international',
    category: 'Beach',
    destination_name: 'Thailand',
    is_featured: false,
    description: 'Hop between two of Thailand\'s most stunning destinations — the lively Patong Beach in Phuket and the dramatic limestone cliffs of Krabi. Perfect for couples and groups from the UK.',
    overview: 'Four nights in Phuket followed by five nights in Krabi. Includes Phi Phi Island boat tour, James Bond Island trip, kayaking in Ao Nang, and all inter-island speedboat transfers.',
    inclusions: JSON.stringify([
      'Return flights from UK',
      '4 nights Phuket (4-star beach resort)',
      '5 nights Krabi (boutique resort, Ao Nang)',
      'Daily breakfast',
      'Airport & inter-hotel transfers',
      'Phi Phi Island full-day boat tour',
      'James Bond Island (Phang Nga Bay) day trip',
      'Kayaking in Ao Nang mangroves',
      'Tiger Cave Temple guided visit',
    ]),
    exclusions: JSON.stringify([
      'Travel insurance',
      'Visa on arrival (~£35)',
      'Meals beyond breakfast',
      'Optional elephant sanctuary visit',
      'Personal expenses',
    ]),
    tags: JSON.stringify(['beach', 'islands', 'snorkelling', 'adventure', 'couples']),
  },
  {
    title: 'Santorini & Athens – Greek Island Dream',
    slug: 'santorini-athens-greek-island-dream',
    price: 1899,
    price_without_flight: 1299,
    duration_days: 8,
    duration_nights: 7,
    package_type: 'international',
    category: 'Honeymoon',
    destination_name: 'Greece',
    is_featured: true,
    description: 'Discover iconic blue-domed churches, volcanic beaches, and legendary sunsets in Santorini before exploring the ancient wonders of Athens. A dream combination for UK couples and families.',
    overview: 'Four nights in Santorini (Oia/Fira) followed by three nights in Athens. Includes sunset wine-tasting tour, Acropolis guided visit, and day trip to Caldera beaches by catamaran.',
    inclusions: JSON.stringify([
      'Return flights from UK',
      '4 nights Santorini (infinity pool hotel, Oia)',
      '3 nights Athens (boutique hotel, Plaka)',
      'Daily breakfast',
      'Ferry from Santorini to Athens (or internal flight)',
      'Santorini caldera sunset sailing tour (wine & food)',
      'Athens Acropolis & Parthenon guided tour',
      'Airport transfers at both ends',
    ]),
    exclusions: JSON.stringify([
      'Travel insurance',
      'Lunches & dinners (except where stated)',
      'Personal expenses',
      'Optional ATV rental in Santorini',
    ]),
    tags: JSON.stringify(['honeymoon', 'romantic', 'island', 'history', 'culture', 'Europe']),
  },
  {
    title: 'Mauritius All-Inclusive Beach Holiday',
    slug: 'mauritius-all-inclusive-beach-holiday',
    price: 2199,
    price_without_flight: 1599,
    duration_days: 9,
    duration_nights: 8,
    package_type: 'international',
    category: 'Beach',
    destination_name: 'Mauritius',
    is_featured: false,
    description: 'White-powder beaches, crystal-clear lagoons, and a rich blend of cultures await in Mauritius. Our all-inclusive package ensures you can truly switch off and enjoy paradise from the moment you land.',
    overview: 'Eight nights all-inclusive at a 5-star beachfront resort in Mauritius. Includes all meals, non-motorised water sports, glass-bottom boat trip, and island tour by 4x4.',
    inclusions: JSON.stringify([
      'Return flights from UK',
      '8 nights 5-star all-inclusive resort (west coast)',
      'All meals & soft drinks included',
      'Non-motorised water sports (kayak, paddleboard, snorkel)',
      'Glass-bottom boat excursion',
      'Mauritius island tour by 4x4',
      'Airport transfers',
      'Welcome rum punch & turndown service',
    ]),
    exclusions: JSON.stringify([
      'Travel insurance',
      'Alcoholic beverages (beyond house wine/beer)',
      'Motorised water sports & diving',
      'Spa treatments',
      'Personal expenses',
    ]),
    tags: JSON.stringify(['all-inclusive', 'beach', 'luxury', 'family', 'couples']),
  },
  {
    title: 'Morocco Imperial Cities Explorer',
    slug: 'morocco-imperial-cities-explorer',
    price: 999,
    price_without_flight: 649,
    duration_days: 7,
    duration_nights: 6,
    package_type: 'international',
    category: 'Culture',
    destination_name: 'Morocco',
    is_featured: false,
    description: 'Journey through Morocco\'s four imperial cities — Marrakech, Fez, Meknes, and Rabat. Lose yourself in ancient medinas, spice souks, and UNESCO-listed palaces on this unforgettable cultural tour from the UK.',
    overview: 'Six nights across Marrakech and Fez with guided medina tours, Sahara Desert day trip, Majorelle Garden visit, and authentic riad accommodation.',
    inclusions: JSON.stringify([
      'Return flights from UK',
      '3 nights riad in Marrakech',
      '3 nights riad in Fez',
      'Daily breakfast',
      'Private guided medina tours (both cities)',
      'Majorelle Garden & Museum entry',
      'Atlas Mountains & Sahara desert day trip',
      'Fez tanneries & pottery quarter guided visit',
      'All inter-city private transfers',
    ]),
    exclusions: JSON.stringify([
      'Travel insurance',
      'Lunches & dinners',
      'Optional camel trekking in the desert',
      'Tips for guides',
      'Personal expenses',
    ]),
    tags: JSON.stringify(['culture', 'history', 'medina', 'desert', 'adventure', 'affordable']),
  },
  {
    title: 'Japan Cherry Blossom & Culture Tour',
    slug: 'japan-cherry-blossom-culture-tour',
    price: 3299,
    price_without_flight: 2499,
    duration_days: 12,
    duration_nights: 11,
    package_type: 'international',
    category: 'Culture',
    destination_name: 'Japan',
    is_featured: true,
    description: 'Experience Japan at its most breathtaking — cherry blossoms in full bloom, ancient temples, bullet trains, and world-class cuisine. A truly bucket-list journey from the UK combining Tokyo, Kyoto, Osaka, and Mount Fuji.',
    overview: 'Eleven nights covering Tokyo (4), Hakone/Mount Fuji (2), Kyoto (3) and Osaka (2). Includes 7-day JR Pass, bullet train journeys, and guided cultural experiences.',
    inclusions: JSON.stringify([
      'Return flights from UK',
      '11 nights hotels (mix of boutique and traditional ryokan)',
      'Daily breakfast',
      '7-day JR Unlimited Rail Pass',
      'Airport transfers',
      'Tokyo city highlights guided tour',
      'Mount Fuji & Hakone day trip (Lake Ashi cruise)',
      'Kyoto temples & geisha district walking tour',
      'Nara deer park & Todai-ji temple visit',
      'Osaka street food tour',
    ]),
    exclusions: JSON.stringify([
      'Travel insurance',
      'Japan eVisa (required for UK passport, ~£20)',
      'Lunches & dinners (except breakfast)',
      'Optional tea ceremony or sake tasting',
      'Personal shopping',
    ]),
    tags: JSON.stringify(['culture', 'cherry blossom', 'temples', 'foodie', 'bucket list', 'Japan']),
  },
];

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: 'Sarah & James Thompson',
    location: 'Manchester',
    tour_name: 'Maldives Honeymoon Package',
    text: 'My Perfect Trips organised our Maldives honeymoon and it was absolutely flawless. Every detail was taken care of — from the overwater villa upgrade to the sunset cruise. We felt completely looked after from start to finish.',
    rating: 5,
    status: 'published',
  },
  {
    name: 'Priya Sharma',
    location: 'London',
    tour_name: 'Dubai City & Desert Adventure',
    text: 'Booked a last-minute Dubai package and I was genuinely impressed. The team sorted flights, hotel, and the desert safari within 24 hours. Transparent pricing, no hidden costs, and the hotel was even better than pictured.',
    rating: 5,
    status: 'published',
  },
  {
    name: 'David & Claire Hutchinson',
    location: 'Leeds',
    tour_name: 'Santorini & Athens – Greek Island Dream',
    text: 'We\'ve used several travel agencies over the years but My Perfect Trips is a cut above. Our Greece trip — Santorini and Athens — was perfectly paced with genuine insider recommendations. Already planning our next trip with them.',
    rating: 5,
    status: 'published',
  },
  {
    name: 'Mohammed Al-Rashid',
    location: 'Birmingham',
    tour_name: 'Japan Cherry Blossom & Culture Tour',
    text: 'The Japan itinerary they put together for us was incredible. Eleven days, four cities, bullet trains — all perfectly coordinated. Our expert was on hand via WhatsApp throughout the trip. Outstanding service.',
    rating: 5,
    status: 'published',
  },
  {
    name: 'Claire & Tom Bradley',
    location: 'Belfast',
    tour_name: 'Bali Tropical Discovery – 8 Days',
    text: 'Bali was everything we dreamed of and more. My Perfect Trips handled every single detail — the private villa in Ubud, the sunrise trek up Mount Batur, the cooking class. Genuinely the best holiday we\'ve ever had.',
    rating: 5,
    status: 'published',
  },
  {
    name: 'Aisha Patel',
    location: 'Birmingham',
    tour_name: 'Mauritius All-Inclusive Beach Holiday',
    text: 'The all-inclusive Mauritius package was incredible value. Beautiful resort, stunning beaches, and everything was sorted before we even landed. My Perfect Trips made the whole experience completely stress-free.',
    rating: 5,
    status: 'published',
  },
];

// ── RUN ───────────────────────────────────────────────────────────────────────

console.log('Seeding packages...');
for (const pkg of packages) {
  const result = await post('Packages', pkg);
  if (result) console.log(`  ✓ Package: ${pkg.title} (id: ${result.id})`);
}

console.log('\nSeeding testimonials...');
for (const t of testimonials) {
  const result = await post('testimonials', t);
  if (result) console.log(`  ✓ Testimonial: ${t.name}`);
}

console.log('\nDone.');
