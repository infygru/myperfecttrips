export interface Blog {
    id: string | number;
    title: string;
    slug: string;
    featured_image?: string;
    excerpt?: string;
    content?: string;
    author?: string;
    published_date?: string;
    status: "Draft" | "Published" | "Archived";
    category?: string;
    tags?: string[];
    date_created?: string;
    date_updated?: string;
}
