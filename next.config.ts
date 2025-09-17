import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Enable MDX support
const withMDX = createMDX({
  // You can add remark/rehype plugins here if needed later
  options: {
    providerImportSource: "@mdx-js/react",
  },
});

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
      {
        protocol: "https",
        hostname: "zieedwpkkscmcujajpth.supabase.co",
        pathname: "/storage/v1/object/public/profile-images/**",
      },
    ],
  },
  // Include MD/MDX in page extensions so route files can be .mdx if desired
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default withMDX(nextConfig);
