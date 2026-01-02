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
      country: pkg.destination?.country || pkg.destination?.name || "",
      duration: pkg.duration || pkg.Duration || "5",
      image: pkg.image || pkg.Image || null,
      tags: pkg.tags || pkg.Tags || [],
      category: pkg.category || pkg.Category || "",
      slug: pkg.slug || pkg.Slug || "#",
      rating: pkg.rating || pkg.Rating || 5,
    }));

    console.log(`✅ Successfully fetched ${packages.length} items from 'Packages'.`);

  } catch (error: any) {
    console.error("❌ Error fetching 'Packages':", error.errors?.[0]?.message || error.message);
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER SECTION */}
      {/* HEADER SECTION - PREMIUM DARK */}
      <div className="relative bg-[#0B1120] text-white py-24 border-b border-white/5 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative container mt-16 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Find Your <span className="text-brand-blue">Perfect Trip</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
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