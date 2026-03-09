import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
