export interface Lead {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    package_interest?: string;
    budget?: string;
    notes?: string;
    status: "New" | "Contacted" | "Qualified" | "Lost" | "Converted";
    travel_date?: string;
    num_adults?: number | string;
    num_children?: number | string;
    trip_type?: string;
    date_created?: string;
}
