/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for VPS/Docker deployment
  output: 'standalone',

  // Compress responses
  compress: true,

  // Remove X-Powered-By header
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.myperfecttrips.com',
      },
      {
        protocol: 'https',
        hostname: 'directus.myperfecttrips.com',
      },
    ],
    // Required for PDF generator to read image data
    dangerouslyAllowSVG: true,
    // Optimise image formats
    formats: ['image/avif', 'image/webp'],
    // Cache optimised images for 30 days
    minimumCacheTTL: 2592000,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache Next.js static files
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/chat',
        destination: 'https://wa.me/447895910015',
        permanent: true,
      },

      // --- Search Console 404 URL Redirect Maps ---

      // Package & Tour Links -> /packages
      { source: '/packages/dubai-6-nights-7-days-tour-package', destination: '/packages', permanent: true },
      { source: '/gold-package', destination: '/packages', permanent: true },
      { source: '/packages/Paris Tour package with Disney Land', destination: '/packages', permanent: true },
      { source: '/diamond-package', destination: '/packages', permanent: true },

      // Legal & Trust -> /terms-and-conditions
      { source: '/disclaimer', destination: '/terms-and-conditions', permanent: true },
      { source: '/refund-policy', destination: '/terms-and-conditions', permanent: true },
      { source: '/terms-of-use', destination: '/terms-and-conditions', permanent: true },

      // About & Corporate
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/corporate-travel-solutions', destination: '/corporate-travel', permanent: true },
      { source: '/customer-support', destination: '/contact', permanent: true },

      // Obsolete Taxonomies & Miscellaneous -> Homepage
      { source: '/category/uncategorized', destination: '/', permanent: true },
      { source: '/enquiry', destination: '/', permanent: true },

      // Blog/Articles Fallbacks -> Homepage
      { source: '/top-5-reasons-to-visit-turkey-in-2025-a-complete-travel-guide', destination: '/', permanent: true },
      { source: '/other-attractions', destination: '/', permanent: true },
      { source: '/sri-lanka-the-island-paradise-youve-been-waiting-to-explore', destination: '/', permanent: true },
      { source: '/why-you-should-add-azerbaijan-to-your-2025-travel-bucket-list', destination: '/', permanent: true },
      { source: '/dubai-dreams-why-2025-is-the-perfect-year-to-visit-the-city-of-gold', destination: '/', permanent: true },
      { source: '/a-hidden-gem-for-uk-travellers-discover-georgia-in-2025', destination: '/', permanent: true },
      { source: '/services/visa', destination: '/', permanent: true },
      { source: '/attractions', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
