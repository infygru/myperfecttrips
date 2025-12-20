/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.myperfecttrips.com', // Your Directus Domain
      },
      {
        protocol: 'https',
        hostname: 'directus.myperfecttrips.com', // Just in case
      }
    ],
    // This allows the PDF generator to read the image data
    dangerouslyAllowSVG: true, 
  },
};

export default nextConfig;