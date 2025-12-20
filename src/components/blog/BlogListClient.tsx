"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAssetUrl } from "@/lib/directus/client";
import { Calendar, ArrowRight, Search, User } from "lucide-react";

export default function BlogListClient({ initialPosts, categories }: { initialPosts: any[], categories: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, activeCategory, initialPosts]);

  return (
    <div className="container mx-auto px-4 -mt-10 relative z-20 pb-24">
      
      {/* --- CLEAN & MINIMALIST FILTER BAR --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 md:p-3 mb-16 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Clean Pills - No Shadow */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat 
                ? "bg-blue-600 text-white" 
                : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Flat Search Input */}
        <div className="relative w-full md:w-72 mr-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* --- BLOG GRID --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredPosts.map((post) => {
          const imgUrl = post.image ? getAssetUrl(post.image) : "/placeholder.jpg";
          const date = post.published_date 
            ? new Date(post.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : "Recently";

          return (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
              <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-100">
                <Image 
                  src={imgUrl} 
                  alt={post.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  unoptimized 
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">{date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1.5">{post.author}</span>
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
                
                <div className="pt-2 flex items-center text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em]">
                  View Post <ArrowRight className="w-3 h-3 ml-2 group-hover:ml-4 transition-all" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
          <p className="text-slate-400 font-medium">No stories found matching your search.</p>
        </div>
      )}
    </div>
  );
}