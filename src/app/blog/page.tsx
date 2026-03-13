import { unstable_noStore as noStore } from "next/cache";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, User } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Travel Blog | IG Holidays – Tips, Guides & Destination Stories",
    description:
        "Explore travel guides, destination tips, and holiday inspiration from IG Holidays' expert travel team. Your go-to resource for planning the perfect trip.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com"}/blog`,
    },
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function readTime(content?: string) {
    if (!content) return "5 min read";
    const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default async function BlogPage() {
    noStore();
    let posts: any[] = [];
    try {
        posts = (await directus.request(
            readItems("blog_posts" as any, { limit: 100, sort: ["-id"] as any })
        )) as any[];
    } catch {}

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const [featured, ...rest] = posts;

    return (
        <main className="min-h-screen bg-stone-50">

            {/* ── HERO HEADER ── */}
            <section className="relative bg-brand-950 overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #d4af37 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)" }} />
                <div className="relative container-inner py-24 pb-20 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-400 mb-6">
                        <BookOpen className="h-3.5 w-3.5" />
                        Travel Journal
                    </div>
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-tight tracking-tight mb-5">
                        Stories, Guides &<br className="hidden sm:block" /> Travel Inspiration
                    </h1>
                    <p className="text-stone-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        Insider guides, destination inspiration, and travel tips curated by our expert travel team.
                    </p>
                </div>
                {/* bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-stone-50 to-transparent" />
            </section>

            <div className="container-inner pt-6 pb-20">

                {/* ── FEATURED POST ── */}
                {featured && (
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-px flex-1 bg-stone-200" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Featured Story</span>
                            <div className="h-px flex-1 bg-stone-200" />
                        </div>

                        <Link
                            href={`/blog/${featured.slug || featured.id}`}
                            className="group grid lg:grid-cols-[1fr_480px] overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-2xl hover:shadow-stone-200/60 hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative aspect-[16/9] lg:aspect-auto min-h-[280px] overflow-hidden bg-stone-100">
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
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
                                <span className="absolute top-4 left-4 rounded-full bg-gold-400 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-stone-950 shadow-sm">
                                    Featured
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center p-7 sm:p-10">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-5">
                                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-600">
                                        <User className="h-3 w-3" />
                                        {featured.author || "Editorial Team"}
                                    </span>
                                    {featured.published_date && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(featured.published_date)}
                                        </span>
                                    )}
                                    <span className="text-[11px] font-semibold text-stone-400">
                                        {readTime(featured.content)}
                                    </span>
                                </div>

                                <h2 className="font-serif text-2xl sm:text-3xl font-medium leading-tight text-brand-950 group-hover:text-brand-700 transition-colors mb-4">
                                    {featured.title}
                                </h2>

                                {featured.excerpt && (
                                    <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-7">
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
                {rest.length > 0 && (
                    <>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px flex-1 bg-stone-200" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                {featured ? "More Articles" : "All Articles"}
                            </span>
                            <div className="h-px flex-1 bg-stone-200" />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {rest.map((post) => {
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
                                                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 flex items-center justify-center">
                                                    <BookOpen className="h-10 w-10 text-white/20" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div className="flex flex-col flex-1 p-5">
                                            {/* Meta */}
                                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                                                    {post.author || "Editorial Team"}
                                                </span>
                                                {post.published_date && (
                                                    <>
                                                        <span className="text-stone-300">·</span>
                                                        <span className="text-[10px] text-stone-400">
                                                            {new Date(post.published_date).toLocaleDateString("en-IN", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </>
                                                )}
                                                <span className="text-stone-300">·</span>
                                                <span className="text-[10px] text-stone-400">{readTime(post.content)}</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-serif text-[17px] font-medium leading-snug text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2 mb-2">
                                                {post.title}
                                            </h3>

                                            {/* Excerpt */}
                                            {post.excerpt && (
                                                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {/* CTA */}
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

                {/* Only featured, no rest */}
                {posts.length === 1 && featured && (
                    <p className="text-center text-stone-400 text-sm mt-4">More articles coming soon — stay tuned!</p>
                )}

                {/* ── EMPTY STATE ── */}
                {posts.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-28 text-center px-6">
                        <BookOpen className="h-12 w-12 text-stone-300 mb-4" />
                        <p className="font-serif text-2xl font-medium text-brand-950 mb-2">Coming Soon</p>
                        <p className="text-stone-500 text-sm max-w-xs">
                            We&apos;re crafting new travel stories. Check back soon for destination guides and tips!
                        </p>
                    </div>
                )}

                {/* ── NEWSLETTER / CTA STRIP ── */}
                <div className="mt-16 rounded-2xl bg-brand-950 px-6 py-10 sm:px-10 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-serif text-2xl font-medium text-white mb-1.5">Planning your next trip?</p>
                        <p className="text-stone-400 text-sm">Let our experts craft the perfect holiday for you.</p>
                    </div>
                    <Link href="/contact" className="btn-gold shrink-0 text-sm">
                        Talk to an Expert
                    </Link>
                </div>
            </div>
        </main>
    );
}
