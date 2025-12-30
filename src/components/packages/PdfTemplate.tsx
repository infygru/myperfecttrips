import React from "react";
import { MapPin, Clock, Check, X } from "lucide-react";
import { getAssetUrl } from "@/lib/directus/client";

// Define strict A4 dimensions in pixels (approx) for screen rendering before PDF
// A4 is 210mm x 297mm. At 96 DPI that's 794px x 1123px.
// We'll use a fixed width container.
const A4_WIDTH_PX = "794px";
const A4_HEIGHT_PX = "1123px"; // 297mm @ 96 DPI

export default function PdfTemplate({ pkg }: { pkg: any }) {
    const bannerId = typeof pkg.banner_image === 'object' ? pkg.banner_image?.id : pkg.banner_image;
    const mainImageId = typeof pkg.image === 'object' ? pkg.image?.id : pkg.image;

    const heroImage = bannerId
        ? getAssetUrl(bannerId)
        : (mainImageId ? getAssetUrl(mainImageId) : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80");

    const itinerary = Array.isArray(pkg.itinerary_json) && pkg.itinerary_json.length > 0 ? pkg.itinerary_json : [];

    // --- SMART PAGING LOGIC ---
    // Page 1 capacities
    // Restored to 3 to fill whitespace, but we will tighten vertical spacing to prevent overlap
    const ITEMS_ON_PAGE_1 = 3;
    const ITEMS_PER_PAGE = 4;  // Conservative for subsequent pages

    // Chunk the itinerary
    const pages: any[][] = [];

    // First chunk
    const firstPageItems = itinerary.slice(0, ITEMS_ON_PAGE_1);
    if (firstPageItems.length > 0) pages.push(firstPageItems);

    // Remaining chunks
    let remaining = itinerary.slice(ITEMS_ON_PAGE_1);
    while (remaining.length > 0) {
        pages.push(remaining.slice(0, ITEMS_PER_PAGE));
        remaining = remaining.slice(ITEMS_PER_PAGE);
    }

    // If no itinerary, ensure at least one page
    if (pages.length === 0) pages.push([]);

    // Decide where to put Inclusions/Exclusions/Footer
    // If the last page is relatively empty, append there. Else new page.
    const lastPageRawCount = pages[pages.length - 1].length;
    // Page 1 is special (has header), so its "full" is 3 items.
    // Other pages "full" is 4 items.
    const isLastPageFull = (pages.length === 1 && lastPageRawCount >= ITEMS_ON_PAGE_1) ||
        (pages.length > 1 && lastPageRawCount >= ITEMS_PER_PAGE);

    const separateDetailsPage = isLastPageFull;

    return (
        <div id="pdf-template-root">
            {pages.map((pageItems, pageIndex) => {
                const isFirstPage = pageIndex === 0;
                const isLastContentPage = pageIndex === pages.length - 1;
                const showDetailsHere = isLastContentPage && !separateDetailsPage;

                return (
                    <div
                        key={pageIndex}
                        className="pdf-page bg-white relative shadow-sm mb-8 mx-auto"
                        style={{
                            width: A4_WIDTH_PX,
                            height: A4_HEIGHT_PX,
                            fontFamily: "ui-sans-serif, system-ui, sans-serif",
                            fontSize: "14px", // Increased from 12px
                            lineHeight: "1.6",
                            overflow: "hidden", // Strict clip
                            color: "#334155",
                        }}
                    >
                        {/* Header only on Page 1? Or simplified header on others? Let's do Full Header Page 1, Minimal Page 2+ */}
                        {isFirstPage ? (
                            <>
                                {/* --- PAGE 1 HEADER --- */}
                                {/* Optimized height to 200px to balance spacing and capacity */}
                                <div className="bg-slate-900 text-white p-8 pb-12 relative overflow-hidden h-[200px]">
                                    <div className="relative z-10 flex justify-between items-start">
                                        <div>
                                            <h1 className="text-xl font-bold uppercase tracking-widest text-blue-400">MyPerfectTrips</h1>
                                            <h2 className="text-3xl font-serif font-bold mt-4 max-w-md leading-tight">{pkg.title}</h2>
                                        </div>
                                        <div className="text-right text-slate-300 text-[10px]">
                                            <p>www.myperfecttrips.com</p>
                                            <p>support@myperfecttrips.com</p>
                                            <div className="flex gap-4 text-xs text-white mt-4 justify-end">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" /> {pkg.location || "International"}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-red-400" /> {pkg.duration || 5} Days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HERO IMAGE */}
                                <div className="w-[90%] h-48 bg-slate-200 relative mx-auto -mt-8 shadow-lg border-4 border-white mb-5 overflow-hidden rounded-sm">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                                </div>

                                <div className="px-12">
                                    <section className="mb-5">
                                        <h3 className="text-sm font-bold text-blue-900 border-b border-blue-100 pb-1 mb-2 uppercase tracking-wide">Overview</h3>
                                        <div className="text-slate-600 text-sm leading-relaxed text-justify line-clamp-4">
                                            {/* Restored line-clamp-4 to ensure itinerary has room, 3 days + full text might be too much */}
                                            {pkg.description || "A wonderful journey awaits you."}
                                        </div>
                                    </section>
                                </div>
                            </>
                        ) : (
                            // --- SUBSEQUENT PAGES HEADER ---
                            <div className="px-12 pt-8 pb-4 flex justify-between items-end border-b border-slate-100 mb-6">
                                <span className="text-xs font-bold text-slate-400 uppercase">{pkg.title}</span>
                                <span className="text-[10px] text-slate-300">Page {pageIndex + 1}</span>
                            </div>
                        )}

                        {/* ITINERARY CONTENT FOR THIS PAGE */}
                        <div className="px-12">
                            {isFirstPage && <h3 className="text-sm font-bold text-blue-900 border-b border-blue-100 pb-1 mb-4 uppercase tracking-wide">Itinerary</h3>}

                            <div className="space-y-4">
                                {pageItems.map((day: any, i: number) => {
                                    // Calculate global day index
                                    const globalIndex = isFirstPage ? i : (ITEMS_ON_PAGE_1 + (pageIndex - 1) * ITEMS_PER_PAGE + i);
                                    return (
                                        <div key={i} className="flex gap-6">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                                    {globalIndex + 1}
                                                </div>
                                                <div className="w-px h-full bg-slate-200 my-1"></div>
                                            </div>
                                            <div className="flex-1 pb-2">
                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{day.title || `Day ${globalIndex + 1}`}</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-3">{day.description}</p>
                                                {day.image && (
                                                    <div className="w-48 h-24 bg-slate-100 rounded overflow-hidden mt-1 border border-slate-100">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={getAssetUrl(day.image)} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* DETAILS (If space allows on this page) */}
                        {showDetailsHere && <DetailsSection pkg={pkg} />}

                        {/* FOOTER (Always at bottom of page container) */}
                        <div className="absolute bottom-0 left-0 w-full p-8 text-center">
                            <div className="border-t border-slate-100 pt-4">
                                <p className="text-[10px] text-slate-300">© {new Date().getFullYear()} MyPerfectTrips. {pageIndex + 1} / {separateDetailsPage ? pages.length + 1 : pages.length}</p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* SEPARATE DETAILS PAGE (If didn't fit) */}
            {separateDetailsPage && (
                <div
                    className="pdf-page bg-white relative shadow-sm mb-8 mx-auto"
                    style={{
                        width: A4_WIDTH_PX,
                        height: A4_HEIGHT_PX,
                        overflow: "hidden",
                        fontFamily: "ui-sans-serif, system-ui, sans-serif",
                        fontSize: "14px"
                    }}
                >
                    <div className="px-12 pt-8 pb-4 flex justify-between items-end border-b border-slate-100 mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase">{pkg.title}</span>
                        <span className="text-[10px] text-slate-300">Page {pages.length + 1}</span>
                    </div>

                    <DetailsSection pkg={pkg} />

                    <div className="absolute bottom-0 left-0 w-full p-8 text-center">
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-[10px] text-slate-300">© {new Date().getFullYear()} MyPerfectTrips. {pages.length + 1} / {pages.length + 1}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailsSection({ pkg }: { pkg: any }) {
    return (
        <div className="mt-8 pt-6 px-12">
            <h3 className="text-sm font-bold text-blue-900 mb-6 uppercase tracking-widest border-b border-slate-200 pb-2">Trip Details</h3>
            <div className="grid grid-cols-2 gap-12 mb-8">
                <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <Check className="w-4 h-4" />
                        </div>
                        Inclusions
                    </h4>
                    <ul className="space-y-3">
                        {(pkg.inclusions || []).map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0 opacity-60"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                            <X className="w-4 h-4" />
                        </div>
                        Exclusions
                    </h4>
                    <ul className="space-y-3">
                        {(pkg.exclusions || []).map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-xs text-slate-500 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* DISCLAIMER */}
            <div className="text-center pt-6 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 italic">
                    This is just an itinerary. Prices and availability are subject to confirmation.
                </p>
            </div>
        </div>
    );
}
