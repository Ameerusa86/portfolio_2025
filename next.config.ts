import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zieedwpkkscmcujajpth.supabase.co",
        pathname: "/storage/v1/object/public/project-images/**",
      },
      {
        protocol: "https",
        hostname: "zieedwpkkscmcujajpth.supabase.co",
        pathname: "/storage/v1/object/public/blog-images/**",
      },
    ],
  },
};

export default nextConfig;
