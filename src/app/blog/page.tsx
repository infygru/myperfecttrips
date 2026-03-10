import { unstable_noStore as noStore } from "next/cache";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    noStore();
    let latestBlogs: any[] = [];
    try {
        latestBlogs = (await directus.request(
            readItems("blog_posts" as any, {
                limit: 100,
                sort: ["-id"] as any,
            })
        )) as any[];
    } catch { }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

    const featured = latestBlogs[0];
    const restOfBlogs = latestBlogs.slice(1);

    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            {/* ──────────────────────────────────────────────────────────
          SECTION 1: HERO
          ────────────────────────────────────────────────────────── */}
            <section className="relative bg-brand-950 px-4 pt-20 pb-24 sm:px-6 lg:px-8 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-800 via-brand-950 to-brand-950 opacity-80" />
                <div className="container-inner relative z-10 flex flex-col items-center text-center">
                    <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">
                        Travel Journal
                    </span>
                    <h1 className="mb-6 font-serif text-5xl font-medium text-white sm:text-6xl md:text-7xl tracking-tight leading-[1.1]">
                        Notes from the <em className="text-gold-400 font-semibold italic">Road.</em>
                    </h1>
                    <p className="max-w-2xl text-lg text-stone-300 font-light leading-relaxed">
                        Insider guides, destination inspiration, and travel tips curated by our experts.
                    </p>
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 2: FEATURED POST
          ────────────────────────────────────────────────────────── */}
            {featured && (
                <section className="container-inner -mt-12 relative z-20 mb-24">
                    <Link
                        href={`/blog/${featured.slug || featured.id}`}
                        className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-stone-200/50 transition-all hover:-translate-y-2 md:flex-row"
                    >
                        {/* Image Side */}
                        <div className="relative aspect-video w-full overflow-hidden bg-stone-100 md:w-3/5 lg:w-2/3">
                            <div className="absolute inset-0 bg-stone-900/10 z-10 transition-opacity duration-500 group-hover:opacity-0" />
                            {featured.featured_image ? (
                                <Image
                                    src={`${dUrl}/assets/${featured.featured_image}`}
                                    alt={featured.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    unoptimized
                                    priority
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Globe className="h-20 w-20 text-stone-300" />
                                </div>
                            )}
                        </div>

                        {/* Content Side */}
                        <div className="flex w-full flex-col justify-center p-10 sm:p-14 md:w-2/5 lg:w-1/3 min-h-[450px] relative">
                            {/* Decorative quotes graphic */}
                            <div className="absolute top-10 right-10 opacity-5 text-brand-900 font-serif text-9xl leading-none hidden sm:block">"</div>

                            <div className="mb-8 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-brand-700">
                                <span className="bg-brand-50 px-4 py-2 rounded-full border border-brand-100">Spotlight</span>
                                <span className="text-stone-400">
                                    {featured.published_date
                                        ? new Date(featured.published_date).toLocaleDateString("en-IN", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                        : "Latest"}
                                </span>
                            </div>
                            <h2 className="mb-6 font-serif text-3xl font-medium leading-[1.2] text-brand-950 sm:text-4xl transition-colors group-hover:text-brand-700 relative z-10">
                                {featured.title}
                            </h2>
                            {featured.excerpt && (
                                <p className="mb-10 text-[15px] leading-relaxed text-stone-500 line-clamp-4 relative z-10">
                                    {featured.excerpt}
                                </p>
                            )}

                            <div className="mt-auto flex items-center gap-3 font-semibold text-brand-700 uppercase tracking-wide text-sm">
                                Read Article
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* ──────────────────────────────────────────────────────────
          SECTION 3: ARTICLE GRID
          ────────────────────────────────────────────────────────── */}
            {restOfBlogs.length > 0 && (
                <section className="container-inner">
                    <div className="mb-10 flex items-center gap-4">
                        <h2 className="font-serif text-3xl font-medium text-brand-950">More Articles</h2>
                        <div className="h-px flex-1 bg-stone-200" />
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {restOfBlogs.map((post) => {
                            const imgUrl = post.featured_image ? `${dUrl}/assets/${post.featured_image}` : null;

                            return (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug || post.id}`}
                                    className="group flex flex-col overflow-hidden rounded-[2rem] bg-white border border-stone-200 transition-all hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300"
                                >
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 flex items-center justify-center">
                                        {imgUrl ? (
                                            <Image
                                                src={imgUrl}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <Globe className="h-10 w-10 text-stone-300" />
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col p-8 lg:p-10">
                                        <div className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-stone-400">
                                            <span className="text-brand-700">
                                                {post.author || "Editorial Team"}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {post.published_date
                                                    ? new Date(post.published_date).toLocaleDateString("en-IN", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                    : ""}
                                            </span>
                                        </div>

                                        <h3 className="mb-4 font-serif text-2xl font-medium leading-tight text-brand-950 transition-colors group-hover:text-brand-700">
                                            {post.title}
                                        </h3>

                                        {post.excerpt && (
                                            <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed mb-6">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-stone-100 font-semibold text-brand-700 text-sm flex items-center gap-2">
                                            Continue Reading <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {latestBlogs.length === 0 && (
                <section className="container-inner -mt-12 relative z-20">
                    <div className="flex w-full flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-stone-300 bg-white py-32 text-center shadow-sm">
                        <Globe className="mb-4 h-12 w-12 text-stone-300" />
                        <p className="font-serif text-3xl font-medium text-brand-950 mb-2">Our Journal is Empty</p>
                        <p className="text-stone-500 text-lg">
                            We are currently drafting new stories. Check back soon!
                        </p>
                    </div>
                </section>
            )}
        </main>
    );
}
