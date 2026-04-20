import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/country/:path*",
        destination: "http://localhost:8080/country/:path*",
      },
    ];
  },
};

export default nextConfig;
