import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    serverComponentsExternalPackages: [
      "@uploadthing/react",
      "@uploadthing/shared",
    ],
  },
};

export default nextConfig;
