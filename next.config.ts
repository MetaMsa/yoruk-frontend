import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}:path*`,
      },
      {
        source: "/swagger-ui/:path*",
        destination: `${process.env.BACKEND_URL}swagger-ui/:path*`,
      },
      {
        source: "/v3/api-docs/:path*",
        destination: `${process.env.BACKEND_URL}v3/api-docs/:path*`,
      },
    ];
  },
  images: {
    domains: ['upload.wikimedia.org'],
  },
};

export default nextConfig;
