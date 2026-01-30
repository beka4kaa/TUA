import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for Railway deployment
  output: "standalone",
  
  // TypeScript config
  typescript: {
    // Don't fail build on TypeScript errors in production  
    ignoreBuildErrors: false,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
