"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortSelect({ currentSort }: { currentSort: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <select 
            name="sort" 
            id="sort-select"
            value={currentSort}
            onChange={onChange}
            className="appearance-none bg-white border border-stone-200 rounded-lg py-2 pl-3 pr-8 text-sm font-semibold text-brand-950 shadow-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer min-w-[140px] transition-colors hover:border-stone-300"
        >
            <option value="default">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration-asc">Duration: Short First</option>
        </select>
    );
}
