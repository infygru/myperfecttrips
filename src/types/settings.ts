export interface DirectusSettings {
    id: number | string;
    project_name?: string;
    project_url?: string;
    project_color?: string;
    project_logo?: string;
    public_favicon?: string;
    public_background?: string;
    public_note?: string;

    // Custom Added Fields
    hero_image?: string;
    hero_video?: string;
    contact_email?: string;
    contact_phone?: string;
    office_address?: string;
    facebook_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
}
