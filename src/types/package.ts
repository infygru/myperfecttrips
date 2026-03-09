export interface Package {
    id: string | number;
    title: string;
    slug: string;
    category: "Flights" | "Hotels" | "Holiday Package" | "Cruise" | "Bachelor Tour" | "Solo Tour" | "Adventure Tour" | "Island Resorts" | "MICE" | "Custom";
    image?: string;
    price?: number;
    itinerary?: string;
    duration_days?: number;
    duration_nights?: number;
    destinations?: string[];
    inclusions?: string;
    exclusions?: string;
    gallery?: string[];
}
