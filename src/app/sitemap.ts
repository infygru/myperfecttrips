import { MetadataRoute } from 'next';
import directus from '@/lib/directus/client';
import { readItems } from '@directus/sdk';

const BASE_URL = 'https://myperfecttrips.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static Routes with differentiated priorities
    const staticRoutes: Array<{ path: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }> = [
        { path: '', priority: 1.0, changeFrequency: 'weekly' },
        { path: '/packages', priority: 0.9, changeFrequency: 'daily' },
        { path: '/schengen-visa', priority: 0.9, changeFrequency: 'weekly' },
        { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/corporate-travel', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/mice', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/event-management', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
        { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/services/schengen-visa', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
        { path: '/terms-and-conditions', priority: 0.3, changeFrequency: 'yearly' },
        { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
        { path: '/gdpr-compliance', priority: 0.3, changeFrequency: 'yearly' },
    ];

    const routes = staticRoutes.map(({ path, priority, changeFrequency }) => ({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
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
