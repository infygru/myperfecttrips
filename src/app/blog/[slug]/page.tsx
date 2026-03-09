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

                    {/* Article Body */}
                    <div
                        className="prose prose-lg prose-stone max-w-none text-left leading-relaxed text-stone-600 font-sans hover:prose-a:text-brand-700 prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950 prose-img:rounded-3xl prose-img:shadow-lg prose-blockquote:border-gold-500 prose-blockquote:bg-gold-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-strong:text-brand-900"
                        dangerouslySetInnerHTML={{
                            __html: post.content || "<p class='italic text-stone-400'>Article content coming soon.</p>"
                        }}
                    />

                    {/* Tags / End marking */}
                    <div className="mt-16 border-t border-stone-100 pt-8 flex items-center justify-center text-brand-300">
                        <Globe className="h-6 w-6" />
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
