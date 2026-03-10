import { notFound } from "next/navigation";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Share2, Globe, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;

    let post: any;
    let recentPosts: any[] = [];
    try {
        const result = (await directus.request(
            readItems("blog_posts" as any, { filter: { slug: { _eq: slug } } as any, limit: 1 })
        )) as any[];
        if (!result?.length) return notFound();
        post = result[0];

        // Fetch up to 3 other recent posts for the footer
        recentPosts = (await directus.request(
            readItems("blog_posts" as any, {
                filter: {
                    id: { _neq: post.id }
                } as any,
                limit: 3,
                sort: ["-id"] as any
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
        <main className="min-h-screen bg-stone-50 pb-24">

            {/* ──────────────────────────────────────────────────────────
          SECTION 1: HERO OVERLAY
          ────────────────────────────────────────────────────────── */}
            <section className="relative h-[60vh] min-h-[400px] w-full bg-brand-950">
                {imgUrl ? (
                    <Image
                        src={imgUrl}
                        alt={post.title}
                        fill
                        className="object-cover opacity-70 mix-blend-overlay"
                        priority
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-800 to-brand-950 flex items-center justify-center opacity-80">
                        <Globe className="w-32 h-32 text-brand-900/40" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/10 to-brand-950/80" />
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 2: ARTICLE CONTAINER
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner relative z-20 -mt-40 md:-mt-64 text-center">
                {/* Article Header */}
                <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-white p-8 sm:p-16 shadow-2xl shadow-stone-200/50 border border-stone-100">
                    <Link
                        href="/blog"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Journal
                    </Link>

                    <h1 className="mb-10 font-serif text-4xl font-medium text-brand-950 sm:text-5xl md:text-6xl tracking-tight leading-[1.1]">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-stone-500 border-b border-stone-100 pb-8 mb-10">
                        <div className="flex items-center gap-2 text-brand-700">
                            <User className="h-4 w-4" />
                            <span>{post.author || "Editorial Team"}</span>
                        </div>
                        {dateStr && (
                            <>
                                <span className="text-stone-300">•</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{dateStr}</span>
                                </div>
                            </>
                        )}
                        <span className="text-stone-300">•</span>
                        <button className="flex items-center gap-2 transition-colors hover:text-brand-700">
                            <Share2 className="h-4 w-4" />
                            <span>Share Article</span>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-1/4 shrink-0 order-2 lg:order-1">
                            <div className="sticky top-28 space-y-10">
                                {/* Author block */}
                                <div className="text-center sm:text-left">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700 mb-4 ring-4 ring-brand-50/50">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-serif text-xl font-medium text-brand-950 mb-1">{post.author || "Editorial Team"}</h3>
                                    <p className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">IGHolidays Expert</p>
                                    <p className="text-sm text-stone-500 leading-relaxed font-light">
                                        Curating the finest luxury travel experiences and sharing insider knowledge from around the globe.
                                    </p>
                                </div>

                                {/* Share Block */}
                                <div className="border-t border-stone-100 pt-8 text-center sm:text-left">
                                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">Share this story</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-4">
                                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700">
                                            <Share2 className="h-4 w-4" />
                                        </button>
                                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700">
                                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                        </button>
                                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700">
                                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Article Body */}
                        <div className="flex-1 order-1 lg:order-2">
                            <div
                                className="prose prose-lg prose-stone max-w-none text-left leading-relaxed text-stone-600 font-sans hover:prose-a:text-brand-700 prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950 prose-img:rounded-[2rem] prose-img:shadow-xl prose-img:shadow-stone-200/50 prose-blockquote:border-l-4 prose-blockquote:border-gold-400 prose-blockquote:bg-gold-50/30 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic prose-blockquote:text-xl prose-blockquote:font-serif prose-blockquote:text-brand-950 prose-strong:text-brand-900 prose-li:marker:text-gold-400 first-letter:text-7xl first-letter:font-serif first-letter:text-brand-950 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]"
                                dangerouslySetInnerHTML={{
                                    __html: post.content || "<p class='italic text-stone-400'>Article content coming soon.</p>"
                                }}
                            />

                            {/* Tags / End marking */}
                            <div className="mt-16 border-t border-stone-100 pt-10 flex flex-col items-center justify-center text-center">
                                <Globe className="h-6 w-6 text-brand-300 mb-6" />
                                <h4 className="font-serif text-2xl font-medium text-brand-950 mb-4">Start Your Own Journey</h4>
                                <Link href="/contact" className="btn-gold rounded-full px-8">
                                    Speak to a Travel Designer
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 3: READ MORE (Recent Posts)
          ────────────────────────────────────────────────────────── */}
            {recentPosts.length > 0 && (
                <section className="container-inner mt-24">
                    <div className="mb-10 flex items-center gap-4">
                        <h2 className="font-serif text-3xl font-medium text-brand-950">Keep Reading</h2>
                        <div className="h-px flex-1 bg-stone-200" />
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {recentPosts.map((rpost) => {
                            const rimgUrl = rpost.featured_image ? `${dUrl}/assets/${rpost.featured_image}` : null;
                            return (
                                <Link
                                    key={rpost.id}
                                    href={`/blog/${rpost.slug || rpost.id}`}
                                    className="group flex flex-col overflow-hidden rounded-[2rem] bg-white border border-stone-200 transition-all hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300"
                                >
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 flex items-center justify-center">
                                        {rimgUrl ? (
                                            <Image
                                                src={rimgUrl}
                                                alt={rpost.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <Globe className="h-10 w-10 text-stone-300" />
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                                        <h3 className="mb-4 font-serif text-2xl font-medium leading-tight text-brand-950 transition-colors group-hover:text-brand-700">
                                            {rpost.title}
                                        </h3>
                                        <div className="mt-auto pt-4 font-semibold text-brand-700 text-sm flex items-center gap-2 border-t border-stone-100">
                                            Read Article <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

        </main>
    );
}
