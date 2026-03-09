export interface Enquiry {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status?: "Pending" | "In Progress" | "Resolved";
    date_created?: string;
}
