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



// Manual additions for missing major airports
const manualAirports: Airport[] = [
    { code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
    { code: "GOI", name: "Dabolim Airport", city: "Goa", country: "India" },
    { code: "BLR", name: "Kempegowda International Airport", city: "Bengaluru", country: "India" },
    { code: "CCU", name: "Netaji Subhash Chandra Bose International Airport", city: "Kolkata", country: "India" },
    { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India" }
];

manualAirports.forEach(a => {
    uniqueAirportsMap.set(a.code, a);
});

const uniqueAirports = Array.from(uniqueAirportsMap.values());

// Sort by City Name for better UX
export const POPULAR_AIRPORTS = uniqueAirports.sort((a, b) => a.city.localeCompare(b.city));
