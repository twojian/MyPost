import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
