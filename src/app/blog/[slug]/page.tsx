import { notFound } from "next/navigation";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { slug } = await props.params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com";
    try {
        const result = (await directus.request(
            readItems("blog_posts" as any, { filter: { slug: { _eq: slug } } as any, limit: 1 })
        )) as any[];
        const post = result?.[0];
        if (post) {
            const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
            const img = post.featured_image ? `${dUrl}/assets/${post.featured_image}` : undefined;
            return {
                title: `${post.title} | IG Holidays Blog`,
                description: post.excerpt || post.title,
                alternates: { canonical: `${baseUrl}/blog/${slug}` },
                openGraph: { title: post.title, description: post.excerpt || post.title, images: img ? [img] : [], type: "article" },
            };
        }
    } catch { }
    return { title: "Blog | IG Holidays", alternates: { canonical: `${baseUrl}/blog/${slug}` } };
}

export default async function BlogDetailPage(props: Props) {
    const { slug } = await props.params;
    let post: any;
    let recentPosts: any[] = [];

    try {
        const result = (await directus.request(
            readItems("blog_posts" as any, { filter: { slug: { _eq: slug } } as any, limit: 1 })
        )) as any[];
        if (!result?.length) return notFound();
        post = result[0];

        recentPosts = (await directus.request(
            readItems("blog_posts" as any, {
                filter: { id: { _neq: post.id } } as any,
                limit: 3,
                sort: ["-id"] as any,
            })
        )) as any[];
    } catch {
        return notFound();
    }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const imgUrl = post.featured_image ? `${dUrl}/assets/${post.featured_image}` : null;
    const dateStr = post.published_date
        ? new Date(post.published_date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })
        : "";

    return (
        <main className="min-h-screen bg-stone-50">

            {/* ── HERO IMAGE ── */}
            {imgUrl && (
                <div className="relative h-[45vh] sm:h-[55vh] w-full bg-brand-950">
                    <Image src={imgUrl} alt={post.title} fill className="object-cover opacity-80" priority unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                </div>
            )}

            {/* ── ARTICLE CARD ── */}
            <div className={`container-inner ${imgUrl ? "-mt-24 sm:-mt-36 relative z-10" : "pt-24"} pb-20`}>
                <div className="max-w-3xl mx-auto">

                    {/* Back link */}
                    <Link href="/blog"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-brand-700 transition-colors mb-6">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
                    </Link>

                    {/* Article container */}
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/30 overflow-hidden">

                        {/* Article header */}
                        <div className="p-6 sm:p-10 border-b border-stone-100">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-[11px] font-bold uppercase tracking-widest text-stone-400">
                                <span className="flex items-center gap-1.5 text-brand-600">
                                    <User className="h-3.5 w-3.5" /> {post.author || "Editorial Team"}
                                </span>
                                {dateStr && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" /> {dateStr}
                                    </span>
                                )}
                            </div>
                            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-brand-950 leading-tight">
                                {post.title}
                            </h1>
                            {post.excerpt && (
                                <p className="mt-4 text-stone-500 text-base leading-relaxed border-l-4 border-gold-400 pl-4">
                                    {post.excerpt}
                                </p>
                            )}
                        </div>

                        {/* Article body */}
                        <div className="p-6 sm:p-10">
                            <div
                                className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950 prose-p:text-stone-600 prose-p:leading-relaxed prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-gold-400 prose-blockquote:bg-gold-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-serif prose-strong:text-brand-900 prose-li:text-stone-600"
                                dangerouslySetInnerHTML={{ __html: post.content || "<p class='italic text-stone-400'>Article content coming soon.</p>" }}
                            />
                        </div>

                        {/* Article footer */}
                        <div className="px-6 sm:px-10 pb-8 border-t border-stone-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-brand-950">{post.author || "Editorial Team"}</p>
                                    <p className="text-xs text-stone-400">IGHolidays Travel Expert</p>
                                </div>
                            </div>
                            <Link href="/contact" className="btn-gold text-sm shrink-0">
                                Plan Your Trip
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RELATED POSTS ── */}
            {recentPosts.length > 0 && (
                <section className="container-inner pb-20">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-serif text-2xl font-medium text-brand-950 mb-6 pb-4 border-b border-stone-200">
                            Keep Reading
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {recentPosts.map((rpost) => {
                                const rimgUrl = rpost.featured_image ? `${dUrl}/assets/${rpost.featured_image}` : null;
                                return (
                                    <Link key={rpost.id} href={`/blog/${rpost.slug || rpost.id}`}
                                        className="group flex flex-col overflow-hidden rounded-xl bg-white border border-stone-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                                            {rimgUrl ? (
                                                <Image src={rimgUrl} alt={rpost.title} fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950" />
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="font-serif text-sm font-medium text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2 mb-auto">
                                                {rpost.title}
                                            </h3>
                                            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1 text-xs font-semibold text-brand-700">
                                                Read <ArrowRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
