import { createDirectus, rest, staticToken } from '@directus/sdk';

// We use the Token from .env.local to guarantee access
// MAKE SURE 'DIRECTUS_API_TOKEN' IS IN YOUR .env.local FILE
const directus = createDirectus<any>(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(staticToken(process.env.DIRECTUS_API_TOKEN as string))
  .with(rest());

export default directus;

export const getAssetUrl = (id: string | null | undefined) => {
  if (!id || typeof id !== 'string') return '';
  return `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${id}`;
};