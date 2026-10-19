import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';
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
const adminToken = process.env.DIRECTUS_ADMIN_TOKEN || '';

// Admin client — used server-side for reading protected collections
export const directus = createDirectus<CustomDirectusSchema>(directusUrl)
    .with(staticToken(adminToken))
    .with(rest());

// Public client — used client-side (e.g. ContactForm enquiry submissions)
export const directusPublic = createDirectus<CustomDirectusSchema>(directusUrl).with(rest());

export async function getSiteSettings() {
    try {
        const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
        const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';
        const res = await fetch(`${DIRECTUS_URL}/items/site_settings?limit=1`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        const items = data?.data;
        if (Array.isArray(items)) return items[0] || null;
        return items || null;
    } catch {
        return null;
    }
}
