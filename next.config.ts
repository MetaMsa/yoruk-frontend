import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}:path*`,
      }
    ];
  },
  images: {
    domains: ['upload.wikimedia.org'],
  },
};

export default nextConfig;
