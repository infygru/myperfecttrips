import { unstable_noStore as noStore } from "next/cache";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Search, User } from "lucide-react";
import { Suspense } from "react";
import BlogFilters from "@/components/BlogFilters";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Travel Blog | IG Holidays – Tips, Guides & Destination Stories",
    description:
        "Explore travel guides, destination tips, and holiday inspiration from IG Holidays' expert travel team.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com"}/blog`,
    },
};

type PageProps = {
    searchParams: Promise<{ search?: string; category?: string }>;
};

function readTime(content?: string) {
    if (!content) return "5 min read";
    const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default async function BlogPage({ searchParams }: PageProps) {
    noStore();
    const { search = "", category = "" } = await searchParams;

    let allPosts: any[] = [];
    try {
        allPosts = (await directus.request(
            readItems("blog_posts" as any, { limit: 200, sort: ["-id"] as any })
        )) as any[];
    } catch {}

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

    // Extract unique categories
    const categories = [...new Set(allPosts.map((p: any) => p.category).filter(Boolean))] as string[];

    // Filter
    let posts = allPosts;
    if (search) {
        const q = search.toLowerCase();
        posts = posts.filter(
            (p) =>
                p.title?.toLowerCase().includes(q) ||
                p.excerpt?.toLowerCase().includes(q) ||
                p.author?.toLowerCase().includes(q)
        );
    }
    if (category) {
        posts = posts.filter((p) => p.category === category);
    }

    const [featured, ...rest] = !search && !category ? posts : [];
    const gridPosts = search || category ? posts : rest;

    const isFiltered = !!(search || category);

    return (
        <main className="min-h-screen bg-stone-50">

            {/* ── HERO HEADER ── */}
            <section className="relative bg-brand-950 pt-20 pb-16 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                <div className="container-inner relative text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-400 mb-5">
                        <BookOpen className="h-3.5 w-3.5" />
                        Travel Journal
                    </div>
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-tight tracking-tight mb-4">
                        Stories &amp; Travel Guides
                    </h1>
                    <p className="text-stone-400 text-base max-w-lg mx-auto leading-relaxed">
                        Destination inspiration, travel tips, and insider guides from our expert travel team.
                    </p>
                </div>
            </section>

            <div className="container-inner py-10 pb-20">

                {/* ── SEARCH & FILTERS ── */}
                <Suspense
                    fallback={
                        <div className="mb-8 flex gap-3 animate-pulse">
                            <div className="h-11 flex-1 rounded-xl bg-stone-200" />
                        </div>
                    }
                >
                    <BlogFilters categories={categories} />
                </Suspense>

                {/* ── FILTER STATUS ── */}
                {isFiltered && (
                    <p className="mb-6 text-sm text-stone-500">
                        {posts.length === 0
                            ? "No articles found"
                            : `${posts.length} article${posts.length !== 1 ? "s" : ""} found${search ? ` for "${search}"` : ""}${category ? ` in ${category}` : ""}`}
                    </p>
                )}

                {/* ── FEATURED POST (only when no filter) ── */}
                {!isFiltered && featured && (
                    <div className="mb-12">
                        <Link
                            href={`/blog/${featured.slug || featured.id}`}
                            className="group grid lg:grid-cols-[1fr_480px] overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-2xl hover:shadow-stone-300/40 hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative min-h-[240px] lg:min-h-[320px] overflow-hidden bg-stone-100">
                                {featured.featured_image ? (
                                    <Image
                                        src={`${dUrl}/assets/${featured.featured_image}`}
                                        alt={featured.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        unoptimized
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950 flex items-center justify-center">
                                        <BookOpen className="h-16 w-16 text-white/10" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <span className="absolute top-4 left-4 rounded-full bg-gold-400 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-stone-950">
                                    Featured
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center p-7 sm:p-10">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-600">
                                        <User className="h-3 w-3" />
                                        {featured.author || "Editorial Team"}
                                    </span>
                                    {featured.published_date && (
                                        <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(featured.published_date).toLocaleDateString("en-IN", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    )}
                                    <span className="text-[11px] text-stone-400">{readTime(featured.content)}</span>
                                </div>

                                <h2 className="font-serif text-2xl sm:text-3xl font-medium leading-tight text-brand-950 group-hover:text-brand-700 transition-colors mb-4">
                                    {featured.title}
                                </h2>

                                {featured.excerpt && (
                                    <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-8">
                                        {featured.excerpt}
                                    </p>
                                )}

                                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-brand-700">
                                    Read Full Article
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* ── ARTICLES GRID ── */}
                {gridPosts.length > 0 && (
                    <>
                        {!isFiltered && (
                            <h2 className="font-serif text-xl font-medium text-brand-950 mb-6">
                                More Articles
                            </h2>
                        )}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {gridPosts.map((post: any) => {
                                const imgUrl = post.featured_image
                                    ? `${dUrl}/assets/${post.featured_image}`
                                    : null;
                                return (
                                    <Link
                                        key={post.id}
                                        href={`/blog/${post.slug || post.id}`}
                                        className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200 hover:shadow-xl hover:shadow-stone-200/60 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 shrink-0">
                                            {imgUrl ? (
                                                <Image
                                                    src={imgUrl}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950 flex items-center justify-center">
                                                    <BookOpen className="h-10 w-10 text-white/15" />
                                                </div>
                                            )}
                                            {post.category && (
                                                <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-800">
                                                    {post.category}
                                                </span>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div className="flex flex-col flex-1 p-5">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                                                    {post.author || "Editorial Team"}
                                                </span>
                                                {post.published_date && (
                                                    <>
                                                        <span className="text-stone-300 text-xs">·</span>
                                                        <span className="text-[10px] text-stone-400">
                                                            {new Date(post.published_date).toLocaleDateString("en-IN", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </>
                                                )}
                                                <span className="text-stone-300 text-xs">·</span>
                                                <span className="text-[10px] text-stone-400">{readTime(post.content)}</span>
                                            </div>

                                            <h3 className="font-serif text-[17px] font-medium leading-snug text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2 mb-2">
                                                {post.title}
                                            </h3>

                                            {post.excerpt && (
                                                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-bold text-brand-700">
                                                Read Article
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* ── EMPTY STATE ── */}
                {posts.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-28 text-center px-6">
                        <Search className="h-12 w-12 text-stone-300 mb-4" />
                        <p className="font-serif text-xl font-medium text-brand-950 mb-2">
                            {allPosts.length === 0 ? "Coming Soon" : "No results found"}
                        </p>
                        <p className="text-stone-500 text-sm max-w-xs">
                            {allPosts.length === 0
                                ? "We're crafting new travel stories. Check back soon!"
                                : `No articles match "${search || category}". Try a different search.`}
                        </p>
                    </div>
                )}

                {/* ── CTA STRIP ── */}
                <div className="mt-14 overflow-hidden rounded-2xl bg-brand-950">
                    <div className="px-7 py-10 sm:px-10 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-serif text-2xl font-medium text-white mb-1.5">
                                Planning your next trip?
                            </p>
                            <p className="text-stone-400 text-sm">
                                Let our experts craft the perfect holiday for you.
                            </p>
                        </div>
                        <Link href="/contact" className="btn-gold shrink-0 text-sm">
                            Talk to an Expert
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
