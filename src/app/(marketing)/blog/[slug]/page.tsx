import Image from "next/image";
import { notFound } from "next/navigation";
import directus, { getAssetUrl } from "@/lib/directus/client";
import { readItems } from "@directus/sdk";
import { Calendar, User, ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  let post: any = null;
  try {
    const result = await directus.request(readItems("Blog_Posts", {
      filter: { slug: { _eq: slug } },
      fields: ["*"],
      limit: 1
    }));
    post = result[0];
  } catch (e) { post = null; }

  if (!post) notFound();

  const imgUrl = post.image ? getAssetUrl(post.image) : "/placeholder-blog.jpg";
  const date = post.published_date 
    ? new Date(post.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : "Recently Published";

  return (
    <article className="min-h-screen bg-white pb-20">
      <div className="container mx-auto max-w-4xl px-4 pt-32">
        <Link href="/blog" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-10 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> All Articles
        </Link>
        
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.15]">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-8 text-slate-400 text-xs font-bold uppercase tracking-widest pt-6 border-t border-slate-100">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 uppercase">
                   {post.author?.charAt(0) || <User className="w-5 h-5" />}
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-slate-900">{post.author || "MyPerfectTrips Admin"}</span>
                    <span className="text-[10px] font-medium lowercase tracking-normal">Travel Expert</span>
                </div>
             </div>
             <div className="hidden sm:flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> {date}
             </div>
          </div>
        </div>

        <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl">
          <Image src={imgUrl} alt={post.title} fill className="object-cover" priority unoptimized />
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Using your 'content' field */}
          <div 
            className="prose prose-lg prose-slate prose-img:rounded-3xl prose-headings:text-slate-900 prose-a:text-blue-600 text-slate-700 leading-[1.8]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </article>
  );
}