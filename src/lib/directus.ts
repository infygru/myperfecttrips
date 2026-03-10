import { createDirectus, rest, readSingleton, readItems } from '@directus/sdk';
import type { Package } from '@/types/package';
import type { Enquiry } from '@/types/enquiry';
import type { Lead } from '@/types/lead';
import type { Blog } from '@/types/blog';
import type { DirectusSettings } from '@/types/settings';

interface CustomDirectusSchema {
    packages: Package[];
    enquiries: Enquiry[];
    leads: Lead[];
    blog_posts: Blog[];
    directus_settings: DirectusSettings;
}

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const directus = createDirectus<CustomDirectusSchema>(directusUrl).with(rest());

export async function getSiteSettings() {
    try {
        const result = await directus.request(readSingleton("site_settings" as any));
        // Directus SDK `readSingleton` will return an array directly if the collection is not a true singleton
        if (Array.isArray(result)) {
            return result[0] || null;
        }
        return result;
    } catch {
        try {
            const arr = await directus.request(readItems("site_settings" as any, { limit: 1 }));
            return arr?.[0] || null;
        } catch {
            return null;
        }
    }
}
