import directus from "@/lib/directus/client";
import { readItems } from "@directus/sdk";
import BlogListClient from "@/components/blog/BlogListClient";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let posts: any[] = [];

  try {
    // UPDATED: Using 'Blog_Posts' to match your access policy
    posts = await directus.request(readItems("Blog_Posts", {
      fields: ["id", "title", "slug", "image", "excerpt", "author", "published_date", "category"],
      sort: ["-published_date"]
    }));
  } catch (error: any) {
    console.error("Blog fetch error:", error.message || error);
  }

  // Generate unique categories for the pills
  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-white">
      {/* Cinematic Hero */}
      <section className="relative bg-[#020617] py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                Our Journal
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Travel <span className="text-blue-500">Stories.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
              Expertly curated insights from our travel specialists.
            </p>
          </div>
        </div>
      </section>

      <BlogListClient initialPosts={posts} categories={categories} />
    </div>
  );
}