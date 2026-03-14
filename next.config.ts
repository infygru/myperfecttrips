import type { NextConfig } from "next";

const nextConfig: any = {
  eslint:      { ignoreDuringBuilds: true },
  typescript:  { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      { protocol: "http",  hostname: "localhost",  port: "8055" },
      { protocol: "http",  hostname: "127.0.0.1",  port: "8055" },
      { protocol: "https", hostname: "**" },
    ],
  },

  // Permanent redirect so /about-us (old URL) doesn't create duplicate-content issues
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
    ];
  },

  // Security + SEO headers on every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Long-cache for static assets
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
