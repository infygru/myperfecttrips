import directus from "@/lib/directus/client";
import { readItems } from "@directus/sdk";
import PackageList from "@/components/packages/PackageList";

// Force dynamic rendering to ensure fresh data on every load
export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
  let packages: any[] = [];

  try {
    // 1. Fetch from 'Packages' (Capital P) with 'destination' relationship
    const rawPackages = await directus.request(readItems("Packages", {
      fields: ["*", "image.*", "destination.*"], // Get top-level, image, and related destination
    }));

    // 2. Normalize Data
    packages = rawPackages.map((pkg: any) => ({
      id: pkg.id,
      title: pkg.title || pkg.Title || "Untitled Package",
      description: pkg.description || pkg.Description || "",
      price: Number(pkg.price || pkg.Price || 0),
      // Use related Destination name, fallback to text field
      location: pkg.destination?.name || pkg.location || pkg.Location || "International",
      // Add country for filtering
      // Add country for filtering
      country: pkg.destination?.country || pkg.destination?.name || "",
      duration: pkg.duration_days || pkg.duration || "5",
      nights: pkg.duration_nights || (pkg.duration_days ? Number(pkg.duration_days) - 1 : 4),
      image: pkg.image || pkg.Image || null,
      tags: pkg.tags || pkg.Tags || [],
      category: pkg.category || pkg.Category || "",
      slug: pkg.slug || pkg.Slug || "#",
      rating: pkg.rating || pkg.Rating || 5,
    }));

  } catch (error: any) {
    console.error("❌ Error fetching 'Packages':", error.errors?.[0]?.message || error.message);
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER SECTION */}
      {/* HEADER SECTION - PREMIUM DARK */}
      {/* HEADER SECTION - PREMIUM REDESIGN */}
      {/* HEADER SECTION - LIGHT THEME REDESIGN */}
      {/* Added mt-[72px] to physically push content below fixed header, ensuring no overlap */}
      {/* HEADER SECTION - CLEAN & STABLE */}
      {/* HEADER SECTION - PROFESSIONAL DARK THEME */}
      {/* HEADER SECTION - MAJESTIC HERO (REFINED HEIGHT & IMAGE) */}
      <div className="relative isolate h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop"
            alt="Majestic Landscape"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          {/* Heavy Overlay for Maximum Readability */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/80" />
        </div>

        <div className="relative container mx-auto px-4 text-center z-10 pt-20">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md shadow-lg">
            Curated Experiences
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Find Your <span className="text-sky-400">Perfect Trip</span>
          </h1>

          <p className="text-slate-200 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg text-shadow-sm">
            Explore our handpicked itineraries designed to give you the most memorable experiences across the globe.
          </p>
        </div>
      </div>

      {/* ERROR MESSAGE (Only visible if fetch failed) */}
      {packages.length === 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex flex-col gap-2">
            <strong>No packages loaded.</strong>
            <p className="text-sm">
              This usually means permissions are missing. <br />
              1. Go to Directus &gt; Settings &gt; Roles &gt; Public. <br />
              2. Click the <strong>Packages</strong> collection and check <strong>Read</strong> (Eye Icon).
            </p>
          </div>
        </div>
      )}

      {/* FILTERABLE LIST */}
      <PackageList packages={packages} />

    </div>
  );
}