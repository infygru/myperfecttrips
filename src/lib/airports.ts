import airportsRaw from "./airports.json";

export interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
}

// Map the raw JSON data to our interface and filter out invalid entries
const allAirports: Airport[] = (airportsRaw as any[])
    .filter((a) => a.iata_code && a.city && a.name) // Ensure valid data
    .map((a) => ({
        code: a.iata_code,
        name: a.name,
        city: a.city,
        country: a.country,
    }));

// Remove duplicates based on code
const uniqueAirportsMap = new Map<string, Airport>();
allAirports.forEach(item => {
    if (!uniqueAirportsMap.has(item.code)) {
        uniqueAirportsMap.set(item.code, item);
    }
});

const uniqueAirports = Array.from(uniqueAirportsMap.values());

// Sort by City Name for better UX
export const POPULAR_AIRPORTS = uniqueAirports.sort((a, b) => a.city.localeCompare(b.city));
