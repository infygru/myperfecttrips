import type { NextConfig } from "next";

const nextConfig: any = {
  images: {
    // Allow all external image sources used in the project
    remotePatterns: [
      // Directus local development
      { protocol: "http", hostname: "localhost", port: "8055" },
      { protocol: "http", hostname: "127.0.0.1", port: "8055" },
      // Directus production (add your VPS IP/domain here)
      { protocol: "https", hostname: "**" },
    ],
  },
  // Optimize for VPS/Docker deployment (Coolify)
  output: "standalone",
  // Disable build-time checks to save significant memory during Coolify builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
