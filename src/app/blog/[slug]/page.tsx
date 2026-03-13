import { notFound } from "next/navigation";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, User } from "lucide-react";
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
    return {
        title: "Blog | IG Holidays",
        alternates: { canonical: `${baseUrl}/blog/${slug}` },
    };
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

    return (
        <main className="min-h-screen bg-stone-50">

            {/* ── HERO ── */}
            {imgUrl ? (
                <div className="relative h-[50vh] sm:h-[60vh] w-full bg-brand-950 overflow-hidden">
                    <Image
                        src={imgUrl}
                        alt={post.title}
                        fill
                        className="object-cover opacity-70"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" />

                    {/* Floating back link */}
                    <div className="absolute top-0 left-0 right-0 pt-20 px-4">
                        <div className="container-inner">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
                            </Link>
                        </div>
                    </div>

                    {/* Hero title */}
                    <div className="absolute bottom-0 left-0 right-0 pb-8 px-4">
                        <div className="container-inner max-w-3xl">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
                                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gold-400">
                                    <User className="h-3 w-3" />
                                    {post.author || "Editorial Team"}
                                </span>
                                {dateStr && (
                                    <span className="flex items-center gap-1.5 text-[11px] text-white/60">
                                        <Calendar className="h-3 w-3" /> {dateStr}
                                    </span>
                                )}
                                <span className="text-[11px] text-white/60">{readTime(post.content)}</span>
                            </div>
                            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-tight">
                                {post.title}
                            </h1>
                        </div>
                    </div>
                </div>
            ) : (
                /* No image fallback header */
                <div className="bg-brand-950 pt-20 pb-12 px-4">
                    <div className="container-inner max-w-3xl">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gold-400">
                                <User className="h-3 w-3" />
                                {post.author || "Editorial Team"}
                            </span>
                            {dateStr && (
                                <span className="flex items-center gap-1.5 text-[11px] text-white/60">
                                    <Calendar className="h-3 w-3" /> {dateStr}
                                </span>
                            )}
                            <span className="text-[11px] text-white/60">{readTime(post.content)}</span>
                        </div>
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight">
                            {post.title}
                        </h1>
                    </div>
                </div>
            )}

            {/* ── ARTICLE BODY ── */}
            <div className={`container-inner ${imgUrl ? "-mt-6 relative z-10" : ""} pb-20`}>
                <div className="max-w-3xl mx-auto">

                    {/* Back link (no image variant has it in header; image variant gets one below) */}
                    {imgUrl && (
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-brand-700 transition-colors mb-6"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
                        </Link>
                    )}

                    {/* Article card */}
                    <article className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/40 overflow-hidden">

                        {/* Excerpt banner */}
                        {post.excerpt && (
                            <div className="px-7 sm:px-10 pt-8 pb-0">
                                <p className="text-stone-600 text-base sm:text-lg leading-relaxed border-l-4 border-gold-400 pl-5 italic font-serif">
                                    {post.excerpt}
                                </p>
                            </div>
                        )}

                        {/* Content */}
                        <div className="px-7 sm:px-10 py-8">
                            <div
                                className="prose prose-stone max-w-none
                                    prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950
                                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                    prose-p:text-stone-600 prose-p:leading-[1.85] prose-p:text-[15px]
                                    prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                                    prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                                    prose-blockquote:border-l-4 prose-blockquote:border-gold-400
                                    prose-blockquote:bg-amber-50 prose-blockquote:py-4 prose-blockquote:px-6
                                    prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                                    prose-blockquote:font-serif prose-blockquote:text-stone-700
                                    prose-strong:text-brand-900 prose-strong:font-semibold
                                    prose-li:text-stone-600 prose-li:leading-relaxed
                                    prose-ul:my-4 prose-ol:my-4
                                    prose-hr:border-stone-200 prose-hr:my-8"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        post.content ||
                                        "<p class='italic text-stone-400'>Article content coming soon.</p>",
                                }}
                            />
                        </div>

                        {/* Author footer */}
                        <div className="mx-7 sm:mx-10 mb-8 rounded-xl bg-stone-50 border border-stone-100 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 shrink-0">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-brand-950">{post.author || "Editorial Team"}</p>
                                    <p className="text-xs text-stone-400 mt-0.5">IG Holidays Travel Expert</p>
                                    {dateStr && <p className="text-xs text-stone-400 mt-0.5">{dateStr}</p>}
                                </div>
                            </div>
                            <Link href="/contact" className="btn-gold text-sm shrink-0">
                                Plan Your Trip
                            </Link>
                        </div>
                    </article>
                </div>
            </div>

            {/* ── RELATED POSTS ── */}
            {recentPosts.length > 0 && (
                <section className="bg-white border-t border-stone-100 py-14">
                    <div className="container-inner">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-px flex-1 bg-stone-200" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Keep Reading</span>
                                <div className="h-px flex-1 bg-stone-200" />
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
                                            className="group flex flex-col overflow-hidden rounded-xl bg-stone-50 border border-stone-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-200 shrink-0">
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
                                                        <BookOpen className="h-8 w-8 text-white/20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="font-serif text-sm font-medium text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2 mb-auto leading-snug">
                                                    {rpost.title}
                                                </h3>
                                                <div className="mt-3 pt-3 border-t border-stone-200 flex items-center gap-1 text-xs font-bold text-brand-700">
                                                    Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA STRIP ── */}
            <section className="bg-brand-950 py-12 px-4">
                <div className="container-inner text-center">
                    <p className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                        Inspired to travel?
                    </p>
                    <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">
                        Our travel experts are ready to build your perfect itinerary. Get in touch today.
                    </p>
                    <Link href="/contact" className="btn-gold">
                        Start Planning
                    </Link>
                </div>
            </section>
        </main>
    );
}
