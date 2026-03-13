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
                <div className="relative h-[55vh] sm:h-[65vh] w-full overflow-hidden bg-brand-950">
                    <Image
                        src={imgUrl}
                        alt={post.title}
                        fill
                        className="object-cover opacity-65"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/40 to-brand-950/10" />

                    {/* Hero content */}
                    <div className="absolute inset-0 flex flex-col justify-end pb-10 px-4">
                        <div className="container-inner max-w-3xl">
                            <Link
                                href="/blog"
                                className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" /> Blog
                            </Link>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
                                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gold-400">
                                    <User className="h-3 w-3" />
                                    {post.author || "Editorial Team"}
                                </span>
                                {dateStr && (
                                    <span className="flex items-center gap-1.5 text-[11px] text-white/50">
                                        <Calendar className="h-3 w-3" /> {dateStr}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 text-[11px] text-white/50">
                                    <Clock className="h-3 w-3" /> {rt}
                                </span>
                            </div>
                            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-white leading-tight">
                                {post.title}
                            </h1>
                        </div>
                    </div>
                </div>
            ) : (
                /* Text-only header */
                <div className="bg-brand-950 px-4 pt-20 pb-12">
                    <div className="container-inner max-w-3xl">
                        <Link
                            href="/blog"
                            className="mb-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Blog
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-5">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gold-400">
                                <User className="h-3 w-3" />
                                {post.author || "Editorial Team"}
                            </span>
                            {dateStr && (
                                <span className="flex items-center gap-1.5 text-[11px] text-white/50">
                                    <Calendar className="h-3 w-3" /> {dateStr}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-[11px] text-white/50">
                                <Clock className="h-3 w-3" /> {rt}
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight">
                            {post.title}
                        </h1>
                    </div>
                </div>
            )}

            {/* ── ARTICLE ── */}
            <div className="container-inner max-w-3xl py-10 sm:py-14 px-4">

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="mb-10 border-l-4 border-gold-400 pl-5 font-serif text-lg sm:text-xl text-stone-600 leading-relaxed italic">
                        {post.excerpt}
                    </p>
                )}

                {/* Body */}
                <div
                    className="prose prose-stone max-w-none
                        prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950
                        prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-5
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                        prose-p:text-stone-600 prose-p:leading-[1.9] prose-p:text-base
                        prose-a:text-brand-700 prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
                        prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-gold-400
                        prose-blockquote:bg-amber-50/70 prose-blockquote:py-5 prose-blockquote:px-6
                        prose-blockquote:rounded-r-2xl prose-blockquote:font-serif prose-blockquote:text-stone-700
                        prose-strong:text-brand-900 prose-strong:font-semibold
                        prose-li:text-stone-600 prose-li:leading-relaxed
                        prose-ul:my-5 prose-ol:my-5
                        prose-hr:border-stone-100 prose-hr:my-10
                        prose-code:text-brand-800 prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
                    dangerouslySetInnerHTML={{
                        __html:
                            post.content ||
                            "<p class='italic text-stone-400'>Article content coming soon.</p>",
                    }}
                />

                {/* Author Bio */}
                <div className="mt-12 pt-10 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700 shrink-0">
                            <User className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="font-bold text-brand-950">{post.author || "Editorial Team"}</p>
                            <p className="text-sm text-stone-400">IG Holidays Travel Expert</p>
                            {dateStr && <p className="text-xs text-stone-400 mt-0.5">{dateStr}</p>}
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

            {/* ── RELATED POSTS ── */}
            {recentPosts.length > 0 && (
                <section className="border-t border-stone-100 bg-stone-50 py-14 px-4">
                    <div className="container-inner max-w-3xl">
                        <h2 className="font-serif text-2xl font-medium text-brand-950 mb-8">
                            Keep Reading
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {recentPosts.map((rpost) => {
                                const rimgUrl = rpost.featured_image
                                    ? `${dUrl}/assets/${rpost.featured_image}`
                                    : null;
                                return (
                                    <Link
                                        key={rpost.id}
                                        href={`/blog/${rpost.slug || rpost.id}`}
                                        className="group flex flex-col overflow-hidden rounded-xl bg-white border border-stone-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
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
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="font-serif text-sm font-medium text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug mb-auto">
                                                {rpost.title}
                                            </h3>
                                            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1 text-xs font-bold text-brand-700">
                                                Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
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
