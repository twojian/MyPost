import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  async rewrites() {
    return [{ source: '/Sparrow-General', destination: '/sparrow-matrix/index.html' }];
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
