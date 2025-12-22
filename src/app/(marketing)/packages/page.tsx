import directus from "@/lib/directus/client";
import { readItems } from "@directus/sdk";
import PackageList from "@/components/packages/PackageList";

// Force dynamic rendering to ensure fresh data on every load
export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
  let packages: any[] = [];

  try {
    // 1. Fetch from 'Packages' (Capital P)
    // We fetch "*.*" to get all fields plus nested image data
    const rawPackages = await directus.request(readItems("Packages", {
      fields: ["*.*"], 
      // Removed 'sort' to prevent 403 Forbidden errors on system fields
    }));

    // 2. Normalize Data
    // This ensures that whether fields are 'Title' or 'title', the app won't break.
    packages = rawPackages.map((pkg: any) => ({
      id: pkg.id,
      title: pkg.title || pkg.Title || "Untitled Package",
      description: pkg.description || pkg.Description || "",
      price: Number(pkg.price || pkg.Price || 0),
      location: pkg.location || pkg.Location || "International",
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
      <div className="bg-[#0B1120] text-white py-20 border-b border-white/5">
        <div className="container mt-20 mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Trip</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
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
                This usually means permissions are missing. <br/>
                1. Go to Directus &gt; Settings &gt; Roles &gt; Public. <br/>
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