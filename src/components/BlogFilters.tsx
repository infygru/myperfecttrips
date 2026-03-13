"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useTransition, useRef } from "react";

export default function BlogFilters({ categories }: { categories: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    function setParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
    }

    function clearSearch() {
        if (inputRef.current) inputRef.current.value = "";
        setParam("search", "");
    }

    return (
        <div className="mb-8 space-y-4">
            {/* Search bar */}
            <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                    ref={inputRef}
                    type="search"
                    placeholder="Search articles, destinations, tips…"
                    defaultValue={search}
                    onChange={(e) => {
                        const val = e.target.value;
                        const timer = setTimeout(() => setParam("search", val), 350);
                        return () => clearTimeout(timer);
                    }}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors ${
                        isPending ? "border-brand-300 opacity-70" : "border-stone-200"
                    }`}
                />
                {search && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-stone-400 hover:text-stone-700"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Category pills */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setParam("category", "")}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all ${
                            !category
                                ? "bg-brand-950 text-white shadow-sm"
                                : "border border-stone-200 bg-white text-stone-500 hover:border-brand-300 hover:text-brand-700"
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setParam("category", cat === category ? "" : cat)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all ${
                                cat === category
                                    ? "bg-brand-950 text-white shadow-sm"
                                    : "border border-stone-200 bg-white text-stone-500 hover:border-brand-300 hover:text-brand-700"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
