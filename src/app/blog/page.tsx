import { unstable_noStore as noStore } from "next/cache";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Travel Blog | IG Holidays – Tips, Guides & Destination Stories",
    description: "Explore travel guides, destination tips, and holiday inspiration from IG Holidays' expert travel team. Your go-to resource for planning the perfect trip.",
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com"}/blog` },
};

export default async function BlogPage() {
    noStore();
    let posts: any[] = [];
    try {
        posts = (await directus.request(
            readItems("blog_posts" as any, { limit: 100, sort: ["-id"] as any })
        )) as any[];
    } catch { }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const [featured, ...rest] = posts;

    return (
        <main className="min-h-screen bg-stone-50">

            {/* ── HEADER ── */}
            <section className="bg-white border-b border-stone-100 pt-20 pb-10 px-4">
                <div className="container-inner">
                    <span className="section-label">Travel Journal</span>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-2">
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-brand-950 tracking-tight">
                            Stories & Insights
                        </h1>
                        <p className="text-stone-500 text-sm max-w-sm leading-relaxed">
                            Insider guides, destination inspiration, and travel tips curated by our experts.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container-inner py-10 pb-20">

                {/* ── FEATURED POST ── */}
                {featured && (
                    <Link href={`/blog/${featured.slug || featured.id}`}
                        className="group mb-10 flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="relative w-full sm:w-2/5 aspect-[16/9] sm:aspect-auto overflow-hidden bg-stone-100 shrink-0">
                            {featured.featured_image ? (
                                <Image src={`${dUrl}/assets/${featured.featured_image}`} alt={featured.title}
                                    fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized priority />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950" />
                            )}
                            <span className="absolute top-3 left-3 rounded-full bg-gold-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-stone-950">
                                Featured
                            </span>
                        </div>
                        <div className="flex flex-col justify-center p-6 sm:p-10 flex-1">
                            <div className="flex items-center gap-3 mb-4 text-[11px] font-bold uppercase tracking-widest text-stone-400">
                                <span className="text-brand-600">{featured.author || "Editorial Team"}</span>
                                {featured.published_date && (
                                    <>
                                        <span>·</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(featured.published_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                                        </span>
                                    </>
                                )}
                            </div>
                            <h2 className="font-serif text-2xl sm:text-3xl font-medium leading-snug text-brand-950 group-hover:text-brand-700 transition-colors mb-4">
                                {featured.title}
                            </h2>
                            {featured.excerpt && (
                                <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-6">{featured.excerpt}</p>
                            )}
                            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
                                Read Article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
                )}

                {/* ── GRID ── */}
                {rest.length > 0 && (
                    <>
                        <h2 className="font-serif text-xl font-medium text-brand-950 mb-6 pb-3 border-b border-stone-200">
                            More Articles
                        </h2>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {rest.map((post) => {
                                const imgUrl = post.featured_image ? `${dUrl}/assets/${post.featured_image}` : null;
                                return (
                                    <Link key={post.id} href={`/blog/${post.slug || post.id}`}
                                        className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                                            {imgUrl ? (
                                                <Image src={imgUrl} alt={post.title} fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950" />
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 p-5">
                                            <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                                <User className="h-3 w-3" />
                                                <span className="text-brand-600">{post.author || "Editorial Team"}</span>
                                                {post.published_date && (
                                                    <>
                                                        <span>·</span>
                                                        <span>{new Date(post.published_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                                                    </>
                                                )}
                                            </div>
                                            <h3 className="font-serif text-lg font-medium leading-snug text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2 mb-auto">
                                                {post.title}
                                            </h3>
                                            {post.excerpt && (
                                                <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                            )}
                                            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                                                Read More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-24 text-center">
                        <p className="font-serif text-2xl font-medium text-brand-950 mb-2">Coming Soon</p>
                        <p className="text-stone-500 text-sm">We&apos;re drafting new travel stories. Check back soon!</p>
                    </div>
                )}
            </div>
        </main>
    );
}
