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
  async redirects() {
    return [
      {
        source: '/chat',
        destination: 'https://wa.me/447895910015',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;