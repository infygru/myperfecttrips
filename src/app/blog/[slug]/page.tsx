import { notFound } from "next/navigation";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, User } from "lucide-react";
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
                openGraph: {
                    title: post.title,
                    description: post.excerpt || post.title,
                    images: img ? [img] : [],
                    type: "article",
                },
            };
        }
    } catch {}
    return { title: "Blog | IG Holidays", alternates: { canonical: `${baseUrl}/blog/${slug}` } };
}

function readTime(content?: string) {
    if (!content) return "5 min read";
    const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
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
        ? new Date(post.published_date).toLocaleDateString("en-IN", {
              month: "long",
              day: "numeric",
              year: "numeric",
          })
        : "";
    const rt = readTime(post.content);

    return (
        <main className="min-h-screen bg-white">

            {/* ── HERO ── */}
            {imgUrl ? (
                <div className="relative h-[42vh] sm:h-[50vh] w-full overflow-hidden bg-brand-950">
                    <Image
                        src={imgUrl}
                        alt={post.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/98 via-brand-950/50 to-brand-950/20" />

                    {/* Hero content */}
                    <div className="absolute inset-0 flex flex-col justify-end pb-8 px-4">
                        <div className="container-inner max-w-4xl">
                            <Link
                                href="/blog"
                                className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors"
                            >
                                <ArrowLeft className="h-3 w-3" /> Back to Blog
                            </Link>
                            {post.category && (
                                <span className="mb-3 inline-block rounded-full bg-gold-400 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-stone-950">
                                    {post.category}
                                </span>
                            )}
                            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-tight max-w-3xl">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-400">
                                    <User className="h-3 w-3" />
                                    {post.author || "Editorial Team"}
                                </span>
                                {dateStr && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-white/40">
                                        <Calendar className="h-3 w-3" /> {dateStr}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 text-[10px] text-white/40">
                                    <Clock className="h-3 w-3" /> {rt}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Text-only header */
                <div className="bg-brand-950 pt-20 pb-10 px-4 border-b border-white/[0.06]">
                    <div className="container-inner max-w-4xl">
                        <Link
                            href="/blog"
                            className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors"
                        >
                            <ArrowLeft className="h-3 w-3" /> Back to Blog
                        </Link>
                        {post.category && (
                            <span className="mb-3 inline-block rounded-full bg-gold-400 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-stone-950">
                                {post.category}
                            </span>
                        )}
                        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white leading-tight max-w-3xl">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-400">
                                <User className="h-3 w-3" />
                                {post.author || "Editorial Team"}
                            </span>
                            {dateStr && (
                                <span className="flex items-center gap-1.5 text-[10px] text-white/50">
                                    <Calendar className="h-3 w-3" /> {dateStr}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-[10px] text-white/50">
                                <Clock className="h-3 w-3" /> {rt}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ARTICLE ── */}
            <div className="container-inner max-w-4xl py-12 sm:py-16 px-4">
                <div className="max-w-3xl mx-auto">

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="mb-10 border-l-4 border-gold-400 pl-6 font-serif text-lg sm:text-xl text-stone-500 leading-relaxed italic">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Body */}
                    <div
                        className="prose prose-stone max-w-none
                            prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950
                            prose-h1:text-3xl prose-h1:mt-14 prose-h1:mb-5
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:mt-9 prose-h3:mb-3
                            prose-p:text-stone-600 prose-p:leading-[1.9] prose-p:text-[17px] prose-p:mb-6
                            prose-a:text-brand-700 prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                            prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
                            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-gold-400
                            prose-blockquote:bg-amber-50/70 prose-blockquote:py-5 prose-blockquote:px-6
                            prose-blockquote:rounded-r-2xl prose-blockquote:font-serif prose-blockquote:text-stone-700
                            prose-strong:text-brand-900 prose-strong:font-semibold
                            prose-li:text-stone-600 prose-li:leading-relaxed prose-li:text-[17px]
                            prose-ul:my-6 prose-ol:my-6
                            prose-hr:border-stone-100 prose-hr:my-12
                            prose-code:text-brand-800 prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
                        dangerouslySetInnerHTML={{
                            __html:
                                post.content ||
                                "<p class='italic text-stone-400'>Article content coming soon.</p>",
                        }}
                    />

                    {/* Tags / Category pill */}
                    {post.category && (
                        <div className="mt-10 pt-8 border-t border-stone-100 flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Category:</span>
                            <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                                {post.category}
                            </span>
                        </div>
                    )}

                    {/* Author Bio */}
                    <div className="mt-8 rounded-2xl bg-stone-50 border border-stone-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 shrink-0 font-serif text-xl font-bold">
                                {(post.author || "E")[0]}
                            </div>
                            <div>
                                <p className="font-bold text-brand-950 text-base">{post.author || "Editorial Team"}</p>
                                <p className="text-sm text-stone-400 mt-0.5">IG Holidays Travel Expert</p>
                                {dateStr && <p className="text-xs text-stone-400 mt-0.5">{dateStr} · {rt}</p>}
                            </div>
                        </div>
                        <Link href="/contact" className="btn-gold text-sm shrink-0">
                            Plan Your Trip
                        </Link>
                    </div>

                    {/* Back to Blog */}
                    <div className="mt-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-400 hover:text-brand-700 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to all articles
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── RELATED POSTS ── */}
            {recentPosts.length > 0 && (
                <section className="border-t border-stone-100 bg-stone-50 py-14 px-4">
                    <div className="container-inner">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-serif text-2xl font-medium text-brand-950">
                                Keep Reading
                            </h2>
                            <Link href="/blog" className="text-sm font-semibold text-brand-700 hover:underline flex items-center gap-1">
                                All Articles <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-3">
                            {recentPosts.map((rpost) => {
                                const rimgUrl = rpost.featured_image
                                    ? `${dUrl}/assets/${rpost.featured_image}`
                                    : null;
                                return (
                                    <Link
                                        key={rpost.id}
                                        href={`/blog/${rpost.slug || rpost.id}`}
                                        className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200 hover:shadow-xl hover:shadow-stone-200/60 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 shrink-0">
                                            {rimgUrl ? (
                                                <Image
                                                    src={rimgUrl}
                                                    alt={rpost.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950 flex items-center justify-center">
                                                    <BookOpen className="h-8 w-8 text-white/15" />
                                                </div>
                                            )}
                                            {rpost.category && (
                                                <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-800">
                                                    {rpost.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="font-serif text-base font-medium text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug mb-3">
                                                {rpost.title}
                                            </h3>
                                            {rpost.excerpt && (
                                                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-auto">
                                                    {rpost.excerpt}
                                                </p>
                                            )}
                                            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1 text-xs font-bold text-brand-700">
                                                Read Article <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <section className="bg-brand-950 py-14 px-4 text-center">
                <p className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                    Inspired to travel?
                </p>
                <p className="text-stone-400 text-sm mb-7 max-w-sm mx-auto">
                    Our travel experts are ready to build your perfect itinerary.
                </p>
                <Link href="/contact" className="btn-gold">
                    Start Planning
                </Link>
            </section>
        </main>
    );
}
