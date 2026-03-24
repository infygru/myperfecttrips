import { MetadataRoute } from "next";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myperfecttrips.com";

  const staticRoutes: { path: string; freq: "daily" | "weekly" | "monthly"; priority: number }[] = [
    { path: "",                freq: "daily",   priority: 1.0 },
    { path: "/packages",       freq: "daily",   priority: 0.9 },
    { path: "/services",       freq: "weekly",  priority: 0.85 },
    { path: "/blog",           freq: "weekly",  priority: 0.8 },
    { path: "/about",          freq: "monthly", priority: 0.7 },
    { path: "/contact",        freq: "monthly", priority: 0.7 },
    { path: "/privacy-policy", freq: "monthly", priority: 0.4 },
    { path: "/terms",          freq: "monthly", priority: 0.4 },
    { path: "/refund-policy",  freq: "monthly", priority: 0.4 },
    { path: "/cookie-policy",  freq: "monthly", priority: 0.4 },
  ];

  const routes = staticRoutes.map(({ path, freq, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: freq,
    priority,
  }));

  // Dynamic package routes
  let packages: any[] = [];
  try {
    packages = await directus.request(
      readItems("packages" as any, { fields: ["slug", "date_updated"] as any, limit: 500 })
    );
  } catch (err) {
    console.error("Sitemap: failed to fetch packages", err);
  }
  const packageRoutes = packages
    .filter((p) => p.slug)
    .map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.slug}`,
      lastModified: pkg.date_updated ? new Date(pkg.date_updated).toISOString() : new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Dynamic blog routes
  let blogs: any[] = [];
  try {
    blogs = await directus.request(
      readItems("blog_posts" as any, { fields: ["slug", "date_updated"] as any, limit: 500 })
    );
  } catch (err) {
    console.error("Sitemap: failed to fetch blog posts", err);
  }
  const blogRoutes = blogs
    .filter((b) => b.slug)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date_updated ? new Date(post.date_updated).toISOString() : new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

  return [...routes, ...packageRoutes, ...blogRoutes];
}
