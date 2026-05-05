import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/country/:path*",
        destination: `${process.env.BACKEND_URL}country/:path*`,
      },
    ];
  },
  images: {
    domains: ['upload.wikimedia.org'],
  },
};

export default nextConfig;
