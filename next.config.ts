import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "plus.unsplash.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "fiery-robin-727.convex.cloud",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;
