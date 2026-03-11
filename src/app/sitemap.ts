import { MetadataRoute } from "next";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Base static routes
  const routes = [
    "",
    "/packages",
    "/contact",
    "/about-us",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/cookie-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : route === "/packages" ? 0.9 : 0.7,
  }));

  // Packages
  let packages: any[] = [];
  try {
    packages = await directus.request(
      readItems("packages" as any, { fields: ["slug", "date_updated"] as any })
    );
  } catch (err) {
    console.error("Sitemap error: fetching packages", err);
  }

  const packageRoutes = packages.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.slug}`,
    lastModified: pkg.date_updated ? new Date(pkg.date_updated).toISOString() : new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blogs
  let blogs: any[] = [];
  try {
    blogs = await directus.request(
        readItems("blog_posts" as any, { fields: ["slug", "date_updated"] as any })
    );
  } catch (err) {
      console.error("Sitemap error: fetching blogs", err);
  }

  const blogRoutes = blogs.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date_updated ? new Date(post.date_updated).toISOString() : new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
  }));

  return [...routes, ...packageRoutes, ...blogRoutes];
}
