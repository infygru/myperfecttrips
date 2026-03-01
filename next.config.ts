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

      // Obsolete Taxonomies & Miscellaneous old forms -> Homepage
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
    ]
  },
};

export default nextConfig;