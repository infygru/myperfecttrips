import { MetadataRoute } from 'next';
import directus from '@/lib/directus/client';
import { readItems } from '@directus/sdk';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myperfecttrips.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static Routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/packages',
        '/blog',
        '/services',
        '/services/schengen-visa',
        '/corporate-travel',
        '/event-management',
        '/mice',
        '/schengen-visa',
        '/privacy-policy',
        '/terms-and-conditions',
        '/cookie-policy',
        '/gdpr-compliance',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Fetch Packages
    let packageRoutes: MetadataRoute.Sitemap = [];
    try {
        const packages: any[] = await directus.request(readItems('Packages', {
            fields: ['slug', 'date_updated'],
            limit: -1
        }));
        packageRoutes = packages.map((pkg) => ({
            url: `${BASE_URL}/packages/${pkg.slug}`,
            lastModified: new Date(pkg.date_updated || new Date()),
            changeFrequency: 'weekly',
            priority: 0.9,
        }));
    } catch (error) {
        console.error('Sitemap: Failed to fetch packages', error);
    }

    // Fetch Blog Posts
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const posts: any[] = await directus.request(readItems('Blog_Posts', {
            fields: ['slug', 'date_updated'],
            limit: -1
        }));
        blogRoutes = posts.map((post) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: new Date(post.date_updated || new Date()),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Sitemap: Failed to fetch blog posts', error);
    }

    return [...routes, ...packageRoutes, ...blogRoutes];
}
