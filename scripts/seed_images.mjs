// Import Unsplash images into Directus and attach to packages
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

async function importFile(token, url, filename, title) {
  const r = await fetch(`${BASE}/files/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ url, data: { title, filename_download: filename } }),
  });
  const d = await r.json();
  if (!d.data?.id) throw new Error(`Import failed for ${title}: ${JSON.stringify(d)}`);
  return d.data.id;
}

async function updatePackage(token, id, fields) {
  const r = await fetch(`${BASE}/items/packages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(fields),
  });
  return r.json();
}

// Unsplash direct image URLs
const U = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

const PACKAGES = [
  {
    id: 3,
    name: "Golden Triangle India Tour",
    image: { url: U("photo-1564507592333-c60657eea523"), file: "golden-triangle.jpg", title: "Taj Mahal Agra India" },
    destImage: { url: U("photo-1587474260584-136574528ed5", 800), file: "delhi-dest.jpg", title: "Delhi Red Fort" },
  },
  {
    id: 4,
    name: "Kerala Backwaters & Beaches",
    image: { url: U("photo-1602216056096-3b40cc0c9944"), file: "kerala-backwaters.jpg", title: "Kerala Backwaters Houseboat" },
    destImage: { url: U("photo-1602216056096-3b40cc0c9944", 800), file: "kerala-dest.jpg", title: "Kerala Backwaters" },
  },
  {
    id: 5,
    name: "Manali Himalayan Escape",
    image: { url: U("photo-1626015365107-37b4e3426c23"), file: "manali-mountains.jpg", title: "Manali Himalayan Mountains" },
    destImage: { url: U("photo-1626015365107-37b4e3426c23", 800), file: "manali-dest.jpg", title: "Manali Himalayas" },
  },
  {
    id: 6,
    name: "Maldives Luxury Overwater Villa",
    image: { url: U("photo-1514282401047-d79a71a590e8"), file: "maldives-villa.jpg", title: "Maldives Overwater Villa" },
    destImage: { url: U("photo-1514282401047-d79a71a590e8", 800), file: "maldives-dest.jpg", title: "Maldives Lagoon" },
  },
  {
    id: 7,
    name: "Dubai & Abu Dhabi Spectacular",
    image: { url: U("photo-1512453979798-5ea266f8880c"), file: "dubai-skyline.jpg", title: "Dubai Skyline Burj Khalifa" },
    destImage: { url: U("photo-1512453979798-5ea266f8880c", 800), file: "dubai-dest.jpg", title: "Dubai City" },
  },
  {
    id: 8,
    name: "Thailand Bangkok Phuket Getaway",
    image: { url: U("photo-1552465011-b4e21bf6e79a"), file: "thailand-phi-phi.jpg", title: "Thailand Phi Phi Island Beach" },
    destImage: { url: U("photo-1508009603885-50cf7c579365", 800), file: "bangkok-dest.jpg", title: "Bangkok Temple Thailand" },
  },
];

async function run() {
  const token = await login();
  console.log("Logged in.\n");

  for (const pkg of PACKAGES) {
    console.log(`📦 ${pkg.name}`);

    // Import package hero image
    let imageId, destImageId;
    try {
      process.stdout.write(`  → Importing package image...`);
      imageId = await importFile(token, pkg.image.url, pkg.image.file, pkg.image.title);
      console.log(` ✓ ${imageId}`);
    } catch (e) {
      console.log(` ✗ ${e.message}`);
    }

    // Import destination image (small, for thumbnail)
    try {
      process.stdout.write(`  → Importing destination image...`);
      destImageId = await importFile(token, pkg.destImage.url, pkg.destImage.file, pkg.destImage.title);
      console.log(` ✓ ${destImageId}`);
    } catch (e) {
      console.log(` ✗ ${e.message}`);
    }

    // Patch package
    const patch = {};
    if (imageId) patch.image = imageId;
    if (destImageId) patch.destination_image = destImageId;

    if (Object.keys(patch).length) {
      const res = await updatePackage(token, pkg.id, patch);
      if (res.data?.id) {
        console.log(`  ✓ Package updated\n`);
      } else {
        console.error(`  ✗ Update failed:`, JSON.stringify(res));
      }
    }
  }

  console.log("All done!");
}

run().catch(console.error);
