export const airports = [
    { code: "MAN", name: "Manchester Airport", city: "Manchester", country: "UK" },
    { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
    { code: "LGW", name: "Gatwick Airport", city: "London", country: "UK" },
    { code: "STN", name: "Stansted Airport", city: "London", country: "UK" },
    { code: "BHX", name: "Birmingham Airport", city: "Birmingham", country: "UK" },
    { code: "EDI", name: "Edinburgh Airport", city: "Edinburgh", country: "UK" },
    { code: "GLA", name: "Glasgow Airport", city: "Glasgow", country: "UK" },
    { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
    { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
    { code: "SIN", name: "Changi Airport", city: "Singapore", country: "Singapore" },
    { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia" },
    { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
    { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
    { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
    { code: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia" },
    { code: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan" },
    { code: "HND", name: "Haneda Airport", city: "Tokyo", country: "Japan" },
    { code: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", country: "Hong Kong" },
    { code: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada" },
];

export type Airport = typeof airports[0];
