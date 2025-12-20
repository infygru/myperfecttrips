import directus from '@/lib/directus/client';
import { readItems } from '@directus/sdk';
import BudgetDestinationsClient from './BudgetDestinationsClient';

export default async function BudgetDestinations() {
  let packages: any[] = [];
  
  try {
    // Fetch 'Packages' (Capital P to match your setup)
    // We select typical fields needed for display + filtering (tags, category)
    packages = await directus.request(readItems('Packages', {
      fields: ['*', 'image.*', 'tags', 'category'],
      limit: 12, // Fetch enough items to populate all tabs
      sort: ['-date_created'], // Optional sorting
    }));
  } catch (error: any) {
    // Silent fail: If 'sort' fails due to permissions, try without sort
    try {
        packages = await directus.request(readItems('Packages', {
            fields: ['*', 'image.*', 'tags', 'category'],
            limit: 12,
        }));
    } catch (e) {
        console.error("❌ Error fetching Budget Packages:", e);
    }
  }

  // If fetch failed completely, hide section
  if (!packages || packages.length === 0) return null;

  // Pass data to Client Component
  return <BudgetDestinationsClient packages={packages} />;
}