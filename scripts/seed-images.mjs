/**
 * Seed images — imports from Unsplash into Directus, then updates each package.
 * Run: node scripts/seed-images.mjs
 */

const BASE = 'https://admin.myperfecttrips.com';
const TOKEN = 'LmVN-qWYDuvwiK8_wDnha6bSremeR7zd';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

// Map package slug → Unsplash image URL + alt text
const packageImages = [
  {
    slug: 'maldives-overwater-villa-escape',
    url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=85&fit=crop',
    title: 'Maldives Overwater Villas',
    alt: 'Overwater bungalows over turquoise lagoon in the Maldives',
  },
  {
    slug: 'bali-tropical-discovery-8-days',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85&fit=crop',
    title: 'Bali Rice Terraces',
    alt: 'Lush green rice terraces in Ubud, Bali',
  },
  {
    slug: 'dubai-city-desert-adventure',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85&fit=crop',
    title: 'Dubai Skyline at Night',
    alt: 'Dubai city skyline with Burj Khalifa at night',
  },
  {
    slug: 'thailand-island-hopper-phuket-krabi',
    url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200&q=85&fit=crop',
    title: 'Thailand Phi Phi Islands',
    alt: 'Crystal clear waters and limestone cliffs of Phi Phi Islands, Thailand',
  },
  {
    slug: 'santorini-athens-greek-island-dream',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85&fit=crop',
    title: 'Santorini Blue Domes',
    alt: 'Iconic blue-domed churches overlooking the Santorini caldera at sunset',
  },
  {
    slug: 'mauritius-all-inclusive-beach-holiday',
    url: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=85&fit=crop',
    title: 'Mauritius Beach',
    alt: 'Pristine white sand beach with turquoise water in Mauritius',
  },
  {
    slug: 'morocco-imperial-cities-explorer',
    url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=85&fit=crop',
    title: 'Marrakech Medina Morocco',
    alt: 'Colourful spice souk in the ancient medina of Marrakech, Morocco',
  },
  {
    slug: 'japan-cherry-blossom-culture-tour',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85&fit=crop',
    title: 'Japan Cherry Blossom',
    alt: 'Cherry blossom trees in full bloom with Mount Fuji in the background, Japan',
  },
  // Also update the existing 3 packages if they have no image
  {
    slug: 'dubai-abu-dhabi-romantic-escape',
    url: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1200&q=85&fit=crop',
    title: 'Dubai Abu Dhabi Desert Sunset',
    alt: 'Luxury resort pool with Dubai skyline at sunset',
    existingId: 1,
  },
  {
    slug: 'paris',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85&fit=crop',
    title: 'Paris Eiffel Tower',
    alt: 'Eiffel Tower at golden hour in Paris, France',
    existingId: 3,
  },
  {
    slug: 'north-turkey-trabzon-uzungol',
    url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=85&fit=crop',
    title: 'Turkey Green Mountains',
    alt: 'Lush green valley and lake in Uzungol, Turkey',
    existingId: 25,
  },
];

async function importImage(url, title) {
  const res = await fetch(`${BASE}/files/import`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url, data: { title } }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`  ✗ Import failed for "${title}":`, json.errors?.[0]?.message || JSON.stringify(json).slice(0, 120));
    return null;
  }
  return json.data?.id;
}

async function getPackageIdBySlug(slug) {
  const res = await fetch(
    `${BASE}/items/Packages?filter[slug][_eq]=${encodeURIComponent(slug)}&fields=id&limit=1`,
    { headers }
  );
  const json = await res.json();
  return json.data?.[0]?.id ?? null;
}

async function updatePackageImage(id, imageId, bannerImageId) {
  const res = await fetch(`${BASE}/items/Packages/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ image: imageId, banner_image: bannerImageId }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`  ✗ Update failed for package ${id}:`, json.errors?.[0]?.message);
    return false;
  }
  return true;
}

console.log('Importing images and updating packages...\n');

for (const pkg of packageImages) {
  process.stdout.write(`→ ${pkg.title} ... `);

  // Import the image into Directus
  const fileId = await importImage(pkg.url, pkg.title);
  if (!fileId) continue;

  // Get package ID by slug (or use hardcoded existingId)
  const pkgId = pkg.existingId ?? await getPackageIdBySlug(pkg.slug);
  if (!pkgId) {
    console.log(`skipped (package not found for slug: ${pkg.slug})`);
    continue;
  }

  // Update both image and banner_image with the same file
  const ok = await updatePackageImage(pkgId, fileId, fileId);
  if (ok) console.log(`✓  (file: ${fileId}, package: ${pkgId})`);
}

console.log('\nDone.');
