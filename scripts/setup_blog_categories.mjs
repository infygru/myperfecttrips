/**
 * Setup script: adds `category` + `tags` fields to blog_posts collection,
 * ensures public read permission, and seeds sample blog posts with categories & tags.
 *
 * Run: node scripts/setup_blog_categories.mjs
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

async function fieldExists(token, collection, field) {
    try {
        await apiCall(token, "GET", `/fields/${collection}/${field}`);
        return true;
    } catch {
        return false;
    }
}

const CATEGORY_CHOICES = [
    { text: "Destination Guide", value: "Destination Guide" },
    { text: "Travel Tips", value: "Travel Tips" },
    { text: "Honeymoon", value: "Honeymoon" },
    { text: "Corporate Travel", value: "Corporate Travel" },
    { text: "Budget Travel", value: "Budget Travel" },
    { text: "Adventure", value: "Adventure" },
    { text: "Food & Culture", value: "Food & Culture" },
    { text: "Wildlife", value: "Wildlife" },
    { text: "Family Travel", value: "Family Travel" },
];

const SAMPLE_POSTS = [
    {
        title: "Top 10 Honeymoon Destinations in India for 2026",
        slug: "top-10-honeymoon-destinations-india-2026",
        excerpt: "Discover the most romantic getaways across India — from the misty hills of Coorg to the pristine beaches of Andaman. Our travel experts share the best picks for couples in 2026.",
        content: `<p>India is home to some of the world's most breathtaking honeymoon destinations. Whether you prefer serene beaches, misty hill stations, or royal desert landscapes, there's a perfect spot for every couple.</p>
<h2>1. Andaman & Nicobar Islands</h2>
<p>Crystal-clear turquoise waters, pristine white sand beaches, and vibrant coral reefs make Andaman the top honeymoon pick for 2026. Stay at a private beachfront resort and enjoy snorkelling, scuba diving, and spectacular sunsets.</p>
<h2>2. Coorg, Karnataka</h2>
<p>Nestled in the Western Ghats, Coorg offers misty coffee plantations, lush forests, and cool mountain air. Luxury estate stays and intimate candlelight dinners set among rolling hills make it perfect for couples.</p>
<h2>3. Udaipur, Rajasthan</h2>
<p>The "City of Lakes" is pure romance — floating palace hotels, boat rides on Lake Pichola, and stunning sunset views from Monsoon Palace create unforgettable memories.</p>
<h2>4. Kashmir</h2>
<p>Shikara rides on Dal Lake at dawn, houseboat stays, and the snow-capped Himalayas in the background — Kashmir remains timeless in its romantic appeal.</p>
<h2>5. Goa</h2>
<p>Beyond the parties, Goa's quieter south offers secluded beaches, boutique resorts, and exceptional seafood — perfect for a relaxed, sun-kissed honeymoon.</p>
<p>At My Perfect Trips, we craft personalised honeymoon packages with exclusive upgrades, private dining arrangements, and seamless travel — all within your budget.</p>`,
        author: "Priya Nair",
        published_date: "2026-03-10T09:00:00Z",
        status: "Published",
        category: "Honeymoon",
        tags: ["honeymoon", "india", "romantic getaway", "andaman", "coorg", "udaipur"],
    },
    {
        title: "Ultimate Guide to Budget Travel in Southeast Asia",
        slug: "budget-travel-southeast-asia-guide",
        excerpt: "Explore Thailand, Vietnam, Bali, and more without breaking the bank. Our complete budget travel guide covers accommodation, food, transport, and insider tips to travel smart.",
        content: `<p>Southeast Asia remains one of the best-value travel destinations in the world. With the right planning, you can experience world-class beaches, ancient temples, vibrant street food, and rich culture — all on a shoestring budget.</p>
<h2>Thailand: The Classic Backpacker Trail</h2>
<p>Bangkok's street food scene, Chiang Mai's temples, and the islands of Koh Tao and Koh Lanta offer incredible value. Budget guesthouses start from £800 per night and a full street-food meal costs under £200.</p>
<h2>Vietnam: History, Noodles & Motorbikes</h2>
<p>From the French-colonial charm of Hanoi to the ancient town of Hoi An and the dramatic limestone karsts of Ha Long Bay, Vietnam packs extraordinary diversity into an affordable trip.</p>
<h2>Bali, Indonesia: Temples & Rice Terraces</h2>
<p>Ubud's spiritual heart, Seminyak's beach clubs, and the dramatic sea temples of Uluwatu — Bali is incredibly affordable when you stay in locally-owned homestays and eat at warungs.</p>
<h2>Money-Saving Tips</h2>
<ul><li>Travel shoulder season (April–May, September–October) for up to 40% lower hotel rates</li><li>Use overnight sleeper trains and buses to save on accommodation</li><li>Book group day tours for the best rates on snorkelling, trekking, and temple visits</li><li>Eat where the locals eat — street food is always the best and cheapest option</li></ul>
<p>My Perfect Trips offers affordable group tour packages to Southeast Asia starting from £35,000 per person, including flights, hotels, and guided tours.</p>`,
        author: "Arun Krishnamurthy",
        published_date: "2026-03-07T10:00:00Z",
        status: "Published",
        category: "Budget Travel",
        tags: ["budget travel", "southeast asia", "thailand", "vietnam", "bali", "backpacking"],
    },
    {
        title: "How to Plan the Perfect MICE Event Abroad",
        slug: "how-to-plan-mice-event-abroad",
        excerpt: "Planning a corporate incentive trip, conference, or product launch overseas? Our MICE specialists share a step-by-step framework for flawlessly executing events across international destinations.",
        content: `<p>Meetings, Incentives, Conferences, and Exhibitions (MICE) travel requires meticulous planning. A successful overseas corporate event can inspire teams, reward top performers, and elevate your brand image — but only when every detail is handled right.</p>
<h2>Step 1: Define Your Objectives</h2>
<p>Are you rewarding a sales team? Launching a product? Running a leadership offsite? Your event objective shapes everything from destination choice to venue selection and programme design.</p>
<h2>Step 2: Choose the Right Destination</h2>
<p>Popular MICE destinations from India include Dubai, Singapore, Bangkok, Bali, and Turkey. Each offers world-class convention facilities, premium hotel inventory, and excellent connectivity from major Indian cities.</p>
<h2>Step 3: Venue & Accommodation</h2>
<p>Select a property that can handle both event space and room blocks under one roof. This simplifies logistics and allows for negotiating a better package rate. Always request AV equipment, F&B packages, and team-building activity options upfront.</p>
<h2>Step 4: Visa & Travel Logistics</h2>
<p>For groups of 50+, visa processing can begin 6–8 weeks in advance. My Perfect Trips handles group visa applications, airport transfers, and customised welcome kits to make arrivals smooth.</p>
<h2>Step 5: Programme Design</h2>
<p>The best MICE trips blend business sessions with unique local experiences — a desert safari in Dubai, a cooking class in Bangkok, or a sunset cruise in Singapore create memories that outlast the conference itself.</p>
<p>Contact our MICE specialists at My Perfect Trips for a tailored proposal for your next corporate event.</p>`,
        author: "Suresh Ramachandran",
        published_date: "2026-03-05T08:00:00Z",
        status: "Published",
        category: "Corporate Travel",
        tags: ["MICE", "corporate travel", "incentive trips", "conference", "Dubai", "Singapore"],
    },
    {
        title: "Exploring Rajasthan: A 7-Day Golden Triangle & Desert Itinerary",
        slug: "rajasthan-7-day-golden-triangle-desert-itinerary",
        excerpt: "From the pink streets of Jaipur to the golden dunes of Jaisalmer and the romantic lakes of Udaipur — this 7-day Rajasthan itinerary covers the best of India's royal state.",
        content: `<p>Rajasthan is India at its most theatrical — blazing colours, majestic forts, opulent palaces, and a rich cultural heritage that stretches back centuries. Here's a 7-day itinerary that covers the very best.</p>
<h2>Day 1–2: Jaipur – The Pink City</h2>
<p>Start at Amber Fort, a hill-top masterpiece of Rajput and Mughal architecture. Then explore the City Palace, the astronomical wonder of Jantar Mantar, and the iconic Hawa Mahal (Palace of Winds). Evening at Chokhi Dhani for an immersive Rajasthani folk experience.</p>
<h2>Day 3: Pushkar</h2>
<p>The sacred town of Pushkar, with its 52 ghats surrounding Pushkar Lake and the famous Brahma Temple, is a world away from Jaipur's bustle. An afternoon of wandering the bazaars and rooftop chai completes the day.</p>
<h2>Day 4–5: Jodhpur – The Blue City</h2>
<p>Mehrangarh Fort dominates the skyline of Jodhpur — its ramparts offer sweeping views over a sea of blue-painted houses. Explore the fort museum, the narrow lanes of the old city, and savour the legendary mirchi bada (spiced chili fritters).</p>
<h2>Day 6: Jaisalmer – The Golden City</h2>
<p>The drive to Jaisalmer cuts through the Thar Desert. The honey-coloured sandstone Jaisalmer Fort, rising from the dunes, is one of India's most dramatic sights. An evening camel ride and desert camp stay under the stars are unmissable.</p>
<h2>Day 7: Udaipur – City of Lakes</h2>
<p>End your Rajasthan journey in the romance capital of India. The Lake Palace hotel floating on Lake Pichola, the City Palace, and a boat ride at sunset make for a perfect finale.</p>
<p>My Perfect Trips offers customised Rajasthan tour packages with palace hotel stays, private car and driver, and professional guides throughout.</p>`,
        author: "Meena Sharma",
        published_date: "2026-03-01T10:00:00Z",
        status: "Published",
        category: "Destination Guide",
        tags: ["rajasthan", "jaipur", "udaipur", "golden triangle", "india tour", "heritage"],
    },
    {
        title: "Trekking in the Himalayas: Essential Tips for First-Timers",
        slug: "trekking-himalayas-tips-first-timers",
        excerpt: "Planning your first Himalayan trek? From Kedarkantha to the Valley of Flowers, we cover everything you need to know — fitness prep, gear essentials, altitude sickness, and the best beginner trails.",
        content: `<p>The Himalayas are home to some of the world's most awe-inspiring trekking routes. For first-timers, the prospect can feel overwhelming — but with the right preparation, a Himalayan trek becomes a life-changing experience.</p>
<h2>Best Beginner Treks</h2>
<p><strong>Kedarkantha (Uttarakhand):</strong> A winter snowtrek to 3,810m with stunning 360° views of peaks including Swargarohini and Bandarpoonch. 6 days, moderate grade.</p>
<p><strong>Valley of Flowers (Uttarakhand):</strong> A UNESCO World Heritage Site carpeted with alpine wildflowers in bloom (July–September). 6 days from Govindghat, easy to moderate.</p>
<p><strong>Triund (Himachal Pradesh):</strong> A 1-day trek from Dharamshala offering panoramic views of the Dhauladhar range. Perfect for total beginners.</p>
<h2>Fitness Preparation</h2>
<p>Start cardio training (running, cycling, swimming) at least 6 weeks before your trek. Focus on leg strength and stamina. Walk uphill on a treadmill with a loaded backpack to simulate conditions.</p>
<h2>Altitude Sickness</h2>
<p>Acclimatise properly — don't rush ascent. Follow the "climb high, sleep low" principle. Stay hydrated, avoid alcohol, and carry Diamox (consult a doctor first). Know the symptoms: headache, nausea, dizziness.</p>
<h2>Essential Gear</h2>
<ul><li>Layered clothing system (base layer, mid layer, outer shell)</li><li>Sturdy waterproof trekking boots (broken in before the trek)</li><li>Trekking poles — a must for steep descents</li><li>Headlamp with extra batteries</li><li>High-SPF sunscreen and UV-protection sunglasses</li></ul>
<p>My Perfect Trips organises group and customised Himalayan treks with certified guides, quality equipment, and full safety support.</p>`,
        author: "Vikram Nair",
        published_date: "2026-02-25T09:00:00Z",
        status: "Published",
        category: "Adventure",
        tags: ["trekking", "himalayas", "adventure travel", "kedarkantha", "valley of flowers", "outdoor"],
    },
    {
        title: "10 Visa-Free Countries Indians Can Visit in 2026",
        slug: "visa-free-countries-for-indians-2026",
        excerpt: "Travelling on an Indian passport just got easier. Here are 10 incredible destinations where Indian citizens can visit without a prior visa — or get one on arrival hassle-free.",
        content: `<p>The Indian passport offers visa-free or visa-on-arrival access to over 60 destinations worldwide. From tropical island paradises to culturally rich Southeast Asian countries, there are more options than ever for hassle-free international travel.</p>
<h2>1. Thailand (Visa on Arrival)</h2>
<p>One of the most popular international destinations for Indians, Thailand offers a 30-day visa on arrival. Bangkok, Phuket, Chiang Mai, and Koh Samui await.</p>
<h2>2. Maldives (Visa Free)</h2>
<p>The Maldives grants Indian visitors a free 30-day visa on arrival. Overwater bungalows, crystal lagoons, and world-class diving are just a flight away.</p>
<h2>3. Nepal (Visa Free)</h2>
<p>Indians can visit Nepal without any visa — just carry your Indian passport or Voter ID card. Kathmandu, Pokhara, and Everest Base Camp await.</p>
<h2>4. Indonesia – Bali (Visa Free)</h2>
<p>Since May 2023, Indians with a valid passport can visit Bali visa-free for up to 30 days under the Visa Free programme.</p>
<h2>5. Sri Lanka (Visa Free)</h2>
<p>Sri Lanka currently grants Indian tourists free access for 30 days. Explore ancient temples, tea plantations, pristine beaches, and incredible wildlife.</p>
<h2>6. Bhutan (Visa Free)</h2>
<p>Indians can enter Bhutan visa-free, though a Sustainable Development Fee (SDF) of approximately USD 100/day applies. The kingdom's pristine monasteries and dramatic mountain scenery are worth every penny.</p>
<h2>7. Cambodia (Visa on Arrival)</h2>
<p>A single-entry, 30-day tourist visa is available on arrival at major entry points. The temples of Angkor Wat are a once-in-a-lifetime experience.</p>
<h2>8. Malaysia (Visa Free for 30 days)</h2>
<p>Indians can visit Malaysia for up to 30 days without a visa. Kuala Lumpur, Penang's street food, and the beaches of Langkawi are all incredibly accessible.</p>
<h2>9. Qatar (Visa Free)</h2>
<p>Indian passport holders can visit Qatar visa-free for up to 30 days — making Doha a great stopover or short trip destination.</p>
<h2>10. Jordan (Visa on Arrival)</h2>
<p>Petra, Wadi Rum, the Dead Sea, and Aqaba are all accessible with a visa on arrival for Indian travellers.</p>
<p>My Perfect Trips' visa assistance team can help you prepare documents for any destination, even if a prior visa is required.</p>`,
        author: "Ananya Pillai",
        published_date: "2026-02-20T10:00:00Z",
        status: "Published",
        category: "Travel Tips",
        tags: ["visa free", "indian passport", "international travel", "maldives", "thailand", "travel tips"],
    },
];

async function main() {
    console.log("🔑 Authenticating...");
    const token = await getToken();
    if (!token) throw new Error("Authentication failed");

    // 1. Add `category` field to blog_posts
    if (await fieldExists(token, "blog_posts", "category")) {
        console.log("↩️  Field `category` already exists in blog_posts");
    } else {
        console.log("📝 Adding `category` field to blog_posts...");
        await apiCall(token, "POST", "/fields/blog_posts", {
            field: "category",
            type: "string",
            meta: {
                interface: "select-dropdown",
                display: "labels",
                options: { choices: CATEGORY_CHOICES },
                note: "Blog post category for filtering",
            },
        });
        console.log("✅ Added `category` field");
    }

    // 2. Add `tags` field to blog_posts
    if (await fieldExists(token, "blog_posts", "tags")) {
        console.log("↩️  Field `tags` already exists in blog_posts");
    } else {
        console.log("📝 Adding `tags` field to blog_posts...");
        await apiCall(token, "POST", "/fields/blog_posts", {
            field: "tags",
            type: "json",
            meta: {
                interface: "tags",
                display: "labels",
                note: "Comma-separated tags for this post",
            },
        });
        console.log("✅ Added `tags` field");
    }

    // 3. Ensure public read permission exists for blog_posts
    console.log("🔐 Checking public read permission for blog_posts...");
    try {
        await apiCall(token, "POST", "/permissions", {
            policy: PUBLIC_POLICY_ID,
            collection: "blog_posts",
            action: "read",
            fields: "*",
        });
        console.log("✅ Public read permission granted for blog_posts");
    } catch (e) {
        if (e.message?.includes("400") || e.message?.includes("already") || e.message?.includes("unique")) {
            console.log("↩️  Public read permission already exists");
        } else {
            console.warn("⚠️  Permission setup warning:", e.message);
        }
    }

    // 4. Get existing blog posts
    console.log("\n📖 Checking existing blog posts...");
    let existingPosts = [];
    try {
        const res = await apiCall(token, "GET", "/items/blog_posts?limit=200&sort=-id");
        existingPosts = res.data || [];
    } catch (e) {
        console.warn("⚠️  Could not fetch existing posts:", e.message);
    }
    console.log(`   Found ${existingPosts.length} existing blog posts`);

    // 5. Update existing posts that have no category
    const postsWithoutCategory = existingPosts.filter((p) => !p.category);
    if (postsWithoutCategory.length > 0) {
        console.log(`\n🏷️  Assigning categories to ${postsWithoutCategory.length} existing posts without categories...`);
        const fallbackCategories = ["Destination Guide", "Travel Tips", "Adventure", "Family Travel"];
        for (let i = 0; i < postsWithoutCategory.length; i++) {
            const post = postsWithoutCategory[i];
            const cat = fallbackCategories[i % fallbackCategories.length];
            try {
                await apiCall(token, "PATCH", `/items/blog_posts/${post.id}`, {
                    category: cat,
                    tags: ["travel", "india"],
                });
                console.log(`   ✅ Updated post "${post.title?.slice(0, 40)}" → category: ${cat}`);
            } catch (e) {
                console.warn(`   ⚠️  Could not update post ${post.id}:`, e.message);
            }
        }
    }

    // 6. Seed sample posts (only if fewer than 4 published posts exist)
    const publishedCount = existingPosts.filter((p) => p.status === "Published").length;
    if (publishedCount >= 4) {
        console.log(`\n✅ Already have ${publishedCount} published posts — skipping sample seed`);
    } else {
        const toCreate = SAMPLE_POSTS.slice(0, Math.max(0, 6 - publishedCount));
        console.log(`\n🌱 Seeding ${toCreate.length} sample blog posts...`);
        for (const post of toCreate) {
            // Skip if slug already exists
            const existing = existingPosts.find((p) => p.slug === post.slug);
            if (existing) {
                console.log(`   ↩️  Post with slug "${post.slug}" already exists`);
                continue;
            }
            try {
                await apiCall(token, "POST", "/items/blog_posts", post);
                console.log(`   ✅ Created: "${post.title.slice(0, 50)}"`);
            } catch (e) {
                console.warn(`   ⚠️  Could not create post "${post.slug}":`, e.message);
            }
        }
    }

    console.log("\n🎉 Blog categories & tags setup complete!");
    console.log("   → Category field added to blog_posts");
    console.log("   → Tags field added to blog_posts");
    console.log("   → Sample posts seeded with categories");
    console.log("\n   Run the app and visit /blog to see categories in action!");
}

main().catch((e) => {
    console.error("❌ Setup failed:", e.message);
    process.exit(1);
});
